import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import jwt from '@fastify/jwt'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from './db.js'
import { completeQuest, ensureProgress, getProgressPayload, replaceProgress } from './progress.js'
import './types.js'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET || JWT_SECRET.length < 24) {
  throw new Error('JWT_SECRET must be set and at least 24 characters')
}

const app = Fastify({
  logger: true,
  trustProxy: true,
})

const corsOriginEnv = process.env.CORS_ORIGIN ?? 'true'
const corsOrigin =
  corsOriginEnv === 'true'
    ? true
    : corsOriginEnv.split(',').map((v) => v.trim()).filter(Boolean)

await app.register(helmet, { contentSecurityPolicy: false })
await app.register(cors, { origin: corsOrigin, credentials: true })
await app.register(rateLimit, {
  max: Number(process.env.RATE_LIMIT_MAX ?? 120),
  timeWindow: process.env.RATE_LIMIT_WINDOW ?? '1 minute',
})
await app.register(jwt, {
  secret: JWT_SECRET,
  sign: { expiresIn: process.env.JWT_EXPIRES_IN ?? '30d' },
})

app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify()
  } catch {
    return reply.code(401).send({ error: 'Unauthorized' })
  }
})

function signToken(user: { id: string; email: string | null; isGuest: boolean }) {
  return app.jwt.sign({
    sub: user.id,
    email: user.email,
    isGuest: user.isGuest,
  })
}

const registerSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  displayName: z.string().trim().min(2).max(40).optional(),
})

const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
})

const claimSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  displayName: z.string().trim().min(2).max(40).optional(),
})

const progressPutSchema = z.object({
  xp: z.number().int().min(0).max(10_000_000),
  badges: z.array(z.string().max(80)).max(200),
  completedQuestIds: z.array(z.string().max(80)).max(2000),
})

const completeSchema = z.object({
  questId: z.string().min(1).max(80),
  xpReward: z.number().int().min(0).max(10_000),
  badgeId: z.string().min(1).max(80).optional(),
})

app.get('/health', async () => ({
  ok: true,
  service: 'code-fatality-api',
  time: new Date().toISOString(),
}))

app.post(
  '/v1/auth/guest',
  { config: { rateLimit: { max: 20, timeWindow: '1 minute' } } },
  async () => {
    const user = await prisma.user.create({
      data: {
        isGuest: true,
        displayName: 'Warrior',
        progress: { create: { xp: 0, badges: [] } },
      },
    })
    return {
      token: signToken(user),
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        isGuest: user.isGuest,
      },
      progress: await getProgressPayload(user.id),
    }
  },
)

app.post(
  '/v1/auth/register',
  { config: { rateLimit: { max: 10, timeWindow: '1 minute' } } },
  async (request, reply) => {
    const body = registerSchema.safeParse(request.body)
    if (!body.success) return reply.code(400).send({ error: 'Invalid signup payload' })

    const email = body.data.email.toLowerCase()
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return reply.code(409).send({ error: 'Email already registered' })

    const passwordHash = await bcrypt.hash(body.data.password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName: body.data.displayName ?? email.split('@')[0],
        isGuest: false,
        progress: { create: { xp: 0, badges: [] } },
      },
    })

    return {
      token: signToken(user),
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        isGuest: user.isGuest,
      },
      progress: await getProgressPayload(user.id),
    }
  },
)

app.post(
  '/v1/auth/login',
  { config: { rateLimit: { max: 15, timeWindow: '1 minute' } } },
  async (request, reply) => {
    const body = loginSchema.safeParse(request.body)
    if (!body.success) return reply.code(400).send({ error: 'Invalid login payload' })

    const email = body.data.email.toLowerCase()
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user?.passwordHash) return reply.code(401).send({ error: 'Invalid email or password' })

    const ok = await bcrypt.compare(body.data.password, user.passwordHash)
    if (!ok) return reply.code(401).send({ error: 'Invalid email or password' })

    await ensureProgress(user.id)
    return {
      token: signToken(user),
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        isGuest: user.isGuest,
      },
      progress: await getProgressPayload(user.id),
    }
  },
)

app.post(
  '/v1/auth/claim',
  {
    preHandler: [app.authenticate],
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
  },
  async (request, reply) => {
    const body = claimSchema.safeParse(request.body)
    if (!body.success) return reply.code(400).send({ error: 'Invalid claim payload' })

    const current = await prisma.user.findUnique({ where: { id: request.user.sub } })
    if (!current) return reply.code(404).send({ error: 'User not found' })
    if (!current.isGuest) return reply.code(400).send({ error: 'Account already registered' })

    const email = body.data.email.toLowerCase()
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return reply.code(409).send({ error: 'Email already registered' })

    const passwordHash = await bcrypt.hash(body.data.password, 12)
    const user = await prisma.user.update({
      where: { id: current.id },
      data: {
        email,
        passwordHash,
        displayName: body.data.displayName ?? current.displayName ?? email.split('@')[0],
        isGuest: false,
      },
    })

    return {
      token: signToken(user),
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        isGuest: user.isGuest,
      },
      progress: await getProgressPayload(user.id),
    }
  },
)

app.get('/v1/auth/me', { preHandler: [app.authenticate] }, async (request, reply) => {
  const user = await prisma.user.findUnique({
    where: { id: request.user.sub },
    select: { id: true, email: true, displayName: true, isGuest: true, createdAt: true },
  })
  if (!user) return reply.code(404).send({ error: 'User not found' })
  return { user, progress: await getProgressPayload(user.id) }
})

app.get('/v1/progress', { preHandler: [app.authenticate] }, async (request) => {
  await ensureProgress(request.user.sub)
  return getProgressPayload(request.user.sub)
})

app.put('/v1/progress', { preHandler: [app.authenticate] }, async (request, reply) => {
  const body = progressPutSchema.safeParse(request.body)
  if (!body.success) return reply.code(400).send({ error: 'Invalid progress payload' })
  return replaceProgress({
    userId: request.user.sub,
    xp: body.data.xp,
    badges: body.data.badges,
    completedQuestIds: body.data.completedQuestIds,
  })
})

app.post('/v1/progress/complete', { preHandler: [app.authenticate] }, async (request, reply) => {
  const body = completeSchema.safeParse(request.body)
  if (!body.success) return reply.code(400).send({ error: 'Invalid complete payload' })
  return completeQuest({
    userId: request.user.sub,
    questId: body.data.questId,
    xpReward: body.data.xpReward,
    badgeId: body.data.badgeId,
  })
})

app.post('/v1/users/anonymous', async () => {
  const user = await prisma.user.create({
    data: {
      isGuest: true,
      displayName: 'Warrior',
      progress: { create: { xp: 0, badges: [] } },
    },
  })
  return { userId: user.id, token: signToken(user) }
})

const port = Number(process.env.PORT ?? 4000)

try {
  await app.listen({ port, host: '0.0.0.0' })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}

import { prisma } from './db.js'

export async function getProgressPayload(userId: string) {
  const [progress, completions] = await Promise.all([
    prisma.progress.findUnique({ where: { userId } }),
    prisma.questCompletion.findMany({
      where: { userId },
      select: { questId: true },
      orderBy: { completedAt: 'asc' },
    }),
  ])

  return {
    userId,
    xp: progress?.xp ?? 0,
    badges: progress?.badges ?? [],
    completedQuestIds: completions.map((c) => c.questId),
  }
}

export async function ensureProgress(userId: string) {
  return prisma.progress.upsert({
    where: { userId },
    create: { userId, xp: 0, badges: [] },
    update: {},
  })
}

export async function replaceProgress(input: {
  userId: string
  xp: number
  badges: string[]
  completedQuestIds: string[]
}) {
  const uniqueQuestIds = [...new Set(input.completedQuestIds)]

  await prisma.$transaction(async (tx) => {
    await tx.progress.upsert({
      where: { userId: input.userId },
      create: { userId: input.userId, xp: input.xp, badges: input.badges },
      update: { xp: input.xp, badges: input.badges },
    })

    await tx.questCompletion.deleteMany({
      where: {
        userId: input.userId,
        questId: { notIn: uniqueQuestIds },
      },
    })

    if (uniqueQuestIds.length > 0) {
      await tx.questCompletion.createMany({
        data: uniqueQuestIds.map((questId) => ({
          userId: input.userId,
          questId,
          xpEarned: 0,
        })),
        skipDuplicates: true,
      })
    }
  })

  return getProgressPayload(input.userId)
}

export async function completeQuest(input: {
  userId: string
  questId: string
  xpReward: number
  badgeId?: string
}) {
  const existing = await prisma.questCompletion.findUnique({
    where: {
      userId_questId: {
        userId: input.userId,
        questId: input.questId,
      },
    },
  })
  if (existing) return getProgressPayload(input.userId)

  await prisma.$transaction(async (tx) => {
    await tx.questCompletion.create({
      data: {
        userId: input.userId,
        questId: input.questId,
        xpEarned: input.xpReward,
      },
    })

    const progress = await tx.progress.upsert({
      where: { userId: input.userId },
      create: {
        userId: input.userId,
        xp: input.xpReward,
        badges: input.badgeId ? [input.badgeId] : [],
      },
      update: {
        xp: { increment: input.xpReward },
      },
    })

    if (input.badgeId && !progress.badges.includes(input.badgeId)) {
      await tx.progress.update({
        where: { userId: input.userId },
        data: { badges: { push: input.badgeId } },
      })
    }
  })

  return getProgressPayload(input.userId)
}

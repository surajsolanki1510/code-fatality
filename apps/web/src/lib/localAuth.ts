type AuthUser = {
  id: string
  email: string | null
  displayName: string | null
  isGuest: boolean
}

const USERS_KEY = 'codefatality.localUsers.v1'
const PROGRESS_KEY = 'codefatality.localProgress.v1'

export type LocalProgress = {
  userId: string
  xp: number
  completedQuestIds: string[]
  badges: string[]
}

type LocalAccount = AuthUser & {
  passwordHash?: string
}

export const LOCAL_TOKEN_PREFIX = 'local:'

export function isLocalToken(token: string | null | undefined): boolean {
  return Boolean(token?.startsWith(LOCAL_TOKEN_PREFIX))
}

function loadAccounts(): Record<string, LocalAccount> {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '{}') as Record<string, LocalAccount>
  } catch {
    return {}
  }
}

function saveAccounts(accounts: Record<string, LocalAccount>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(accounts))
}

function loadProgressMap(): Record<string, LocalProgress> {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') as Record<string, LocalProgress>
  } catch {
    return {}
  }
}

function saveProgressMap(map: Record<string, LocalProgress>) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(map))
}

export function getLocalProgress(userId: string): LocalProgress {
  return (
    loadProgressMap()[userId] ?? {
      userId,
      xp: 0,
      completedQuestIds: [],
      badges: [],
    }
  )
}

export function saveLocalProgress(progress: LocalProgress) {
  const map = loadProgressMap()
  map[progress.userId] = progress
  saveProgressMap(map)
}

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`codefatality:${password}`)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function toUser(account: LocalAccount): AuthUser {
  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    isGuest: account.isGuest,
  }
}

function authPayload(account: LocalAccount) {
  const progress = getLocalProgress(account.id)
  return {
    token: `${LOCAL_TOKEN_PREFIX}${account.id}`,
    user: toUser(account),
    progress,
  }
}

export async function localRegister(email: string, password: string, displayName?: string) {
  const normalized = email.trim().toLowerCase()
  const accounts = loadAccounts()
  if (accounts[normalized]) {
    throw new Error('Email already registered')
  }
  const account: LocalAccount = {
    id: crypto.randomUUID(),
    email: normalized,
    displayName: displayName?.trim() || normalized.split('@')[0] || 'Warrior',
    isGuest: false,
    passwordHash: await hashPassword(password),
  }
  accounts[normalized] = account
  saveAccounts(accounts)
  saveLocalProgress(getLocalProgress(account.id))
  return authPayload(account)
}

export async function localLogin(email: string, password: string) {
  const normalized = email.trim().toLowerCase()
  const accounts = loadAccounts()
  const account = accounts[normalized]
  if (!account?.passwordHash) {
    throw new Error('Invalid email or password')
  }
  const hash = await hashPassword(password)
  if (hash !== account.passwordHash) {
    throw new Error('Invalid email or password')
  }
  return authPayload(account)
}

export function localGuest() {
  const account: LocalAccount = {
    id: crypto.randomUUID(),
    email: null,
    displayName: 'Warrior',
    isGuest: true,
  }
  const accounts = loadAccounts()
  accounts[`guest:${account.id}`] = account
  saveAccounts(accounts)
  saveLocalProgress(getLocalProgress(account.id))
  return authPayload(account)
}

export async function localClaim(
  currentUserId: string,
  email: string,
  password: string,
  displayName?: string,
) {
  const normalized = email.trim().toLowerCase()
  const accounts = loadAccounts()
  if (accounts[normalized]) {
    throw new Error('Email already registered')
  }
  const guestKey = Object.keys(accounts).find((key) => accounts[key].id === currentUserId)
  const guest = guestKey ? accounts[guestKey] : undefined
  if (!guest?.isGuest) {
    throw new Error('Start as guest first')
  }
  const next: LocalAccount = {
    ...guest,
    email: normalized,
    displayName: displayName?.trim() || guest.displayName || normalized.split('@')[0] || 'Warrior',
    isGuest: false,
    passwordHash: await hashPassword(password),
  }
  if (guestKey) delete accounts[guestKey]
  accounts[normalized] = next
  saveAccounts(accounts)
  return authPayload(next)
}

export function isNetworkAuthError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const msg = err.message.toLowerCase()
  return (
    err.name === 'AbortError' ||
    err.name === 'TypeError' ||
    msg.includes('failed to fetch') ||
    msg.includes('network') ||
    msg.includes('timeout') ||
    msg.includes('aborted')
  )
}

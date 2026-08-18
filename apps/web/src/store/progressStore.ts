import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  isLocalToken,
  isNetworkAuthError,
  localClaim,
  localGuest,
  localLogin,
  localRegister,
  saveLocalProgress,
} from '../lib/localAuth'

export type AuthUser = {
  id: string
  email: string | null
  displayName: string | null
  isGuest: boolean
}

type ProgressPayload = {
  userId: string
  xp: number
  completedQuestIds: string[]
  badges: string[]
}

type AuthResponse = {
  token: string
  user: AuthUser
  progress: ProgressPayload
}

export type ProgressState = {
  token: string | null
  user: AuthUser | null
  userId: string | null
  booted: boolean
  loading: boolean
  xp: number
  completedQuestIds: string[]
  badges: string[]
  bootProgress: () => Promise<void>
  register: (email: string, password: string, displayName?: string) => Promise<string | null>
  login: (email: string, password: string) => Promise<string | null>
  claimAccount: (email: string, password: string, displayName?: string) => Promise<string | null>
  playAsGuest: () => Promise<string | null>
  logout: () => void
  completeQuest: (questId: string, xpReward: number, badgeId?: string) => void
  resetProgress: () => void
  isQuestComplete: (questId: string) => boolean
}

const initial = {
  token: null as string | null,
  user: null as AuthUser | null,
  userId: null as string | null,
  booted: false,
  loading: false,
  xp: 0,
  completedQuestIds: [] as string[],
  badges: [] as string[],
}

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:4000' : 'https://code-fatality.onrender.com')

function applyAuth(set: (partial: Partial<ProgressState>) => void, data: AuthResponse) {
  set({
    token: data.token,
    user: data.user,
    userId: data.user.id,
    xp: data.progress.xp,
    completedQuestIds: data.progress.completedQuestIds,
    badges: data.progress.badges,
    booted: true,
    loading: false,
  })
}

async function api<T>(path: string, init?: RequestInit, token?: string | null): Promise<T> {
  const headers = new Headers(init?.headers)
  if (!headers.has('Content-Type') && init?.body) headers.set('Content-Type', 'application/json')
  if (token && !isLocalToken(token)) headers.set('Authorization', `Bearer ${token}`)

  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...init, headers, signal: controller.signal })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error((data as { error?: string }).error ?? `Request failed (${res.status})`)
    }
    return data as T
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Server timed out')
    }
    throw err
  } finally {
    window.clearTimeout(timer)
  }
}

function snapshotLocalProgress() {
  const state = useProgressStore.getState()
  if (!state.userId || !isLocalToken(state.token)) return
  saveLocalProgress({
    userId: state.userId,
    xp: state.xp,
    completedQuestIds: state.completedQuestIds,
    badges: state.badges,
  })
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...initial,
      bootProgress: async () => {
        if (get().booted || get().loading) return
        set({ loading: true })
        try {
          const token = get().token
          if (token && isLocalToken(token)) {
            set({ booted: true, loading: false })
            return
          }
          if (token) {
            const me = await api<{ user: AuthUser; progress: ProgressPayload }>(
              '/v1/auth/me',
              undefined,
              token,
            )
            set({
              user: me.user,
              userId: me.user.id,
              xp: me.progress.xp,
              completedQuestIds: me.progress.completedQuestIds,
              badges: me.progress.badges,
              booted: true,
              loading: false,
            })
            return
          }
          set({ booted: true, loading: false })
        } catch {
          set({ booted: true, loading: false })
        }
      },
      register: async (email, password, displayName) => {
        try {
          const data = await api<AuthResponse>('/v1/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email: email.trim(), password, displayName }),
          })
          applyAuth(set, data)
          return null
        } catch (err) {
          if (!isNetworkAuthError(err)) {
            return err instanceof Error ? err.message : 'Signup failed'
          }
          try {
            applyAuth(set, await localRegister(email, password, displayName))
            return null
          } catch (localErr) {
            return localErr instanceof Error ? localErr.message : 'Signup failed'
          }
        }
      },
      login: async (email, password) => {
        try {
          const data = await api<AuthResponse>('/v1/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: email.trim(), password }),
          })
          applyAuth(set, data)
          return null
        } catch (err) {
          if (!isNetworkAuthError(err)) {
            return err instanceof Error ? err.message : 'Login failed'
          }
          try {
            applyAuth(set, await localLogin(email, password))
            return null
          } catch (localErr) {
            return localErr instanceof Error ? localErr.message : 'Login failed'
          }
        }
      },
      claimAccount: async (email, password, displayName) => {
        try {
          const token = get().token
          if (!token) return 'Start as guest first'
          if (isLocalToken(token)) {
            applyAuth(set, await localClaim(get().userId ?? '', email, password, displayName))
            return null
          }
          const data = await api<AuthResponse>(
            '/v1/auth/claim',
            {
              method: 'POST',
              body: JSON.stringify({ email: email.trim(), password, displayName }),
            },
            token,
          )
          applyAuth(set, data)
          return null
        } catch (err) {
          if (!isNetworkAuthError(err)) {
            return err instanceof Error ? err.message : 'Could not save account'
          }
          try {
            applyAuth(set, await localClaim(get().userId ?? '', email, password, displayName))
            return null
          } catch (localErr) {
            return localErr instanceof Error ? localErr.message : 'Could not save account'
          }
        }
      },
      playAsGuest: async () => {
        try {
          const data = await api<AuthResponse>('/v1/auth/guest', { method: 'POST' })
          applyAuth(set, data)
          return null
        } catch (err) {
          if (!isNetworkAuthError(err)) {
            return err instanceof Error ? err.message : 'Guest start failed'
          }
          applyAuth(set, localGuest())
          return null
        }
      },
      logout: () => {
        set({ ...initial, booted: true })
      },
      completeQuest: (questId, xpReward, badgeId) => {
        if (get().completedQuestIds.includes(questId)) return
        set((s) => ({
          xp: s.xp + xpReward,
          completedQuestIds: [...s.completedQuestIds, questId],
          badges: badgeId && !s.badges.includes(badgeId) ? [...s.badges, badgeId] : s.badges,
        }))
        snapshotLocalProgress()
        const token = get().token
        if (!token || isLocalToken(token)) return
        void api<ProgressPayload>(
          '/v1/progress/complete',
          {
            method: 'POST',
            body: JSON.stringify({ questId, xpReward, badgeId }),
          },
          token,
        ).then((remote) => {
          set({
            xp: remote.xp,
            completedQuestIds: remote.completedQuestIds,
            badges: remote.badges,
          })
        })
      },
      resetProgress: () => {
        const token = get().token
        const user = get().user
        set({
          ...initial,
          token,
          user,
          userId: user?.id ?? null,
          booted: true,
        })
        if (token) {
          void api(
            '/v1/progress',
            {
              method: 'PUT',
              body: JSON.stringify({ xp: 0, badges: [], completedQuestIds: [] }),
            },
            token,
          )
        }
      },
      isQuestComplete: (questId) => get().completedQuestIds.includes(questId),
    }),
    {
      name: 'codex.progress.v3',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        userId: state.userId,
        xp: state.xp,
        completedQuestIds: state.completedQuestIds,
        badges: state.badges,
      }),
    },
  ),
)

import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArenaButton, ArenaShell } from '../components/ArenaShell'
import { useProgressStore } from '../store/progressStore'

type Mode = 'login' | 'signup' | 'claim'

export function AuthPage() {
  const navigate = useNavigate()
  const user = useProgressStore((s) => s.user)
  const login = useProgressStore((s) => s.login)
  const register = useProgressStore((s) => s.register)
  const claimAccount = useProgressStore((s) => s.claimAccount)
  const playAsGuest = useProgressStore((s) => s.playAsGuest)

  const [mode, setMode] = useState<Mode>(user?.isGuest ? 'claim' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (user && !user.isGuest) {
      navigate('/map', { replace: true })
    }
  }, [user, navigate])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    let err: string | null = null
    if (mode === 'login') err = await login(email, password)
    else if (mode === 'signup') err = await register(email, password, displayName || undefined)
    else err = await claimAccount(email, password, displayName || undefined)
    setBusy(false)
    if (err) {
      setError(err)
      return
    }
    navigate('/map')
  }

  return (
    <ArenaShell>
      <div className="auth-page">
        <Link to="/" className="auth-page__back">
          ← Back
        </Link>

        <div className="auth-tabs" role="tablist" aria-label="Auth mode">
          <button
            type="button"
            role="tab"
            className={mode === 'login' ? 'is-active' : ''}
            aria-selected={mode === 'login'}
            onClick={() => setMode('login')}
          >
            LOGIN
          </button>
          <button
            type="button"
            role="tab"
            className={mode === 'signup' ? 'is-active' : ''}
            aria-selected={mode === 'signup'}
            onClick={() => setMode('signup')}
          >
            JOIN
          </button>
          {user?.isGuest && (
            <button
              type="button"
              role="tab"
              className={mode === 'claim' ? 'is-active' : ''}
              aria-selected={mode === 'claim'}
              onClick={() => setMode('claim')}
            >
              SAVE
            </button>
          )}
        </div>

        <h1 className="auth-page__title">
          {mode === 'login' ? 'LOGIN' : mode === 'signup' ? 'JOIN THE ARENA' : 'SAVE RUN'}
        </h1>
        <p className="auth-page__sub">
          {mode === 'claim'
            ? 'Keep this guest progress on a real account.'
            : mode === 'login'
              ? 'Welcome back, warrior. Enter email + password.'
              : 'Create your fighter ID. Progress syncs to the cloud.'}
        </p>

        <form className="auth-form" onSubmit={onSubmit}>
          {(mode === 'signup' || mode === 'claim') && (
            <label>
              Fighter name
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nova"
                maxLength={40}
                autoComplete="nickname"
              />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>

          {error && <p className="auth-form__error">{error}</p>}

          <ArenaButton type="submit" variant="gold" disabled={busy}>
            {busy
              ? 'Working…'
              : mode === 'login'
                ? 'LOGIN'
                : mode === 'signup'
                  ? 'CREATE ID'
                  : 'SAVE PROGRESS'}
          </ArenaButton>
        </form>

        <button
          type="button"
          className="auth-page__guest"
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            const err = await playAsGuest()
            setBusy(false)
            if (err) setError(err)
            else navigate('/map')
          }}
        >
          Skip — play as guest
        </button>
      </div>
    </ArenaShell>
  )
}

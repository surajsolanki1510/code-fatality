import { useState, type FormEvent } from 'react'
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
        <h1 className="auth-page__title">
          {mode === 'login' ? 'SIGN IN' : mode === 'signup' ? 'CREATE ACCOUNT' : 'SAVE YOUR PROGRESS'}
        </h1>
        <p className="auth-page__sub">
          {mode === 'claim'
            ? 'Turn this guest run into a real account so progress survives any device.'
            : 'Your progress syncs to the database — ready for real players.'}
        </p>

        <form className="auth-form" onSubmit={onSubmit}>
          {(mode === 'signup' || mode === 'claim') && (
            <label>
              Display name
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Nova"
                maxLength={40}
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
            {busy ? 'Working…' : mode === 'login' ? 'Sign in' : mode === 'signup' ? 'Create account' : 'Save account'}
          </ArenaButton>
        </form>

        <div className="auth-page__switch">
          {mode !== 'login' && (
            <button type="button" onClick={() => setMode('login')}>
              Have an account? Sign in
            </button>
          )}
          {mode !== 'signup' && (
            <button type="button" onClick={() => setMode('signup')}>
              New here? Create account
            </button>
          )}
          {user?.isGuest && mode !== 'claim' && (
            <button type="button" onClick={() => setMode('claim')}>
              Save this guest progress
            </button>
          )}
        </div>

        <button
          type="button"
          className="auth-page__guest"
          onClick={async () => {
            setBusy(true)
            const err = await playAsGuest()
            setBusy(false)
            if (err) setError(err)
            else navigate('/map')
          }}
        >
          Continue as guest
        </button>
      </div>
    </ArenaShell>
  )
}

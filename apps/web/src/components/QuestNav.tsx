import { Link, useParams } from 'react-router-dom'
import { BRAND } from '../config/brand'
import { getChapterProgress } from '../data/quests'
import { useProgressStore } from '../store/progressStore'

/** Minimal nav — no XP/rank clutter */
export function QuestNav({ worldId, backTo }: { worldId?: string; backTo?: string }) {
  const params = useParams()
  const wId = worldId ?? params.worldId
  const completed = useProgressStore((s) => s.completedQuestIds)
  const progress = wId ? getChapterProgress(wId, completed) : null

  return (
    <header className="quest-nav">
      <Link to={backTo ?? (wId ? `/world/${wId}` : '/map')} className="quest-nav__back">
        ← Chapters
      </Link>
      <span className="quest-nav__brand">{BRAND.short}</span>
      {wId && (
        <Link to={`/notebook/${wId}`} className="quest-nav__link">
          Notebook
        </Link>
      )}
      {progress && (
        <span className="quest-nav__progress">
          {progress.done}/{progress.total} cleared
        </span>
      )}
    </header>
  )
}

export function MapNav() {
  const user = useProgressStore((s) => s.user)
  const logout = useProgressStore((s) => s.logout)

  return (
    <header className="quest-nav quest-nav--map">
      <Link to="/" className="quest-nav__brand">
        {BRAND.short}
      </Link>
      <div className="quest-nav__right">
        <Link to="/map" className="quest-nav__link">
          Realms
        </Link>
        {user?.isGuest === false ? (
          <button type="button" className="quest-nav__link quest-nav__btn" onClick={logout}>
            Log out
          </button>
        ) : (
          <Link to="/auth" className="quest-nav__link">
            Save account
          </Link>
        )}
      </div>
    </header>
  )
}

export function ArenaButton({
  children,
  variant = 'primary',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'gold' | 'ghost'
}) {
  const className = [
    'arena-btn',
    variant === 'gold' ? 'arena-btn--gold' : '',
    variant === 'ghost' ? 'arena-btn--ghost' : '',
    props.className ?? '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <button type="button" {...props} className={className}>
      {children}
    </button>
  )
}

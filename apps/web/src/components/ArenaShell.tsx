import { Link } from 'react-router-dom'
import { BRAND } from '../config/brand'
import { useProgressStore } from '../store/progressStore'
import { ArenaParticles } from './ArenaParticles'

const XP_PER_LEVEL = 500

type ShellProps = {
  children: React.ReactNode
  /** Full-bleed cinematic landing (no frame chrome) */
  cinematic?: boolean
  bgImage?: string
}

export function ArenaShell({ children, cinematic = false, bgImage }: ShellProps) {
  return (
    <div className={`arena-app${cinematic ? ' arena-app--cinematic' : ''}`}>
      <div
        className="arena-bg"
        style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
        aria-hidden
      />
      <div className="arena-bg-overlay" aria-hidden />
      <div className="arena-vignette" aria-hidden />
      <ArenaParticles count={cinematic ? 55 : 28} />
      <div className={cinematic ? 'arena-stage' : 'arena-frame'}>{children}</div>
    </div>
  )
}

export function ArenaHud() {
  const xp = useProgressStore((s) => s.xp)
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const pct = ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100

  return (
    <header className="arena-hud">
      <Link to="/map" className="arena-hud__brand">
        {BRAND.short}
      </Link>
      <div className="arena-xp">
        <div className="arena-xp__label">
          <span>RANK {level}</span>
          <span>{xp} XP</span>
        </div>
        <div className="arena-xp__track">
          <div className="arena-xp__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className="arena-hud__ko">KO METER</div>
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

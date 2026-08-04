import { useMemo } from 'react'

/** Lightweight ember / spark particles for arena atmosphere */
export function ArenaParticles({ count = 40 }: { count?: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 6}s`,
        duration: `${4 + Math.random() * 7}s`,
        size: `${2 + Math.random() * 4}px`,
        opacity: 0.25 + Math.random() * 0.55,
      })),
    [count],
  )

  return (
    <div className="arena-particles" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="arena-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  )
}

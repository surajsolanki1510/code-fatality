import { useMemo, useState, type CSSProperties } from 'react'
import { CSS_LAB_BY_ID } from '../../data/quests/cssLabs'
import type { QuestDef } from '../../data/quests/types'
import { buildLabCss } from '../../lib/buildLabCss'
import type { CheckResult } from '../../lib/validateQuest'

type Props = {
  quest: QuestDef
  css: string
  checkResults?: CheckResult[]
  won: boolean
}

const SLOT_W = 92

function FrogSvg({ hue = '#5cd65c', landed, uid = '0' }: { hue?: string; landed?: boolean; uid?: string }) {
  return (
    <svg
      className={`froggy-frog-svg${landed ? ' is-landed' : ''}`}
      viewBox="0 0 96 88"
      width={SLOT_W - 8}
      height={72}
      aria-hidden
    >
      <defs>
        <radialGradient id={`frogBody-${uid}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor={hue} />
          <stop offset="100%" stopColor="#2d8a2d" />
        </radialGradient>
        <filter id={`frogShadow-${uid}`}>
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.35" />
        </filter>
      </defs>
      <ellipse cx="48" cy="72" rx="28" ry="8" fill="rgba(0,0,0,0.18)" />
      <g filter={`url(#frogShadow-${uid})`}>
        <ellipse cx="48" cy="54" rx="36" ry="28" fill={`url(#frogBody-${uid})`} />
        <ellipse cx="48" cy="56" rx="32" ry="24" fill={hue} opacity="0.85" />
        <circle cx="30" cy="34" r="16" fill={hue} />
        <circle cx="66" cy="34" r="16" fill={hue} />
        <circle cx="30" cy="34" r="10" fill="#fff" />
        <circle cx="66" cy="34" r="10" fill="#fff" />
        <circle cx="32" cy="34" r="5" fill="#1a3a1a" />
        <circle cx="68" cy="34" r="5" fill="#1a3a1a" />
        <circle cx="33" cy="32" r="2" fill="#fff" opacity="0.9" />
        <circle cx="69" cy="32" r="2" fill="#fff" opacity="0.9" />
        <path d="M40 64 Q48 72 56 64" stroke="#1f5c1f" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <ellipse cx="38" cy="58" rx="5" ry="3" fill="#ff9ec8" opacity="0.5" />
        <ellipse cx="58" cy="58" rx="5" ry="3" fill="#ff9ec8" opacity="0.5" />
      </g>
    </svg>
  )
}

function LilySvg({ glowing, uid = '0' }: { glowing?: boolean; uid?: string }) {
  return (
    <svg
      viewBox="0 0 100 44"
      width={SLOT_W}
      height={38}
      aria-hidden
      className={`froggy-lily-svg${glowing ? ' is-glow' : ''}`}
    >
      <defs>
        <radialGradient id={`lilyGrad-${uid}`} cx="50%" cy="40%">
          <stop offset="0%" stopColor="#7ee87e" />
          <stop offset="100%" stopColor="#2d7a2d" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="38" rx="44" ry="10" fill="rgba(0,0,0,0.2)" />
      <ellipse cx="50" cy="28" rx="46" ry="15" fill={`url(#lilyGrad-${uid})`} />
      <ellipse cx="50" cy="26" rx="38" ry="11" fill="#6dd66d" />
      <path d="M50 10 L56 24 L44 24 Z" fill="#5ecf5e" />
      <path d="M50 10 L54 20 L46 20 Z" fill="#8ef08e" opacity="0.6" />
    </svg>
  )
}

function PondDecor() {
  return (
    <>
      <div className="froggy-pond-scene__sky" aria-hidden />
      <div className="froggy-pond-scene__water" aria-hidden />
      <div className="froggy-pond-scene__ripples" aria-hidden />
      <div className="froggy-pond-scene__reeds" aria-hidden />
      <div className="froggy-pond-scene__fireflies" aria-hidden />
    </>
  )
}

/** Each flex item = frog on its own lily pad — always moves together */
export function CssLabBoard({ quest, css, checkResults, won }: Props) {
  const lab = CSS_LAB_BY_ID[quest.id]
  const [phoneW, setPhoneW] = useState(100)
  if (!lab) return null

  const board = lab.board
  const id = board.target.replace(/^#/, '')
  const passedCount = checkResults?.filter((r) => r.passed).length ?? 0
  const allPassed = passedCount === quest.objectives.length
  const hasTransition = /transition\s*:/i.test(css)

  const liveCss = useMemo(
    () => buildLabCss(board.target, board.before, board.after, css, board.mode),
    [board, css],
  )

  return (
    <div className={`froggy-board froggy-board--${board.mode}${won ? ' is-won' : ''}${allPassed ? ' is-solved' : ''}`}>
      <style>{`
        .froggy-board .lab-target {
          box-sizing: border-box;
          position: relative;
          z-index: 2;
        }
        .froggy-board--flex .lab-target {
          width: 100%;
          min-height: 260px;
          gap: 1rem;
          padding: 1.75rem;
        }
        /* One slot = lily pad + frog — flex moves the whole unit */
        .froggy-board--flex .froggy-slot {
          flex-shrink: 0;
          width: ${SLOT_W}px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .froggy-board--flex .froggy-slot__frog {
          margin-bottom: -6px;
          z-index: 2;
          line-height: 0;
        }
        .froggy-board--flex .froggy-slot__pad {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 1;
        }
        .froggy-board--flex .froggy-slot__label {
          font-size: 0.65rem;
          font-weight: 800;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.06em;
          margin-top: 0.1rem;
        }
        .froggy-board--flex.is-solved .froggy-slot {
          animation: froggy-hop 0.6s ease;
        }
        .froggy-board--flex.is-solved .froggy-slot .froggy-frog-svg {
          transform: translateY(4px);
        }
        .froggy-board--grid .lab-target {
          width: 100%;
          min-height: 220px;
          padding: 1rem;
        }
        .froggy-board--grid .lab-cell {
          min-height: 68px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          font-weight: 800;
          font-size: 1rem;
          color: #1a3a1a;
          background: linear-gradient(180deg, #9ae89a 0%, #5cb85c 100%);
          box-shadow: 0 4px 0 #3d7a3d, 0 8px 24px rgba(0,0,0,0.15);
        }
        .froggy-board #orb,
        .froggy-board #pulse {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 1.75rem;
          cursor: pointer;
          background: linear-gradient(145deg, #e879f9, #9333ea);
          box-shadow: 0 8px 0 #6b21a8, 0 0 40px rgba(192,132,252,0.4);
        }
        .froggy-board #orb:not(.has-transition):hover {
          animation: froggy-shake 0.35s ease;
        }
        .froggy-board--transition,
        .froggy-board--animation {
          display: grid;
          place-items: center;
        }
        .froggy-board--responsive .lab-target {
          width: 100%;
          padding: 1rem;
          min-height: 160px;
        }
        .froggy-board--responsive .lab-cell {
          flex: 1;
          min-height: 72px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          font-weight: 800;
          background: linear-gradient(180deg, #7dd3fc, #0284c7);
          box-shadow: 0 4px 0 #0369a1;
        }
        @keyframes froggy-hop {
          0%, 100% { transform: translateY(0); }
          35% { transform: translateY(-18px) scale(1.05); }
          55% { transform: translateY(4px); }
        }
        @keyframes froggy-shake {
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        ${liveCss}
      `}</style>

      {board.mode === 'flex' && (
        <div className="froggy-pond-scene">
          <PondDecor />
          <div className="froggy-pond-wrap">
            <div id={id} className="lab-target froggy-pond">
              {board.pieces.map((p) => (
                <div key={p.id} className="froggy-slot" title={`Frog ${p.label}`}>
                  <div className="froggy-slot__frog">
                    <FrogSvg hue={p.hue} landed={allPassed} uid={p.id} />
                  </div>
                  <div className="froggy-slot__pad">
                    <LilySvg glowing={allPassed} uid={p.id} />
                    <span className="froggy-slot__label">{p.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {allPassed && (
            <div className="froggy-pond-scene__sparkles" aria-hidden>
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="froggy-sparkle" style={{ '--i': i } as CSSProperties} />
              ))}
            </div>
          )}
        </div>
      )}

      {(board.mode === 'grid' || board.boardClass?.includes('responsive-grid')) && (
        <div className="froggy-garden-scene">
          <div id={id} className="lab-target froggy-garden">
            {board.pieces.map((p) => (
              <div key={p.id} className="lab-cell">
                {p.label}
              </div>
            ))}
          </div>
        </div>
      )}

      {board.mode === 'transition' && (
        <div className="froggy-glow-scene">
          <div id="orb" className={hasTransition ? 'has-transition' : ''} title="Hover me">
            ✦
          </div>
        </div>
      )}

      {board.mode === 'animation' && (
        <div className="froggy-beat-scene">
          <div id="pulse">♥</div>
        </div>
      )}

      {board.mode === 'responsive' && (
        <div className="froggy-shrink-scene" style={{ width: `${phoneW}%`, maxWidth: '100%' }}>
          <div id={id} className="lab-target froggy-shrink-row">
            {board.pieces.map((p) => (
              <div key={p.id} className="lab-cell">
                {p.label}
              </div>
            ))}
          </div>
          <label className="froggy-shrink-scene__slider">
            Screen width
            <input type="range" min={38} max={100} value={phoneW} onChange={(e) => setPhoneW(Number(e.target.value))} />
          </label>
        </div>
      )}

      {won && (
        <div className="froggy-board__win">
          <span className="froggy-board__win-emoji">🐸</span>
          Cleared!
        </div>
      )}
    </div>
  )
}

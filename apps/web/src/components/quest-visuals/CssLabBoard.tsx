import { useMemo, useState } from 'react'
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

function FrogSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 90 76" width="72" height="62" aria-hidden>
      <ellipse cx="45" cy="48" rx="34" ry="26" fill="#5cd65c" />
      <ellipse cx="45" cy="50" rx="30" ry="22" fill="#4bc94a" />
      <circle cx="30" cy="30" r="14" fill="#5cd65c" />
      <circle cx="60" cy="30" r="14" fill="#5cd65c" />
      <circle cx="30" cy="30" r="8" fill="#fff" />
      <circle cx="60" cy="30" r="8" fill="#fff" />
      <circle cx="32" cy="30" r="4" fill="#1a3a1a" />
      <circle cx="62" cy="30" r="4" fill="#1a3a1a" />
      <path d="M38 58 Q45 64 52 58" stroke="#2d6b2d" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function LilySvg() {
  return (
    <svg viewBox="0 0 100 36" width="88" height="32" aria-hidden className="froggy-lily__svg">
      <ellipse cx="50" cy="22" rx="46" ry="14" fill="#3d9e3d" />
      <ellipse cx="50" cy="20" rx="40" ry="11" fill="#52b852" />
      <path d="M50 8 L54 18 L46 18 Z" fill="#52b852" />
    </svg>
  )
}

/** Right-side game board only — Froggy-style pond / garden / etc. */
export function CssLabBoard({ quest, css, checkResults, won }: Props) {
  const lab = CSS_LAB_BY_ID[quest.id]
  const [phoneW, setPhoneW] = useState(100)
  if (!lab) return null

  const board = lab.board
  const id = board.target.replace(/^#/, '')
  const allPassed = (checkResults?.filter((r) => r.passed).length ?? 0) === quest.objectives.length
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
          min-height: 200px;
          align-items: center;
          gap: 1rem;
        }
        .froggy-board--flex .froggy-frog-wrap {
          flex-shrink: 0;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .froggy-board.is-solved .froggy-frog-wrap {
          animation: froggy-hop 0.55s ease;
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
          background: #7dce7d;
          box-shadow: 0 4px 0 #3d7a3d;
        }
        .froggy-board #orb,
        .froggy-board #pulse {
          width: 88px;
          height: 88px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 1.75rem;
          cursor: pointer;
          background: #c084fc;
          box-shadow: 0 6px 0 #6b21a8;
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
          background: #7dd3fc;
          box-shadow: 0 4px 0 #0369a1;
        }
        @keyframes froggy-hop {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-12px); }
        }
        @keyframes froggy-shake {
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        ${liveCss}
      `}</style>

      {board.mode === 'flex' && (
        <div className="froggy-pond-scene">
          <div className="froggy-pond-scene__reeds" aria-hidden />
          <div className="froggy-pond-wrap">
            <div id={id} className="lab-target froggy-pond">
              {board.pieces.map((p) => (
                <div key={p.id} className="froggy-frog-wrap" title={`Frog ${p.label}`}>
                  <FrogSvg />
                </div>
              ))}
            </div>
            <div className={`froggy-lilies${allPassed ? ' is-glow' : ''}`} aria-hidden>
              {board.pieces.map((_, i) => (
                <div key={i} className="froggy-lily">
                  <LilySvg />
                </div>
              ))}
            </div>
          </div>
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
          <div
            id="orb"
            className={hasTransition ? 'has-transition' : ''}
            title="Hover me"
          >
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

      {won && <div className="froggy-board__win">Nice! 🐸</div>}
    </div>
  )
}

import { AnimatePresence, motion } from 'framer-motion'
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

function Frog({ label, hue, delay }: { label: string; hue: string; delay: number }) {
  return (
    <div className="lab-frog" style={{ '--frog-hue': hue } as CSSProperties}>
      <motion.div
        className="lab-frog__body"
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 18, delay }}
      >
        <span className="lab-frog__eye lab-frog__eye--l" />
        <span className="lab-frog__eye lab-frog__eye--r" />
        <span className="lab-frog__tag">{label}</span>
      </motion.div>
    </div>
  )
}

export function CssLabArena({ quest, css, checkResults, won }: Props) {
  const lab = CSS_LAB_BY_ID[quest.id]
  const [phoneW, setPhoneW] = useState(100)
  if (!lab) return null

  const board = lab.board
  const id = board.target.replace(/^#/, '')
  const passed = checkResults?.filter((r) => r.passed).length ?? 0
  const total = quest.objectives.length
  const pct = Math.round((passed / total) * 100)
  const allPassed = passed === total && total > 0
  const hasTransition = /transition\s*:/i.test(css)

  const liveCss = useMemo(
    () => buildLabCss(board.target, board.before, board.after, css, board.mode),
    [board, css],
  )

  return (
    <div
      className={`css-lab css-lab--${board.mode}${won ? ' is-won' : ''}${allPassed ? ' is-hot' : ''}`}
      data-game={lab.gameTitle}
    >
      <div className="css-lab__bg" aria-hidden />
      <div className="css-lab__grain" aria-hidden />

      <header className="css-lab__hero">
        <div>
          <p className="css-lab__game-title">{lab.gameTitle}</p>
          <h2 className="css-lab__level">
            {lab.pack} · {quest.title}
          </h2>
        </div>
        <div className="css-lab__meter">
          <div className="css-lab__meter-fill" style={{ width: `${pct}%` }} />
          <span>{pct}%</span>
        </div>
      </header>

      <AnimatePresence>
        {won && (
          <motion.div
            className="css-lab__win-burst"
            initial={{ scale: 0.4, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ opacity: 0 }}
          >
            SLAY ✦ CLEARED
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`css-lab__playground css-lab__playground--${board.mode}`}
        style={board.mode === 'responsive' ? { width: `${phoneW}%` } : undefined}
      >
        {/* Player CSS drives layout — base styles only decorate */}
        <style>{`
          .css-lab__playground .lab-board {
            width: 100%;
            min-height: 160px;
            flex: 1;
            box-sizing: border-box;
            position: relative;
            z-index: 2;
          }
          .css-lab__playground--flex .lab-board {
            min-height: 120px;
            width: 100%;
            padding: 0.75rem 1rem;
          }
          .css-lab__playground--grid .lab-board {
            min-height: 200px;
            padding: 0.75rem;
          }
          .css-lab__playground .lab-frog {
            flex-shrink: 0;
          }
          .css-lab__playground .lab-cell {
            min-height: 72px;
            border-radius: 14px;
            display: grid;
            place-items: center;
            font-weight: 900;
            font-size: 1.1rem;
            color: #0f172a;
            box-shadow: 0 8px 24px rgba(0,0,0,0.25);
          }
          .css-lab__playground #orb,
          .css-lab__playground #pulse {
            width: 96px;
            height: 96px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            font-size: 2rem;
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0 0 40px rgba(255,107,157,0.45);
          }
          .css-lab__playground #orb:not(.has-transition-css):hover {
            animation: lab-shake 0.35s ease;
          }
          ${liveCss}
        `}</style>

        {board.mode === 'flex' && (
          <div className="pond-scene">
            <div className="pond-scene__sky" />
            <div className="pond-scene__water">
              <div className="pond-scene__ripple pond-scene__ripple--1" />
              <div className="pond-scene__ripple pond-scene__ripple--2" />
            </div>
            <div className={`pond-scene__targets${allPassed ? ' is-live' : ''}`} aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className="pond-scene__lily" />
              ))}
            </div>
            <div id={id} className="lab-board pond-scene__flex">
              {board.pieces.map((p, i) => (
                <Frog key={p.id} label={p.label} hue={p.hue} delay={i * 0.1} />
              ))}
            </div>
            <p className="pond-scene__hint">flex row → hop the frogs onto the glowing lily pads</p>
          </div>
        )}

        {(board.mode === 'grid' || board.boardClass?.includes('responsive-grid')) && (
          <div className="garden-scene">
            <div className="garden-scene__sun" />
            <div id={id} className="lab-board garden-scene__plot">
              {board.pieces.map((p, i) => (
                <motion.div
                  key={p.id}
                  className="lab-cell"
                  style={{ background: p.hue }}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.07, type: 'spring' }}
                >
                  {p.label}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {board.mode === 'transition' && (
          <div className="glow-scene">
            <div className="glow-scene__rings" aria-hidden />
            <div
              id="orb"
              className={hasTransition ? 'has-transition-css glow-scene__orb' : 'glow-scene__orb'}
              style={{ background: board.pieces[0]?.hue }}
            >
              {board.pieces[0]?.label}
            </div>
            <p className="glow-scene__hint">hover the orb — it should GLOW UP smooth, not teleport</p>
          </div>
        )}

        {board.mode === 'animation' && (
          <div className="beat-scene">
            <div className="beat-scene__pulse-ring beat-scene__pulse-ring--1" />
            <div className="beat-scene__pulse-ring beat-scene__pulse-ring--2" />
            <div id="pulse" className="beat-scene__crystal" style={{ background: board.pieces[0]?.hue }}>
              {board.pieces[0]?.label}
            </div>
            <div className="beat-scene__eq" aria-hidden>
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} style={{ animationDelay: `${n * 0.1}s` }} />
              ))}
            </div>
          </div>
        )}

        {board.mode === 'responsive' && (
          <div className="shrink-scene">
            <div id={id} className="lab-board shrink-scene__row">
              {board.pieces.map((p) => (
                <div key={p.id} className="lab-cell shrink-scene__block" style={{ background: p.hue }}>
                  {p.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {board.mode === 'responsive' && (
        <div className="css-lab__shrink">
          <label>
            Shrink Ray
            <input
              type="range"
              min={38}
              max={100}
              value={phoneW}
              onChange={(e) => setPhoneW(Number(e.target.value))}
            />
          </label>
          <span className={phoneW < 52 ? 'is-mobile' : ''}>{phoneW < 52 ? '📱 MOBILE' : '🖥️ DESKTOP'}</span>
        </div>
      )}

      <p className="css-lab__tip">
        {board.mode === 'transition' && !hasTransition
          ? '⚡ TELEPORT DETECTED — add transition property ASAP'
          : board.mode === 'transition'
            ? '✨ Hover = your flex for smooth motion'
            : board.mode === 'animation'
              ? '🥁 Write @keyframes + animation — make it dance'
              : board.mode === 'responsive'
                ? '📱 @media (max-width: …) saves mobile layout'
                : board.mode === 'grid'
                  ? '🌱 display:grid → plant your gallery'
                  : '🐸 Type CSS for #pond (properties OR full rule) — frogs hop live'}
      </p>

      <ul className="css-lab__checks">
        {quest.objectives.map((obj) => {
          const done = checkResults?.find((r) => r.id === obj.id)?.passed ?? false
          return (
            <li key={obj.id} className={done ? 'is-done' : ''}>
              {done ? '✓' : '○'} {obj.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

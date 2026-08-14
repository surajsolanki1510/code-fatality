import { motion, AnimatePresence } from 'framer-motion'
import { useMemo, useState } from 'react'
import { CSS_LAB_BY_ID } from '../../data/quests/cssLabs'
import type { QuestDef } from '../../data/quests/types'
import type { CheckResult } from '../../lib/validateQuest'

type Props = {
  quest: QuestDef
  css: string
  checkResults?: CheckResult[]
  won: boolean
}

/** Froggy-style CSS mini-game — big board, instant visual feedback. */
export function CssLabArena({ quest, css, checkResults, won }: Props) {
  const lab = CSS_LAB_BY_ID[quest.id]
  const [phoneW, setPhoneW] = useState(100)
  if (!lab) return null

  const board = lab.board
  const id = board.target.replace(/^#/, '')
  const passed = checkResults?.filter((r) => r.passed).length ?? 0
  const total = quest.objectives.length
  const pct = Math.round((passed / total) * 100)
  const hasTransition = /transition\s*:/i.test(css)

  const liveCss = useMemo(() => {
    if (board.mode === 'animation' || board.mode === 'responsive') return css
    if (board.mode === 'transition') return `${board.before}\n${css}\n${board.after}`
    return `${board.before}\n${css}\n${board.after}`
  }, [board, css])

  const gameTitle = lab.gameTitle
  const packLabel = lab.pack

  return (
    <div className={`css-lab css-lab--${board.mode}${won ? ' is-won' : ''}${passed > 0 && !won ? ' is-heating' : ''}`}>
      <header className="css-lab__hero">
        <div>
          <p className="css-lab__game-title">{gameTitle}</p>
          <h2 className="css-lab__level">{packLabel} · {quest.title}</h2>
        </div>
        <div className="css-lab__meter" aria-hidden>
          <div className="css-lab__meter-fill" style={{ width: `${pct}%` }} />
          <span>{pct}%</span>
        </div>
      </header>

      <AnimatePresence>
        {won && (
          <motion.div
            className="css-lab__win-burst"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            CLEARED ✦
          </motion.div>
        )}
      </AnimatePresence>

      {board.mode === 'flex' && (
        <div className="css-lab__pads" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="css-lab__pad" />
          ))}
        </div>
      )}

      <div
        className={`css-lab__stage ${board.boardClass ?? ''}`}
        style={board.mode === 'responsive' ? { width: `${phoneW}%`, maxWidth: '100%' } : undefined}
      >
        <style>{`
          .css-lab__stage #pond, .css-lab__stage #garden, .css-lab__stage #stage {
            width: 100%;
            min-height: 200px;
            height: 100%;
            box-sizing: border-box;
            padding: 1.25rem;
            border-radius: 20px;
            background: rgba(0,0,0,0.2);
            border: 2px solid rgba(255,255,255,0.15);
            position: relative;
            z-index: 2;
          }
          .css-lab__stage .piece, .css-lab__stage #orb, .css-lab__stage #pulse {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            font-weight: 900;
            font-size: 1.1rem;
            color: #0f172a;
            box-shadow: 0 10px 28px rgba(0,0,0,0.35), inset 0 2px 0 rgba(255,255,255,0.35);
            flex-shrink: 0;
            transition: box-shadow 0.2s;
          }
          .css-lab__stage.is-grid-basic #garden,
          .css-lab__stage.is-grid-3 #garden,
          .css-lab__stage.is-grid-auto #garden {
            min-height: 220px;
          }
          .css-lab__stage.is-grid-basic .piece,
          .css-lab__stage.is-grid-3 .piece,
          .css-lab__stage.is-grid-auto .piece,
          .css-lab__stage.is-responsive-grid .piece {
            border-radius: 14px;
            width: auto;
            min-height: 72px;
          }
          .css-lab__stage.is-transition,
          .css-lab__stage.is-anim {
            display: grid;
            place-items: center;
            min-height: 240px;
          }
          .css-lab__stage.is-transition #orb,
          .css-lab__stage.is-anim #pulse {
            width: 100px;
            height: 100px;
            font-size: 2rem;
            cursor: pointer;
          }
          .css-lab__stage.is-transition #orb:not(.has-transition-css):hover {
            animation: lab-shake 0.35s ease;
          }
          .css-lab__stage.is-responsive #stage > .piece {
            border-radius: 14px;
            width: auto;
            flex: 1;
            min-height: 80px;
          }
          @keyframes lab-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px) scale(1.2); }
            75% { transform: translateX(8px) scale(1.2); }
          }
          @keyframes lab-beat {
            0%, 100% { opacity: 0.35; }
            50% { opacity: 1; }
          }
          ${liveCss}
        `}</style>

        {board.mode === 'flex' && (
          <div id={id}>
            {board.pieces.map((p, i) => (
              <motion.div
                key={p.id}
                className="piece"
                style={{ background: p.hue }}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 260 }}
              >
                {p.label}
              </motion.div>
            ))}
          </div>
        )}

        {(board.mode === 'grid' || board.boardClass?.includes('responsive-grid')) && (
          <div id={id}>
            {board.pieces.map((p, i) => (
              <motion.div
                key={p.id}
                className="piece"
                style={{ background: p.hue }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.06 }}
              >
                {p.label}
              </motion.div>
            ))}
          </div>
        )}

        {board.mode === 'transition' && (
          <div
            id="orb"
            className={hasTransition ? 'has-transition-css' : ''}
            style={{ background: board.pieces[0]?.hue }}
            title="Hover me!"
          >
            {board.pieces[0]?.label}
          </div>
        )}

        {board.mode === 'animation' && (
          <>
            <div className="css-lab__beat-bar" aria-hidden />
            <div id="pulse" style={{ background: board.pieces[0]?.hue }}>
              {board.pieces[0]?.label}
            </div>
          </>
        )}

        {board.mode === 'responsive' && (
          <div id={id}>
            {board.pieces.map((p) => (
              <div key={p.id} className="piece" style={{ background: p.hue }}>
                {p.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {board.mode === 'responsive' && (
        <div className="css-lab__shrink">
          <label>
            Shrink Ray
            <input
              type="range"
              min={40}
              max={100}
              value={phoneW}
              onChange={(e) => setPhoneW(Number(e.target.value))}
            />
          </label>
          <span>{phoneW < 55 ? '📱 MOBILE' : '🖥️ DESKTOP'}</span>
        </div>
      )}

      <p className="css-lab__tip">
        {board.mode === 'transition' && !hasTransition
          ? '⚡ TELEPORT DETECTED — add transition so hover glides!'
          : board.mode === 'transition'
            ? '✨ Hover the orb — smooth = you win.'
            : board.mode === 'animation'
              ? '🥁 Crystal must dance on its own — @keyframes + animation.'
              : board.mode === 'responsive'
                ? '📱 Shrink the slider — fix layout with @media.'
                : '🐸 Write CSS for #pond — orbs snap when alignment is perfect.'}
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

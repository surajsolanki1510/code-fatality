import { motion } from 'framer-motion'
import type { QuestDef } from '../../data/quests/types'
import type { CheckResult } from '../../lib/validateQuest'

type Props = {
  quest: QuestDef
  previewSrcDoc: string
  rawPreviewSrcDoc: string
  checkResults?: CheckResult[]
  coachLine: string
  posted: boolean
}

/** GLOW UP STUDIO — beautify raw HTML with structure + CSS (not combat). */
export function GlowUpArena({
  quest,
  previewSrcDoc,
  rawPreviewSrcDoc,
  checkResults,
  coachLine,
  posted,
}: Props) {
  const passed = checkResults?.filter((r) => r.passed).length ?? 0
  const total = quest.objectives.length || 1
  const glow = Math.round((passed / total) * 100)

  return (
    <div className={`glow-up${posted ? ' is-posted' : ''}`}>
      <header className="glow-up__hud">
        <div>
          <p className="glow-up__kicker">GLOW UP STUDIO · AESTHETIC LAB</p>
          <h2>{quest.title}</h2>
        </div>
        <div className="glow-up__meter" aria-label="Aesthetic meter">
          <span>GLOW</span>
          <div className="glow-up__meter-track">
            <motion.div className="glow-up__meter-fill" animate={{ width: `${glow}%` }} />
          </div>
          <strong>{glow}%</strong>
        </div>
      </header>

      <div className="glow-up__compare">
        <div className="glow-up__pane glow-up__pane--raw">
          <div className="glow-up__pane-label">
            <span>RAW</span>
            <small>before</small>
          </div>
          <iframe title="Raw preview" srcDoc={rawPreviewSrcDoc} sandbox="" className="glow-up__iframe" />
        </div>

        <div className="glow-up__divider" aria-hidden>
          <span>→</span>
        </div>

        <div className="glow-up__pane glow-up__pane--after">
          <div className="glow-up__pane-label">
            <span>GLOW UP</span>
            <small>your HTML + CSS</small>
          </div>
          <iframe title="Glow preview" srcDoc={previewSrcDoc} sandbox="" className="glow-up__iframe" />
        </div>
      </div>

      <div className="glow-up__chips">
        {quest.objectives.map((obj) => {
          const done = checkResults?.find((r) => r.id === obj.id)?.passed ?? false
          return (
            <span key={obj.id} className={done ? 'is-done' : ''}>
              {done ? '✓ ' : ''}
              {obj.label}
            </span>
          )
        })}
      </div>

      <footer className="glow-up__coach">
        <div className="glow-up__coach-avatar" aria-hidden />
        <div className="glow-up__coach-bubble">
          <strong>Luxe</strong>
          <p>{coachLine}</p>
        </div>
      </footer>

      {posted && <div className="glow-up__stamp">POSTED ✦</div>}
    </div>
  )
}

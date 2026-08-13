import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
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

const STAGES = [
  { min: 0, id: 'cringe', label: 'CRINGE', vibe: 'Still raw…' },
  { min: 25, id: 'mid', label: 'MID', vibe: 'Getting cute' },
  { min: 55, id: 'slay', label: 'SLAY', vibe: 'It’s hitting' },
  { min: 100, id: 'iconic', label: 'ICONIC', vibe: 'Main character' },
] as const

function stageFor(pct: number) {
  let current: (typeof STAGES)[number] = STAGES[0]
  for (const s of STAGES) {
    if (pct >= s.min) current = s
  }
  return current
}

/** Makeover stage — big mirror preview, vibe ladder, tiny fear-free UI */
export function GlowUpArena({
  quest,
  previewSrcDoc,
  rawPreviewSrcDoc,
  checkResults,
  coachLine,
  posted,
}: Props) {
  const [peekBefore, setPeekBefore] = useState(false)
  const passed = checkResults?.filter((r) => r.passed).length ?? 0
  const total = quest.objectives.length || 1
  const glow = Math.round((passed / total) * 100)
  const stage = stageFor(glow)

  const sparks = useMemo(() => Array.from({ length: Math.min(passed * 3, 12) }, (_, i) => i), [passed])

  return (
    <div className={`glow-up glow-up--${stage.id}${posted ? ' is-posted' : ''}`}>
      <div className="glow-up__aura" aria-hidden />
      {sparks.map((i) => (
        <span key={i} className="glow-up__spark" style={{ ['--i' as string]: i }} aria-hidden />
      ))}

      <header className="glow-up__hud">
        <div>
          <p className="glow-up__kicker">MAKEOVER · LEVEL {quest.chapter}</p>
          <h2>{quest.title}</h2>
        </div>
        <div className="glow-up__stage-pill" data-stage={stage.id}>
          <strong>{stage.label}</strong>
          <span>{stage.vibe}</span>
        </div>
      </header>

      <div className="glow-up__ladder" aria-label="Makeover stages">
        {STAGES.map((s) => (
          <span key={s.id} className={glow >= s.min ? 'is-on' : ''}>
            {s.label}
          </span>
        ))}
      </div>

      <div className="glow-up__mirror">
        <div className="glow-up__mirror-chrome">
          <span className="glow-up__dot" />
          <span className="glow-up__dot" />
          <span className="glow-up__dot" />
          <strong>{peekBefore ? 'BEFORE (cringe)' : 'YOUR LOOK (live)'}</strong>
          <button type="button" className="glow-up__peek" onClick={() => setPeekBefore((v) => !v)}>
            {peekBefore ? 'Show my glow →' : 'Peek before'}
          </button>
        </div>
        <div className="glow-up__mirror-glass">
          <AnimatePresence mode="wait">
            <motion.iframe
              key={peekBefore ? 'raw' : 'live'}
              title={peekBefore ? 'Before' : 'Your glow'}
              srcDoc={peekBefore ? rawPreviewSrcDoc : previewSrcDoc}
              sandbox=""
              className="glow-up__iframe"
              initial={{ opacity: 0.4, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          </AnimatePresence>
        </div>
        <div className="glow-up__meter" aria-label="Glow meter">
          <motion.div className="glow-up__meter-fill" animate={{ width: `${glow}%` }} />
          <span>{glow}% GLOW</span>
        </div>
      </div>

      <div className="glow-up__checks">
        {quest.objectives.map((obj) => {
          const done = checkResults?.find((r) => r.id === obj.id)?.passed ?? false
          return (
            <span key={obj.id} className={done ? 'is-done' : ''}>
              {done ? '✓' : '○'} {obj.label}
            </span>
          )
        })}
      </div>

      <footer className="glow-up__coach">
        <div className={`glow-up__face glow-up__face--${stage.id}`} aria-hidden />
        <div className="glow-up__bubble">
          <strong>Luxe</strong>
          <p>{coachLine}</p>
        </div>
      </footer>

      {posted && (
        <motion.div
          className="glow-up__stamp"
          initial={{ scale: 1.4, opacity: 0, rotate: -12 }}
          animate={{ scale: 1, opacity: 1, rotate: -6 }}
        >
          ICONIC ✦
        </motion.div>
      )}
    </div>
  )
}

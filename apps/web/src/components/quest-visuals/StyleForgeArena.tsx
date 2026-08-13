import { motion } from 'framer-motion'
import { useMemo } from 'react'
import type { QuestDef } from '../../data/quests/types'
import type { CheckResult } from '../../lib/validateQuest'

type Props = {
  quest: QuestDef
  css: string
  previewSrcDoc: string
  checkResults?: CheckResult[]
  coachLine: string
  lockedLook: boolean
}

function sheetHas(css: string, re: RegExp) {
  return re.test(css)
}

/** Neon runway stage — CSS dresses the look (not combat). */
export function StyleForgeArena({
  quest,
  css,
  previewSrcDoc,
  checkResults,
  coachLine,
  lockedLook,
}: Props) {
  const layers = useMemo(
    () => ({
      wash: sheetHas(css, /body\s*\{[^}]*(background(-color)?|background)\s*:/i),
      neon: sheetHas(css, /\.title\s*\{[^}]*color\s*:/i),
      type: sheetHas(css, /\.title\s*\{[^}]*font-(size|weight)\s*:/i),
      card: sheetHas(css, /\.card\s*\{[^}]*(padding|border|border-radius|box-shadow)\s*:/i),
      flex: sheetHas(css, /\.row\s*\{[^}]*display\s*:\s*flex/i),
      grid: sheetHas(css, /\.row\s*\{[^}]*display\s*:\s*grid/i),
      hover: sheetHas(css, /\.tile\s*:\s*hover\s*\{/i),
      gradient: sheetHas(css, /linear-gradient\s*\(/i),
    }),
    [css],
  )

  const passed = checkResults?.filter((r) => r.passed).length ?? 0
  const total = quest.objectives.length || 1
  const vibe = Math.round((passed / total) * 100)

  return (
    <div className={`style-forge${lockedLook ? ' is-locked' : ''}`}>
      <div className="style-forge__sky" data-wash={layers.wash || layers.gradient ? 'on' : 'off'} />
      <div className="style-forge__grid-floor" aria-hidden />

      <header className="style-forge__hud">
        <div>
          <p className="style-forge__kicker">STYLE FORGE · NEON RUNWAY</p>
          <h2>{quest.title}</h2>
        </div>
        <div className="style-forge__vibe" aria-label="Vibe meter">
          <span>VIBE</span>
          <div className="style-forge__vibe-track">
            <motion.div className="style-forge__vibe-fill" animate={{ width: `${vibe}%` }} />
          </div>
          <strong>{vibe}%</strong>
        </div>
      </header>

      <div className="style-forge__stage">
        <motion.div
          className="style-forge__mannequin"
          animate={{
            filter: layers.neon ? 'drop-shadow(0 0 18px rgba(93,255,159,0.55))' : 'none',
            scale: layers.card ? 1.04 : 1,
          }}
        >
          <div className={`style-forge__head${layers.neon ? ' is-lit' : ''}`} />
          <div className={`style-forge__torso${layers.card ? ' is-framed' : ''}`} />
          <div className="style-forge__legs">
            <span className={layers.flex || layers.grid ? 'is-posed' : ''} />
            <span className={layers.flex || layers.grid ? 'is-posed' : ''} />
          </div>
        </motion.div>

        <div className="style-forge__chips" aria-hidden>
          {layers.wash && <span>WASH</span>}
          {layers.neon && <span>NEON</span>}
          {layers.type && <span>TYPE</span>}
          {layers.card && <span>CARD</span>}
          {layers.flex && <span>FLEX</span>}
          {layers.grid && <span>GRID</span>}
          {layers.hover && <span>HOVER</span>}
          {layers.gradient && <span>GRADIENT</span>}
        </div>
      </div>

      <div className="style-forge__preview">
        <div className="style-forge__preview-chrome">Live look · your CSS</div>
        <iframe title="Style preview" srcDoc={previewSrcDoc} sandbox="" className="style-forge__iframe" />
      </div>

      <footer className="style-forge__coach">
        <div className="style-forge__coach-face" aria-hidden />
        <div className="style-forge__coach-bubble">
          <strong>Zara</strong>
          <p>{coachLine}</p>
        </div>
      </footer>

      {lockedLook && <div className="style-forge__stamp">LOOK LOCKED</div>}
    </div>
  )
}

import { motion } from 'framer-motion'
import { useMemo } from 'react'

type Props = {
  questId: string
  css: string
}

function cssHasBodyBackground(sheet: string) {
  return /body\s*\{[^}]*background(-color)?\s*:/i.test(sheet)
}

function cssHasH1Color(sheet: string) {
  return /h1\s*\{[^}]*color\s*:/i.test(sheet)
}

function cssHasFlexGrove(sheet: string) {
  return /\.grove\s*\{[^}]*display\s*:\s*flex/i.test(sheet)
}

/** Forest realm reacts when CSS “enchantments” are written. */
export function CssForestBuildStage({ questId, css }: Props) {
  const flags = useMemo(
    () => ({
      bodyBg: cssHasBodyBackground(css),
      h1Color: cssHasH1Color(css),
      flex: cssHasFlexGrove(css),
    }),
    [css],
  )

  const progress =
    questId === 'css-forest-boss'
      ? (flags.flex ? 1 : 0)
      : ((flags.bodyBg ? 1 : 0) + (flags.h1Color ? 1 : 0)) / 2

  return (
    <div className="live-arena live-arena--forest">
      <motion.div
        className="forest-canopy"
        animate={{
          filter: flags.bodyBg ? 'saturate(1.4) brightness(1.05)' : 'saturate(0.2) brightness(0.45)',
        }}
        transition={{ duration: 0.6 }}
      />
      <motion.div
        className="forest-mist"
        animate={{ opacity: flags.bodyBg ? 0.25 : 0.65 }}
      />

      <div className="live-arena__progress">
        <span>ENCHANT</span>
        <div className="live-arena__progress-track">
          <motion.div
            className="live-arena__progress-fill live-arena__progress-fill--green"
            animate={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <span>{Math.round(progress * 100)}%</span>
      </div>

      <div className={`forest-grove${flags.flex ? ' forest-grove--flex' : ''}`}>
        {['I', 'II', 'III'].map((label, i) => (
          <motion.div
            key={label}
            className="forest-stone"
            animate={{
              y: flags.flex ? 0 : i * 4,
              x: flags.flex ? i * 8 : 0,
              background: flags.h1Color
                ? `linear-gradient(180deg, #${['5dff9f', 'ffe566', 'ff6b81'][i]}, #1a3d2a)`
                : '#2a3d32',
            }}
            transition={{ delay: i * 0.08 }}
          >
            {label}
          </motion.div>
        ))}
      </div>

      {!flags.bodyBg && questId === 'css-forest-1' && (
        <p className="live-arena__hint">Set body &#123; background-color … &#125; to wake the forest.</p>
      )}
    </div>
  )
}

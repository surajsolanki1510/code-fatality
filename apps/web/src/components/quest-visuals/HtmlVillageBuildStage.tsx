import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { QuestDef } from '../../data/quests/types'
import { analyzeHtml } from '../../lib/analyzeHtml'
import { buildPieceForObjective, type BuildPieceDef } from '../../lib/villageBuildPieces'

type CheckResult = { id: string; passed: boolean; message: string }

type Props = {
  quest: QuestDef
  html: string
  checkResults?: CheckResult[]
  previewSrcDoc: string
}

/**
 * HTML Village Build Arena — you wake a sleeping village with real HTML.
 * Clear cause/effect (code → world), zero worksheet energy.
 */
export function HtmlVillageBuildStage({ quest, html, checkResults, previewSrcDoc }: Props) {
  const [showPreview, setShowPreview] = useState(false)
  const [burstId, setBurstId] = useState<string | null>(null)
  const prevFilled = useRef<Set<string>>(new Set())
  const flags = useMemo(() => analyzeHtml(html), [html])

  const pieces = useMemo(() => {
    return quest.objectives.map((obj) => {
      const def = buildPieceForObjective(obj.id, obj.label)
      const live = checkResults?.find((r) => r.id === obj.id)?.passed ?? false
      return { obj, def, live }
    })
  }, [quest.objectives, checkResults])

  const filled = pieces.filter((p) => p.live).length
  const total = pieces.length
  const power = total ? filled / total : 0
  const ready = total > 0 && filled === total
  const next = pieces.find((p) => !p.live)

  useEffect(() => {
    const now = new Set(pieces.filter((p) => p.live).map((p) => p.obj.id))
    let timeout: number | undefined
    for (const id of now) {
      if (!prevFilled.current.has(id)) {
        setBurstId(id)
        timeout = window.setTimeout(() => setBurstId(null), 700)
        break
      }
    }
    prevFilled.current = now
    return () => {
      if (timeout) window.clearTimeout(timeout)
    }
  }, [pieces])

  const burstingPiece = pieces.find((p) => p.obj.id === burstId)?.def

  const coach = ready
    ? 'Village is live. Hit LOCK IN and claim the win.'
    : next
      ? `Next summon: ${next.def.tag} — ${next.def.summonLine}`
      : 'Type real HTML. Every tag wakes a piece of the village.'

  return (
    <div className={`build-arena${ready ? ' is-ready' : ''}${burstId ? ' is-burst' : ''}`}>
      <div className="build-arena__art" aria-hidden />
      <div className="build-arena__grain" aria-hidden />
      <div
        className="build-arena__powerglow"
        style={{ opacity: 0.25 + power * 0.55 }}
        aria-hidden
      />

      <header className="build-arena__hud">
        <div className="build-arena__titleblock">
          <span className="build-arena__kicker">HTML VILLAGE · BUILD ARENA</span>
          <h2>Wake the village with code</h2>
          <p>Ghost outlines wait for you. Write the tag → that piece SLAMS into existence.</p>
        </div>

        <div className="build-arena__meter" aria-label="Village power">
          <div className="build-arena__meter-top">
            <span>VILLAGE POWER</span>
            <strong>{Math.round(power * 100)}%</strong>
          </div>
          <div className="build-arena__meter-track">
            <motion.div
              className="build-arena__meter-fill"
              animate={{ width: `${Math.round(power * 100)}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            />
          </div>
          <span className="build-arena__meter-sub">
            {filled}/{total} structures online
          </span>
        </div>

        <button
          type="button"
          className={`build-arena__tab${showPreview ? ' is-on' : ''}`}
          onClick={() => setShowPreview((v) => !v)}
        >
          {showPreview ? 'Arena' : 'Your page'}
        </button>
      </header>

      <AnimatePresence mode="wait">
        {showPreview ? (
          <motion.div
            key="preview"
            className="build-arena__preview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="build-arena__preview-chrome">Live browser · your HTML</div>
            <iframe title="Your page" srcDoc={previewSrcDoc} sandbox="" className="build-arena__iframe" />
          </motion.div>
        ) : (
          <motion.div
            key="world"
            className="build-arena__world"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="build-arena__lot">
              {/* Always-present empty lot vibe */}
              <div className="build-lot__ground" />
              <div className="build-lot__crane" aria-hidden />

              {pieces.map(({ obj, def, live }) => (
                <BuildProp
                  key={obj.id}
                  def={def}
                  live={live}
                  bursting={burstId === obj.id}
                  h1Text={flags.h1Text}
                  pText={flags.pText}
                  linkText={flags.linkText}
                  imgAlt={flags.imgAlt}
                />
              ))}

              {/* Soft ghosts for missing pieces so goal stays obvious */}
              {pieces
                .filter((p) => !p.live)
                .map(({ obj, def }) => (
                  <div
                    key={`ghost-${obj.id}`}
                    className={`build-ghost build-ghost--${def.slot}`}
                    style={{ ['--c' as string]: def.color }}
                  >
                    <span>{def.tag}</span>
                  </div>
                ))}
            </div>

            <AnimatePresence>
              {burstId && burstingPiece && (
                <motion.div
                  className="build-arena__callout"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{ borderColor: burstingPiece.color }}
                >
                  <em>SUMMONED</em>
                  <strong>{burstingPiece.name}</strong>
                  <span>{burstingPiece.summonLine}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {ready && (
              <motion.div
                className="build-arena__fatality"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                VILLAGE ONLINE
                <span>Hit LOCK IN</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="build-arena__coach">
        <div className="build-arena__coach-avatar" aria-hidden />
        <div className="build-arena__coach-bubble">
          <strong>Nova</strong>
          <p>{coach}</p>
        </div>
      </footer>
    </div>
  )
}

function BuildProp({
  def,
  live,
  bursting,
  h1Text,
  pText,
  linkText,
  imgAlt,
}: {
  def: BuildPieceDef
  live: boolean
  bursting: boolean
  h1Text: string
  pText: string
  linkText: string
  imgAlt: string
}) {
  if (!live) return null

  return (
    <motion.div
      className={`build-prop build-prop--${def.slot}${bursting ? ' is-bursting' : ''}`}
      style={{ ['--c' as string]: def.color }}
      initial={{ opacity: 0, y: 40, scale: 0.6, rotate: -6 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 14 }}
    >
      {def.kind === 'speech' && (
        <div className="bp-npc">
          <div className="bp-npc__body" />
          <div className="bp-npc__bubble">{pText || '…'}</div>
        </div>
      )}
      {def.kind === 'house' && (
        <div className="bp-house">
          <div className="bp-house__roof" />
          <div className="bp-house__wall">
            <div className="bp-house__door" />
            <div className="bp-house__win" />
          </div>
          <span className="bp-tag">{def.tag}</span>
        </div>
      )}
      {def.kind === 'sign' && (
        <div className="bp-sign">
          <div className="bp-sign__post" />
          <div className="bp-sign__board">{h1Text || 'TITLE'}</div>
        </div>
      )}
      {(def.kind === 'district' || def.kind === 'generic') && (
        <div className="bp-district">
          <span>{def.name}</span>
        </div>
      )}
      {(def.kind === 'board' || def.kind === 'steps') && (
        <ul className={`bp-board${def.kind === 'steps' ? ' is-ordered' : ''}`}>
          <li>{def.kind === 'steps' ? '1.' : '•'} mission</li>
          <li>{def.kind === 'steps' ? '2.' : '•'} mission</li>
        </ul>
      )}
      {(def.kind === 'power' || def.kind === 'spark' || def.kind === 'spotlight') && (
        <div className="bp-fx">
          <span>{def.tag}</span>
        </div>
      )}
      {def.kind === 'portal' && (
        <div className="bp-portal">
          <span>{linkText || 'LINK'}</span>
        </div>
      )}
      {def.kind === 'mural' && (
        <div className="bp-mural">
          <span>{imgAlt || 'IMG'}</span>
        </div>
      )}
      {def.kind === 'road' && <div className="bp-road" />}
      {def.kind === 'secret' && <div className="bp-secret">{'<!-- note -->'}</div>}
      {def.kind === 'badge' && <div className="bp-badge">{def.tag}</div>}
      {def.kind === 'quote' && <div className="bp-quote">“…”</div>}
      {def.kind === 'code' && <div className="bp-code">{'</>'}</div>}

      {bursting && <span className="bp-shockwave" aria-hidden />}
    </motion.div>
  )
}

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { QuestDef } from '../../data/quests/types'
import {
  combatFromChecks,
  FATALITY_ASSETS,
  type CombatCheck,
} from '../../lib/fatalityCombat'

export type LockOutcome = 'idle' | 'fail' | 'win'

type Props = {
  quest: QuestDef
  checkResults?: CombatCheck[]
  previewSrcDoc: string
  lockOutcome: LockOutcome
  coachLine: string
}

type Strike = {
  id: number
  kind: 'hero' | 'enemy'
  label: string
  dmg?: number
}

/** MK-style Code Fatality arena — code progress = hero hits; fail LOCK IN = enemy hits (no KO). */
export function FatalityArena({
  quest,
  checkResults,
  previewSrcDoc,
  lockOutcome,
  coachLine,
}: Props) {
  const [showPreview, setShowPreview] = useState(false)
  const [heroSrc, setHeroSrc] = useState<string>(FATALITY_ASSETS.hero)
  const [enemySrc, setEnemySrc] = useState<string>(FATALITY_ASSETS.enemy)
  const [videoFailed, setVideoFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [heroAttack, setHeroAttack] = useState(false)
  const [enemyAttack, setEnemyAttack] = useState(false)
  const [shake, setShake] = useState(false)
  const [heroFlash, setHeroFlash] = useState(false)
  const [enemyFlash, setEnemyFlash] = useState(false)
  const [impact, setImpact] = useState(false)
  const [slash, setSlash] = useState(false)
  const [finishPhase, setFinishPhase] = useState(0)
  const [strikes, setStrikes] = useState<Strike[]>([])
  const [heroHitsTaken, setHeroHitsTaken] = useState(0)
  const prevPassed = useRef<Set<string>>(new Set())
  const strikeId = useRef(0)
  const lastLock = useRef<LockOutcome>('idle')

  const combat = useMemo(
    () => combatFromChecks(checkResults, quest.objectives.length, heroHitsTaken),
    [checkResults, quest.objectives.length, heroHitsTaken],
  )

  const triggerHeroHit = useCallback((label: string, dmg?: number, big = false) => {
    setHeroAttack(true)
    setEnemyFlash(true)
    setShake(true)
    setImpact(true)
    setSlash(true)
    const sid = ++strikeId.current
    setStrikes((s) => [...s, { id: sid, kind: 'hero', label, dmg }])

    const hitMs = big ? 620 : 420
    window.setTimeout(() => setHeroAttack(false), hitMs)
    window.setTimeout(() => setEnemyFlash(false), big ? 480 : 320)
    window.setTimeout(() => setShake(false), big ? 560 : 380)
    window.setTimeout(() => setImpact(false), big ? 500 : 280)
    window.setTimeout(() => setSlash(false), big ? 520 : 340)
    window.setTimeout(() => setStrikes((s) => s.filter((x) => x.id !== sid)), big ? 1200 : 900)
  }, [])

  useEffect(() => {
    const el = videoRef.current
    if (!el || videoFailed) return
    el.muted = true
    const play = () => {
      void el.play().catch(() => {})
    }
    play()
    el.addEventListener('canplay', play)
    return () => el.removeEventListener('canplay', play)
  }, [videoFailed, quest.id])

  useEffect(() => {
    setHeroHitsTaken(0)
    prevPassed.current = new Set()
    setStrikes([])
    setFinishPhase(0)
    lastLock.current = 'idle'
  }, [quest.id])

  // Live objective pass → hero combo hit
  useEffect(() => {
    const now = new Set((checkResults ?? []).filter((r) => r.passed).map((r) => r.id))
    const newly: string[] = []
    for (const id of now) {
      if (!prevPassed.current.has(id)) newly.push(id)
    }
    prevPassed.current = now
    if (newly.length === 0) return

    const obj = quest.objectives.find((o) => o.id === newly[0])
    const label = obj?.label.match(/<[\w/!-]+>/)?.[0] ?? 'HIT'
    const chunk = Math.round(100 / Math.max(1, quest.objectives.length))
    triggerHeroHit(label, chunk, false)
  }, [checkResults, quest.objectives, triggerHeroHit])

  // LOCK IN fail / win climax
  useEffect(() => {
    if (lockOutcome === lastLock.current) return
    lastLock.current = lockOutcome

    if (lockOutcome === 'fail') {
      setFinishPhase(0)
      setHeroHitsTaken((n) => n + 1)
      setEnemyAttack(true)
      setHeroFlash(true)
      setShake(true)
      setImpact(true)
      const sid = ++strikeId.current
      setStrikes((s) => [...s, { id: sid, kind: 'enemy', label: 'COUNTER', dmg: 18 }])
      const t1 = window.setTimeout(() => setEnemyAttack(false), 520)
      const t2 = window.setTimeout(() => setHeroFlash(false), 400)
      const t3 = window.setTimeout(() => setShake(false), 480)
      const t4 = window.setTimeout(() => setImpact(false), 360)
      const t5 = window.setTimeout(() => setStrikes((s) => s.filter((x) => x.id !== sid)), 1000)
      return () => {
        window.clearTimeout(t1)
        window.clearTimeout(t2)
        window.clearTimeout(t3)
        window.clearTimeout(t4)
        window.clearTimeout(t5)
      }
    }

    if (lockOutcome === 'win') {
      // Climax finish: triple strike → FATALITY
      setFinishPhase(1)
      triggerHeroHit('FINISH', 40, true)
      const t1 = window.setTimeout(() => {
        setFinishPhase(2)
        triggerHeroHit('COMBO', 30, true)
      }, 520)
      const t2 = window.setTimeout(() => {
        setFinishPhase(3)
        triggerHeroHit('KO', 30, true)
      }, 1040)
      const t3 = window.setTimeout(() => setFinishPhase(4), 1600)
      return () => {
        window.clearTimeout(t1)
        window.clearTimeout(t2)
        window.clearTimeout(t3)
      }
    }
  }, [lockOutcome, triggerHeroHit])

  const showFatality = lockOutcome === 'win' && finishPhase >= 4
  const bossName = quest.kind === 'boss' ? 'BOSS' : 'FEAR'
  const readyToFinish = combat.passedCount >= combat.total && lockOutcome === 'idle'

  return (
    <div
      className={`fatality-arena${shake ? ' is-shake' : ''}${showFatality ? ' is-fatality' : ''}${finishPhase > 0 ? ' is-climax' : ''}`}
    >
      <div className="fatality-arena__bg">
        {!videoFailed ? (
          <video
            ref={videoRef}
            className="fatality-arena__video"
            src={FATALITY_ASSETS.arenaVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={FATALITY_ASSETS.arenaPoster}
            onError={() => setVideoFailed(true)}
          />
        ) : (
          <div
            className="fatality-arena__poster"
            style={{ backgroundImage: `url(${FATALITY_ASSETS.arenaPoster})` }}
          />
        )}
        <div className="fatality-arena__veil" />
      </div>

      <header className="fatality-hud">
        <div className="fatality-hud__fighter fatality-hud__fighter--hero">
          <div className="fatality-hud__row">
            <span className="fatality-hud__name">YOU</span>
            <span className="fatality-hud__hp">{combat.heroHp}</span>
          </div>
          <div className="fatality-hud__bar">
            <motion.div
              className="fatality-hud__fill fatality-hud__fill--hero"
              animate={{ width: `${combat.heroHp}%` }}
              transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            />
          </div>
        </div>

        <div className="fatality-hud__center">
          <div className={`fatality-hud__combo${combat.combo >= 2 ? ' is-hot' : ''}`}>
            COMBO <strong>x{Math.max(1, combat.combo)}</strong>
          </div>
          <button
            type="button"
            className={`fatality-hud__tab${showPreview ? ' is-on' : ''}`}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? 'Arena' : 'Your page'}
          </button>
        </div>

        <div className="fatality-hud__fighter fatality-hud__fighter--enemy">
          <div className="fatality-hud__row">
            <span className="fatality-hud__name">{bossName}</span>
            <span className="fatality-hud__hp">{combat.enemyHp}</span>
          </div>
          <div className="fatality-hud__bar">
            <motion.div
              className="fatality-hud__fill fatality-hud__fill--enemy"
              animate={{ width: `${combat.enemyHp}%` }}
              transition={{ type: 'spring', stiffness: 140, damping: 18 }}
            />
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {showPreview ? (
          <motion.div
            key="preview"
            className="fatality-preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="fatality-preview__chrome">Live browser · your HTML</div>
            <iframe title="Your page" srcDoc={previewSrcDoc} sandbox="" className="fatality-preview__iframe" />
          </motion.div>
        ) : (
          <motion.div
            key="stage"
            className="fatality-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fatality-stage__floor" />

            <div
              className={`fatality-fighter fatality-fighter--hero${heroAttack ? ' is-attack' : ''}${heroFlash ? ' is-hit' : ''}`}
            >
              <img
                src={heroSrc}
                alt="Hero"
                draggable={false}
                onError={() => setHeroSrc(FATALITY_ASSETS.heroFallback)}
              />
            </div>

            <div
              className={`fatality-fighter fatality-fighter--enemy${enemyAttack ? ' is-attack' : ''}${enemyFlash ? ' is-hit' : ''}${finishPhase >= 3 ? ' is-ko' : ''}`}
            >
              <img
                src={enemySrc}
                alt="Enemy"
                draggable={false}
                onError={() => setEnemySrc(FATALITY_ASSETS.enemyFallback)}
              />
            </div>

            <AnimatePresence>
              {slash && <motion.div className="fatality-slash" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1.15 }} exit={{ opacity: 0 }} />}
            </AnimatePresence>

            <AnimatePresence>
              {impact && <motion.div className="fatality-impact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
            </AnimatePresence>

            <AnimatePresence>
              {strikes.map((s) => (
                <motion.div
                  key={s.id}
                  className={`fatality-strike fatality-strike--${s.kind}`}
                  initial={{ opacity: 0, y: 24, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1.08 }}
                  exit={{ opacity: 0, y: -40, scale: 1.2 }}
                >
                  <strong>{s.label}</strong>
                  {s.dmg != null && <span>-{s.dmg}</span>}
                </motion.div>
              ))}
            </AnimatePresence>

            {readyToFinish && (
              <motion.p
                className="fatality-ready"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                FEAR IS DOWN — HIT LOCK IN FOR FATALITY
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFatality && (
          <motion.div
            className="fatality-climax"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="fatality-stamp"
              initial={{ scale: 3.2, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: -4 }}
              transition={{ type: 'spring', stiffness: 220, damping: 12 }}
            >
              FATALITY
              <span>CHAPTER CLEARED</span>
            </motion.div>
            <p className="fatality-climax__lesson">
              {quest.realWorldWin ?? quest.winQuips[0]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fatality-coach">
        <div className="fatality-coach__face" aria-hidden />
        <div className="fatality-coach__bubble">
          <strong>Nova</strong>
          <p>{coachLine}</p>
        </div>
      </footer>
    </div>
  )
}

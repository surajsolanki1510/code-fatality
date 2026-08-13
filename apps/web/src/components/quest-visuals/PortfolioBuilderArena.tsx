import { motion } from 'framer-motion'
import { useRef } from 'react'
import { sectionsUnlocked } from '../../data/quests/portfolioHtml'
import type { QuestDef } from '../../data/quests/types'
import type { CheckResult } from '../../lib/validateQuest'
import { DEFAULT_AVATAR, usePortfolioStore } from '../../store/portfolioStore'

type Props = {
  quest: QuestDef
  previewSrcDoc: string
  checkResults?: CheckResult[]
  coachLine: string
  published: boolean
}

/** Live portfolio builder — your site grows every level. */
export function PortfolioBuilderArena({ quest, previewSrcDoc, checkResults, coachLine, published }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const profile = usePortfolioStore()
  const unlocked = sectionsUnlocked(quest.chapter)
  const passed = checkResults?.filter((r) => r.passed).length ?? 0
  const total = quest.objectives.length || 1
  const pct = Math.round((passed / total) * 100)

  const onPhoto = (file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => profile.setPhoto(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <div className={`pf-build${published ? ' is-live' : ''}`}>
      <div className="pf-build__top">
        <div>
          <p className="pf-build__kicker">PORTFOLIO FORGE · {quest.tagLessons[0]?.tag.split(' ')[0] ?? 'CSS'} PACK</p>
          <h2>{quest.title}</h2>
        </div>
        <div className="pf-build__pct">
          <strong>{pct}%</strong>
          <span>built</span>
        </div>
      </div>

      <div className="pf-build__profile">
        <button type="button" className="pf-build__photo" onClick={() => fileRef.current?.click()}>
          <img src={profile.photoDataUrl ?? DEFAULT_AVATAR} alt="Your photo" />
          <span>{profile.photoDataUrl ? 'Change photo' : 'Upload your photo'}</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onPhoto(e.target.files?.[0])} />
        <div className="pf-build__fields">
          <label>
            Name
            <input value={profile.name} onChange={(e) => profile.setName(e.target.value)} placeholder="Your name" />
          </label>
          <label>
            Tagline
            <input value={profile.tagline} onChange={(e) => profile.setTagline(e.target.value)} placeholder="One line about you" />
          </label>
        </div>
      </div>

      <nav className="pf-build__sections" aria-label="Portfolio sections">
        {['Hero', 'About', 'Skills', 'Projects', 'Contact'].map((s) => (
          <span key={s} className={unlocked.includes(s) ? 'is-on' : ''}>
            {unlocked.includes(s) ? '✓' : '○'} {s}
          </span>
        ))}
      </nav>

      <div className="pf-build__device">
        <div className="pf-build__device-bar">
          <span />
          <span />
          <span />
          <strong>YOUR PORTFOLIO · LIVE</strong>
        </div>
        <iframe title="Your portfolio" srcDoc={previewSrcDoc} sandbox="" className="pf-build__iframe" />
        {published && (
          <motion.div className="pf-build__live-badge" initial={{ scale: 0 }} animate={{ scale: 1 }}>
            LIVE ✦
          </motion.div>
        )}
      </div>

      <ul className="pf-build__checks">
        {quest.objectives.map((obj) => {
          const done = checkResults?.find((r) => r.id === obj.id)?.passed ?? false
          return (
            <li key={obj.id} className={done ? 'is-done' : ''}>
              {done ? '✓' : '○'} {obj.label}
            </li>
          )
        })}
      </ul>

      <footer className="pf-build__coach">
        <div className="pf-build__face" aria-hidden />
        <p>{coachLine}</p>
      </footer>
    </div>
  )
}

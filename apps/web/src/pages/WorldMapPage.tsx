import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArenaShell } from '../components/ArenaShell'
import { MapNav } from '../components/QuestNav'
import { WORLDS, isWorldUnlocked } from '../data/worlds'
import { useProgressStore } from '../store/progressStore'

export function WorldMapPage() {
  const navigate = useNavigate()
  const completedQuestIds = useProgressStore((s) => s.completedQuestIds)

  useEffect(() => {
    document.documentElement.classList.add('viewport-lock')
    return () => document.documentElement.classList.remove('viewport-lock')
  }, [])

  return (
    <ArenaShell>
      <div className="map-page">
        <MapNav />
        <div className="map-header">
          <h1 className="arena-title arena-title--section">Pick your path</h1>
          <p className="arena-tagline">
            All languages are open. Inside each realm, clear chapters in order.
          </p>
        </div>
        <div className="world-select">
          {WORLDS.map((world, i) => {
            const unlocked = isWorldUnlocked(world, completedQuestIds)
            return (
              <motion.div
                key={world.id}
                className={`fighter-card${unlocked ? '' : ' fighter-card--locked'}`}
                style={{ ['--accent' as string]: world.accent }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
              >
                <button
                  type="button"
                  className="fighter-card__hit"
                  disabled={!unlocked}
                  onClick={() => unlocked && navigate(`/world/${world.id}`)}
                  aria-label={`Open ${world.name}`}
                >
                  <div
                    className="fighter-card__art"
                    style={{ backgroundImage: `url(${world.art})` }}
                  />
                  <div className="fighter-card__shade" />
                  <div className="fighter-card__meta">
                    <span className="fighter-card__slot">P{i + 1}</span>
                    <h2 className="fighter-card__name">{world.name}</h2>
                    <p className="fighter-card__sub">{world.subtitle}</p>
                    <p className="fighter-card__desc">{world.description}</p>
                  </div>
                  {!unlocked && <div className="fighter-card__lock">LOCKED</div>}
                  {unlocked && <div className="fighter-card__ready">READY</div>}
                </button>
                <button
                  type="button"
                  className="fighter-card__notebook"
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/notebook/${world.id}`)
                  }}
                >
                  Notebook
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </ArenaShell>
  )
}

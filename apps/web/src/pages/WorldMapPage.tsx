import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArenaShell } from '../components/ArenaShell'
import { MapNav } from '../components/QuestNav'
import { WORLDS, isWorldUnlocked } from '../data/worlds'
import { useProgressStore } from '../store/progressStore'

export function WorldMapPage() {
  const navigate = useNavigate()
  const completedQuestIds = useProgressStore((s) => s.completedQuestIds)

  return (
    <ArenaShell>
      <div className="map-page">
        <MapNav />
        <div className="map-header">
          <h1 className="arena-title arena-title--section">Pick your path</h1>
          <p className="arena-tagline">
            Choose a realm and start learning by building. Desktop layout avoids unnecessary page scrolling.
          </p>
        </div>
        <div className="world-select">
          {WORLDS.map((world, i) => {
            const unlocked = isWorldUnlocked(world, completedQuestIds)
            return (
              <motion.button
                key={world.id}
                type="button"
                className={`fighter-card${unlocked ? '' : ' fighter-card--locked'}`}
                style={{ ['--accent' as string]: world.accent }}
                disabled={!unlocked}
                onClick={() => unlocked && navigate(`/world/${world.id}`)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                whileHover={unlocked ? { y: -8, scale: 1.02 } : undefined}
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
              </motion.button>
            )
          })}
        </div>
      </div>
    </ArenaShell>
  )
}

import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArenaShell } from '../components/ArenaShell'
import { MapNav } from '../components/QuestNav'
import {
  getChapterProgress,
  getQuestsByTier,
  getQuestsForWorld,
  getTierProgress,
  isQuestUnlocked,
  isTierUnlocked,
} from '../data/quests'
import { TIER_LABEL, type QuestDef, type SkillTier } from '../data/quests/types'
import { WORLDS } from '../data/worlds'
import { useProgressStore } from '../store/progressStore'

const TIERS: SkillTier[] = ['beginner', 'intermediate', 'expert']

export function WorldDetailPage() {
  const { worldId } = useParams<{ worldId: string }>()
  const navigate = useNavigate()
  const isQuestComplete = useProgressStore((s) => s.isQuestComplete)
  const completed = useProgressStore((s) => s.completedQuestIds)

  const world = WORLDS.find((w) => w.id === worldId)
  const progress = worldId ? getChapterProgress(worldId, completed) : null
  const showTiers = worldId === 'html-village'

  if (!world || !worldId) {
    return (
      <ArenaShell>
        <MapNav />
        <p>Realm not found.</p>
        <Link to="/map">Back to map</Link>
      </ArenaShell>
    )
  }

  return (
    <ArenaShell>
      <MapNav />
      <div className="world-detail-hero">
        <div className="world-detail-hero__art" style={{ backgroundImage: `url(${world.art})` }} />
        <div className="world-detail-hero__shade" />
        <div className="world-detail-hero__copy">
          <p className="arena-subtitle" style={{ letterSpacing: '0.25em', fontSize: '1.1rem' }}>
            {world.subtitle}
          </p>
          <h1 className="arena-title arena-title--section" style={{ marginTop: '0.35rem' }}>
            {world.name}
          </h1>
          <p className="arena-tagline" style={{ marginTop: '0.5rem', color: '#f2ebe0' }}>
            {world.description}
          </p>
          {progress && (
            <p className="arena-tagline" style={{ color: '#9ef0c0', marginTop: '0.35rem' }}>
              {progress.done}/{progress.total} chapters cleared · unlock one-by-one
            </p>
          )}
        </div>
      </div>

      {showTiers
        ? TIERS.map((tier) => {
            const unlocked = isTierUnlocked(world.id, tier, completed)
            const tierProg = getTierProgress(world.id, tier, completed)
            const quests = getQuestsByTier(world.id, tier)
            return (
              <section key={tier} className="tier-block">
                <div className="tier-block__head">
                  <h2 className="tier-block__title">{TIER_LABEL[tier]}</h2>
                  <span className="tier-block__meta">
                    {unlocked ? `${tierProg.done}/${tierProg.total}` : 'LOCKED'}
                  </span>
                </div>
                {!unlocked && (
                  <p className="tier-block__lock-msg">
                    {tier === 'intermediate'
                      ? 'Beat the Beginner Boss to unlock Intermediate.'
                      : 'Beat the Intermediate Boss to unlock Expert.'}
                  </p>
                )}
                {unlocked && (
                  <QuestRows
                    quests={quests}
                    completed={completed}
                    isQuestComplete={isQuestComplete}
                    onOpen={(id) => navigate(`/quest/${id}`)}
                  />
                )}
              </section>
            )
          })
        : (
          <QuestRows
            quests={getQuestsForWorld(world.id)}
            completed={completed}
            isQuestComplete={isQuestComplete}
            onOpen={(id) => navigate(`/quest/${id}`)}
          />
        )}

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/map" className="quest-nav__brand">
          ← Realms
        </Link>
      </p>
    </ArenaShell>
  )
}

function QuestRows({
  quests,
  completed,
  isQuestComplete,
  onOpen,
}: {
  quests: QuestDef[]
  completed: string[]
  isQuestComplete: (id: string) => boolean
  onOpen: (id: string) => void
}) {
  return (
    <ul className="quest-list">
      {quests.map((q) => {
        const done = isQuestComplete(q.id)
        const open = isQuestUnlocked(q, completed)
        return (
          <li
            key={q.id}
            className={`quest-row${open ? ' quest-row--clickable' : ''}${done ? ' quest-row--done' : ''}${!open ? ' quest-row--locked' : ''}`}
            onClick={() => open && onOpen(q.id)}
          >
            <span className="quest-row__title">
              <span className="chapter-row__num">Ch. {q.chapter}</span>
              {q.title}
            </span>
            <span className={`quest-row__badge${q.kind === 'boss' ? ' quest-row__badge--boss' : ''}`}>
              {!open ? 'LOCKED' : done ? 'DONE' : q.kind === 'boss' ? 'BOSS' : 'START'}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArenaShell } from '../components/ArenaShell'
import { MapNav } from '../components/QuestNav'
import { getQuestsForWorld, isQuestUnlocked } from '../data/quests'
import { WORLDS, type WorldId } from '../data/worlds'
import { useProgressStore } from '../store/progressStore'

function getNotebookKey(worldId: WorldId) {
  return `codefatality.notebook.${worldId}`
}

const LAST_QUEST_KEY = 'codefatality.lastQuestByWorld'

export function NotebookPage() {
  const navigate = useNavigate()
  const { worldId } = useParams<{ worldId: WorldId }>()
  const world = useMemo(() => WORLDS.find((w) => w.id === worldId), [worldId])
  const [notes, setNotes] = useState('')
  const completedQuestIds = useProgressStore((s) => s.completedQuestIds)

  useEffect(() => {
    document.documentElement.classList.add('viewport-lock')
    return () => document.documentElement.classList.remove('viewport-lock')
  }, [])

  useEffect(() => {
    if (!world) return
    const saved = localStorage.getItem(getNotebookKey(world.id))
    setNotes(saved ?? '')
  }, [world])

  useEffect(() => {
    if (!world) return
    localStorage.setItem(getNotebookKey(world.id), notes)
  }, [notes, world])

  if (!world) {
    return (
      <ArenaShell>
        <MapNav />
        <p>Notebook subject not found.</p>
        <Link to="/map">Back to map</Link>
      </ArenaShell>
    )
  }

  const filename = `${world.id}-notebook.txt`
  const questList = getQuestsForWorld(world.id)
  const lastQuestByWorld = JSON.parse(localStorage.getItem(LAST_QUEST_KEY) || '{}') as Record<string, string>
  const rememberedQuest = lastQuestByWorld[world.id]
  const nextUnlocked = questList.find((q) => isQuestUnlocked(q, completedQuestIds) && !completedQuestIds.includes(q.id))
  const fallbackQuest = questList.find((q) => isQuestUnlocked(q, completedQuestIds))
  const resumeQuestId =
    (rememberedQuest && questList.some((q) => q.id === rememberedQuest) ? rememberedQuest : undefined) ??
    nextUnlocked?.id ??
    fallbackQuest?.id

  return (
    <ArenaShell>
      <div className="notebook-page">
        <MapNav />

        <div className="notebook-head">
          <div className="notebook-head__copy">
            <p className="notebook-kicker">Digital Codex</p>
            <h1 className="arena-title arena-title--section">Notebook</h1>
            <p className="arena-tagline">One book per language. Auto-saved as you write.</p>
          </div>
          <div className="notebook-head__actions">
            <Link to={`/world/${world.id}`} className="notebook-back-level">
              ← Back to {world.name}
            </Link>
            {resumeQuestId && (
              <Link to={`/quest/${resumeQuestId}`} className="notebook-back-level">
                Resume quest →
              </Link>
            )}
            <button
              type="button"
              className="arena-btn arena-btn--gold notebook-download"
              onClick={() => {
                const blob = new Blob(
                  [`CODE FATALITY · ${world.name} Notebook\n\n${notes}`],
                  { type: 'text/plain;charset=utf-8' },
                )
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = filename
                a.click()
                URL.revokeObjectURL(url)
              }}
            >
              Download
            </button>
          </div>
        </div>

        <div className="notebook-subjects" role="tablist" aria-label="Notebook subjects">
          {WORLDS.map((w) => (
            <button
              key={w.id}
              type="button"
              role="tab"
              aria-selected={w.id === world.id}
              className={`notebook-subject${w.id === world.id ? ' is-active' : ''}`}
              style={{ ['--accent' as string]: w.accent }}
              onClick={() => navigate(`/notebook/${w.id}`)}
            >
              {w.name.replace(' Village', '').replace(' Forest', '').replace(' Arena', '').replace('Web ', '')}
            </button>
          ))}
        </div>

        <section className="notebook-book" aria-label={`${world.name} notebook`}>
          <div className="notebook-book__spine" aria-hidden />
          <div className="notebook-book__cover">
            <span className="notebook-book__stamp">{world.subtitle}</span>
            <strong>{world.name}</strong>
            <em>Warrior Notes</em>
          </div>
          <div className="notebook-book__page">
            <div className="notebook-book__margin" aria-hidden />
            <textarea
              className="notebook-book__input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={`Notes for ${world.name}...\n\n• Tags & concepts\n• Mistakes to avoid\n• Your own examples\n• Combo reminders`}
              spellCheck
            />
          </div>
        </section>
      </div>
    </ArenaShell>
  )
}

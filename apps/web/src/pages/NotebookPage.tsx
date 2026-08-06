import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArenaShell } from '../components/ArenaShell'
import { MapNav } from '../components/QuestNav'
import { WORLDS, type WorldId } from '../data/worlds'

function getNotebookKey(worldId: WorldId) {
  return `codefatality.notebook.${worldId}`
}

export function NotebookPage() {
  const { worldId } = useParams<{ worldId: WorldId }>()
  const world = useMemo(() => WORLDS.find((w) => w.id === worldId), [worldId])
  const [notes, setNotes] = useState('')

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

  return (
    <ArenaShell>
      <div className="notebook-page">
        <MapNav />
        <div className="notebook-head">
          <div>
            <h1 className="arena-title arena-title--section">Notebook · {world.name}</h1>
            <p className="arena-tagline">Write your own notes, examples, and shortcuts. Saved automatically.</p>
          </div>
          <button
            type="button"
            className="arena-btn arena-btn--gold notebook-download"
            onClick={() => {
              const blob = new Blob([notes], { type: 'text/plain;charset=utf-8' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = filename
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            Download Notebook
          </button>
        </div>

        <section className="notebook-paper">
          <div className="notebook-paper__rings" aria-hidden />
          <textarea
            className="notebook-paper__input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={`Chapter notes for ${world.name}...\n\n- Key tags/concepts\n- Common mistakes\n- Your own examples`}
          />
        </section>
      </div>
    </ArenaShell>
  )
}

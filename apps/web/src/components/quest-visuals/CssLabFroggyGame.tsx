import Editor from '@monaco-editor/react'
import { Link, useNavigate } from 'react-router-dom'
import { CSS_LAB_BY_ID } from '../../data/quests/cssLabs'
import type { QuestDef } from '../../data/quests/types'
import { UNLOCK_ALL_QUESTS } from '../../config/gameFlags'
import type { ValidationOutcome } from '../../lib/validateQuest'
import { CssLabBoard } from './CssLabBoard'

const JUSTIFY_HINTS = [
  'flex-start — items at the start (left)',
  'flex-end — items at the end (right)',
  'center — items in the middle',
  'space-between — space between items',
  'space-around — space around items',
]

type Props = {
  quest: QuestDef
  css: string
  setCss: (v: string) => void
  deferredCss: string
  liveCheck: ValidationOutcome | null
  onHint: () => void
  onSubmit: () => void
  feedback: { type: 'win' | 'fail'; text: string } | null
  won: boolean
  nextQuestId?: string
  editorOptions: Record<string, unknown>
  isPhone: boolean
}

export function CssLabFroggyGame({
  quest,
  css,
  setCss,
  deferredCss,
  liveCheck,
  onHint,
  onSubmit,
  feedback,
  won,
  nextQuestId,
  editorOptions,
  isPhone,
}: Props) {
  const navigate = useNavigate()
  const lab = CSS_LAB_BY_ID[quest.id]
  if (!lab) return null

  const lesson = quest.tagLessons[0]
  const target = lab.board.target
  const passed = liveCheck?.results.filter((r) => r.passed).length ?? 0
  const total = quest.objectives.length

  const showJustifyHints = lab.board.mode === 'flex' && /justify-content/i.test(quest.missionBrief ?? '')

  return (
    <div className="froggy-game">
      {UNLOCK_ALL_QUESTS && <p className="froggy-game__test">TEST MODE — all levels unlocked</p>}

      <div className="froggy-game__split">
        <aside className="froggy-panel">
          <div className="froggy-panel__head">
            <Link to={`/world/${quest.worldId}`} className="froggy-panel__back">
              ← Back
            </Link>
            <h1 className="froggy-panel__title">{lab.gameTitle}</h1>
            <p className="froggy-panel__level">
              {lab.pack} · Level {quest.chapter}
            </p>
          </div>

          <div className="froggy-panel__body">
            <p className="froggy-panel__hook">{quest.hook}</p>

            {lesson && <p className="froggy-panel__explain">{lesson.purpose}</p>}

            {showJustifyHints && (
              <ul className="froggy-panel__hints">
                {JUSTIFY_HINTS.map((h) => (
                  <li key={h}>
                    <code>{h.split(' — ')[0]}</code>
                    {h.includes(' — ') ? ` — ${h.split(' — ')[1]}` : ''}
                  </li>
                ))}
              </ul>
            )}

            <p className="froggy-panel__mission">{quest.missionBrief}</p>

            <div className="froggy-editor">
              <div className="froggy-editor__chrome">
                <span className="froggy-editor__ln">1</span>
                <span className="froggy-editor__brace">{target} {'{'}</span>
              </div>
              <div className="froggy-editor__input">
                {isPhone ? (
                  <textarea
                    value={css}
                    onChange={(e) => setCss(e.target.value)}
                    spellCheck={false}
                    rows={6}
                    aria-label="CSS properties"
                  />
                ) : (
                  <Editor
                    height="140px"
                    language="css"
                    theme="vs"
                    value={css}
                    onChange={(v) => setCss(v ?? '')}
                    options={{
                      ...editorOptions,
                      lineNumbers: 'off',
                      folding: false,
                      lineDecorationsWidth: 0,
                      glyphMargin: false,
                      renderLineHighlight: 'none',
                      scrollbar: { vertical: 'auto', horizontal: 'hidden' },
                    }}
                  />
                )}
              </div>
              <div className="froggy-editor__chrome froggy-editor__chrome--foot">
                <span className="froggy-editor__ln">3</span>
                <span className="froggy-editor__brace">{'}'}</span>
              </div>
            </div>

            <ul className="froggy-checks">
              {quest.objectives.map((obj) => {
                const done = liveCheck?.results.find((r) => r.id === obj.id)?.passed ?? false
                return (
                  <li key={obj.id} className={done ? 'is-done' : ''}>
                    {done ? '✓' : '○'} {obj.label}
                  </li>
                )
              })}
            </ul>

            {feedback && (
              <p className={`froggy-feedback froggy-feedback--${feedback.type}`}>{feedback.text}</p>
            )}

            <div className="froggy-actions">
              <button type="button" className="froggy-actions__hint" onClick={onHint}>
                Hint
              </button>
              {!won ? (
                <button type="button" className="froggy-actions__next" onClick={onSubmit}>
                  Check {passed > 0 && passed < total ? ` (${passed}/${total})` : ''}
                </button>
              ) : (
                <button
                  type="button"
                  className="froggy-actions__next"
                  onClick={() => (nextQuestId ? navigate(`/quest/${nextQuestId}`) : navigate(`/world/${quest.worldId}`))}
                >
                  {nextQuestId ? 'Next →' : 'Done ✓'}
                </button>
              )}
            </div>
          </div>
        </aside>

        <main className="froggy-board-pane" aria-label="Game board">
          <CssLabBoard
            quest={quest}
            css={deferredCss}
            checkResults={liveCheck?.results}
            won={won}
          />
        </main>
      </div>
    </div>
  )
}

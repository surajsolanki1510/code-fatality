import Editor from '@monaco-editor/react'
import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LearnPanel } from '../components/LearnPanel'
import { ArenaButton, QuestNav } from '../components/QuestNav'
import { FatalityArena, type LockOutcome } from '../components/quest-visuals/FatalityArena'
import { LiveQuestArena } from '../components/quest-visuals/LiveQuestArena'
import { BRAND } from '../config/brand'
import { getQuestById, getQuestsForWorld, isQuestUnlocked } from '../data/quests'
import { buildPreviewDocument, validateQuest } from '../lib/validateQuest'
import { useProgressStore } from '../store/progressStore'

export function QuestPage() {
  const { questId } = useParams<{ questId: string }>()
  const navigate = useNavigate()
  const quest = questId ? getQuestById(questId) : undefined
  const completeQuest = useProgressStore((s) => s.completeQuest)
  const isQuestComplete = useProgressStore((s) => s.isQuestComplete)
  const completedQuestIds = useProgressStore((s) => s.completedQuestIds)

  const [html, setHtml] = useState('')
  const [css, setCss] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'win' | 'fail'; text: string } | null>(null)
  const [hintIndex, setHintIndex] = useState(0)
  const [failIndex, setFailIndex] = useState(0)
  const [showVictory, setShowVictory] = useState(false)
  const [lockOutcome, setLockOutcome] = useState<LockOutcome>('idle')
  const [phoneTab, setPhoneTab] = useState<'learn' | 'code'>('learn')
  const [isPhone, setIsPhone] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 960px)').matches : false,
  )
  const deferredHtml = useDeferredValue(html)
  const deferredCss = useDeferredValue(css)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(max-width: 960px)')
    const onChange = () => setIsPhone(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!quest) return
    setHtml(quest.starterHtml)
    setCss(quest.starterCss ?? '')
    setFeedback(null)
    setHintIndex(0)
    setFailIndex(0)
    setShowVictory(false)
    setLockOutcome('idle')
    setPhoneTab('learn')
  }, [quest])

  const liveCheck = useMemo(() => {
    if (!quest) return null
    return validateQuest(
      quest.id,
      deferredHtml,
      quest.starterCss !== undefined ? deferredCss : undefined,
    )
  }, [quest, deferredHtml, deferredCss])

  const previewSrcDoc = useMemo(() => {
    const htmlSource = quest?.starterCss !== undefined ? quest.starterHtml : deferredHtml
    const cssSource = quest?.starterCss !== undefined ? deferredCss : deferredCss || undefined
    return buildPreviewDocument(htmlSource, cssSource)
  }, [deferredHtml, deferredCss, quest])

  const editorLanguage = quest?.starterCss !== undefined ? 'css' : 'html'
  const editorValue = editorLanguage === 'css' ? css : html
  const setEditorValue = editorLanguage === 'css' ? setCss : setHtml

  const editorOptions = useMemo(
    () => ({
      fontFamily: 'Consolas, monospace',
      fontSize: isPhone ? 13 : 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on' as const,
      padding: { top: isPhone ? 6 : 8 },
      lineNumbers: isPhone ? ('off' as const) : ('on' as const),
      quickSuggestions: !isPhone,
      suggestOnTriggerCharacters: !isPhone,
      folding: !isPhone,
      smoothScrolling: false,
      automaticLayout: true,
    }),
    [isPhone],
  )

  const chapters = quest ? getQuestsForWorld(quest.worldId) : []
  const chapterIndex = quest ? chapters.findIndex((q) => q.id === quest.id) : -1
  const nextQuest = chapterIndex >= 0 ? chapters[chapterIndex + 1] : undefined

  const passedCount = liveCheck?.results.filter((r) => r.passed).length ?? 0
  const totalCount = quest?.objectives.length ?? 0

  const coachLine = useMemo(() => {
    if (!quest) return ''
    if (lockOutcome === 'win') {
      return quest.realWorldWin
        ? `FATALITY. ${quest.realWorldWin}`
        : 'FATALITY. Chapter cleared — hit Next when you’re ready.'
    }
    if (lockOutcome === 'fail') return 'Fear hit back. No KO — fix the code and strike harder.'
    if (passedCount === 0) {
      return quest.missionBrief ?? 'Face the fear: write the first tag and throw your first punch.'
    }
    if (passedCount < totalCount) {
      return `Combo x${passedCount}! Keep building the mission — then LOCK IN for the finish.`
    }
    return 'Fear is on the ropes. Smash LOCK IN for FATALITY.'
  }, [quest, lockOutcome, passedCount, totalCount])

  const runCheck = useCallback(() => {
    if (!quest) return
    const outcome = validateQuest(quest.id, html, quest.starterCss !== undefined ? css : undefined)
    if (outcome.passed) {
      if (!isQuestComplete(quest.id)) {
        completeQuest(quest.id, quest.xp, quest.badgeId)
      }
      setShowVictory(true)
      setLockOutcome('win')
      const quip = quest.winQuips[Math.floor(Math.random() * quest.winQuips.length)]
      setFeedback({ type: 'win', text: quip })
    } else {
      setShowVictory(false)
      setLockOutcome('fail')
      const failed = outcome.results.filter((r) => !r.passed)
      const quip = quest.failQuips[failIndex % quest.failQuips.length]
      setFailIndex((i) => i + 1)
      const detail = failed.map((r) => r.message).join(' ')
      setFeedback({ type: 'fail', text: `${quip} ${detail}` })
      // Allow another fail strike later
      window.setTimeout(() => setLockOutcome('idle'), 600)
    }
  }, [quest, html, css, completeQuest, isQuestComplete, failIndex])

  if (!quest) {
    return (
      <div className="learn-app">
        <QuestNav />
        <p>Quest not found.</p>
        <Link to="/map">Back</Link>
      </div>
    )
  }

  if (!isQuestUnlocked(quest, completedQuestIds)) {
    return (
      <div className="learn-app">
        <QuestNav worldId={quest.worldId} />
        <p>This chapter is locked — clear the previous one first.</p>
        <Link to={`/world/${quest.worldId}`}>← Chapters</Link>
      </div>
    )
  }

  const alreadyDone = isQuestComplete(quest.id)
  const isHtmlVillage = quest.worldId === 'html-village'

  if (isHtmlVillage) {
    const showHint = () => {
      const hint = quest.hints[hintIndex]
      if (hint) {
        setFeedback({ type: 'fail', text: `Hint: ${hint}` })
        setHintIndex((i) => Math.min(i + 1, quest.hints.length - 1))
        setPhoneTab('code')
      }
    }

    const onLockIn = () => {
      runCheck()
      setPhoneTab('code')
    }

    return (
      <div className={`fatality-game${phoneTab === 'code' ? ' is-phone-battle' : ''}`}>
        <header className="fatality-game__nav">
          <Link to={`/world/${quest.worldId}`}>← Chapters</Link>
          <span className="fatality-game__brand">{BRAND.short}</span>
          <span className="fatality-game__chap">
            {quest.tier.toUpperCase()} · CH {quest.chapter}
            {quest.kind === 'boss' ? ' · BOSS' : ''}
          </span>
        </header>

        <nav className="fatality-phone-tabs" aria-label="Quest sections">
          <button
            type="button"
            className={phoneTab === 'learn' ? 'is-on' : ''}
            onClick={() => setPhoneTab('learn')}
          >
            Lesson
          </button>
          <button
            type="button"
            className={phoneTab === 'code' ? 'is-on' : ''}
            onClick={() => setPhoneTab('code')}
          >
            Fight
            {passedCount > 0 && (
              <span className="fatality-phone-tabs__badge">
                {passedCount}/{totalCount}
              </span>
            )}
          </button>
        </nav>

        <div className="fatality-game__split">
          <aside className={`fatality-teach${phoneTab === 'learn' ? ' is-phone-on' : ''}`}>
            <div className="fatality-teach__scroll">
              <div className="fatality-teach__level">
                <span className="fatality-teach__level-pill">Chapter {quest.chapter}</span>
                {quest.kind === 'boss' && <span>BOSS FIGHT</span>}
              </div>
              <h1 className="fatality-teach__title">{quest.title}</h1>
              <p className="fatality-teach__hook">{quest.hook}</p>

              {quest.missionBrief && (
                <div className="fatality-mission-brief">
                  <h2>Build this</h2>
                  <p>{quest.missionBrief}</p>
                  {quest.realWorldWin && (
                    <p className="fatality-mission-brief__real">
                      <strong>Real world:</strong> {quest.realWorldWin}
                    </p>
                  )}
                </div>
              )}

              <div className="fatality-explain">
                <h2>How the code works</h2>
                <p>{quest.lessonSummary}</p>
                {quest.tagLessons.map((lesson) => (
                  <article key={`${quest.id}-${lesson.tag}`} className="fatality-tag-card">
                    <code>{lesson.tag}</code>
                    <p>
                      <strong>What is this?</strong> {lesson.purpose}
                    </p>
                    {lesson.why && (
                      <p>
                        <strong>Why?</strong> {lesson.why}
                      </p>
                    )}
                    {lesson.whenToUse && (
                      <p>
                        <strong>When?</strong> {lesson.whenToUse}
                      </p>
                    )}
                    {lesson.attributes && lesson.attributes.length > 0 && (
                      <div className="fatality-tag-card__attrs">
                        <strong>Extra options</strong>
                        <ul>
                          {lesson.attributes.map((attr) => (
                            <li key={attr.name}>
                              <code>{attr.name}</code> — {attr.meaning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <pre>{lesson.example}</pre>
                    {lesson.mistake && (
                      <p className="fatality-tag-card__mistake">
                        <strong>Don&apos;t do this:</strong> {lesson.mistake}
                      </p>
                    )}
                  </article>
                ))}
              </div>

              <div className="fatality-missions">
                <h2>Your missions</h2>
                <ul>
                  {quest.objectives.map((obj) => {
                    const done = liveCheck?.results.find((r) => r.id === obj.id)?.passed ?? false
                    return (
                      <li key={obj.id} className={done ? 'is-done' : ''}>
                        <span className="fatality-missions__icon">{done ? '✓' : ''}</span>
                        {obj.label}
                      </li>
                    )
                  })}
                </ul>
              </div>

              <button
                type="button"
                className="fatality-phone-cta"
                onClick={() => setPhoneTab('code')}
              >
                Enter the arena →
              </button>
            </div>
          </aside>

          <section
            className={`fatality-play${phoneTab === 'code' ? ' is-phone-on' : ''}`}
            aria-label="Code Fatality arena"
          >
            <FatalityArena
              quest={quest}
              checkResults={liveCheck?.results}
              previewSrcDoc={previewSrcDoc}
              lockOutcome={lockOutcome}
              coachLine={coachLine}
            />
          </section>

          <div className={`fatality-editor${phoneTab === 'code' ? ' is-phone-on' : ''}`}>
            <div className="fatality-editor__bar fatality-editor__bar--desktop">
              <span className="fatality-editor__label">Your code</span>
              <button type="button" className="fatality-editor__btn fatality-editor__btn--ghost" onClick={showHint}>
                Hint
              </button>
              <button type="button" className="fatality-editor__btn fatality-editor__btn--check" onClick={runCheck}>
                LOCK IN
              </button>
              {feedback?.type === 'win' && nextQuest && (
                <button
                  type="button"
                  className="fatality-editor__btn fatality-editor__btn--next"
                  onClick={() => navigate(`/quest/${nextQuest.id}`)}
                >
                  Next →
                </button>
              )}
            </div>
            <div className="fatality-editor__missions">
              {quest.objectives.map((obj) => {
                const done = liveCheck?.results.find((r) => r.id === obj.id)?.passed ?? false
                return (
                  <span key={obj.id} className={`fatality-chip${done ? ' is-done' : ''}`}>
                    {done ? '✓ ' : ''}
                    {obj.label}
                  </span>
                )
              })}
            </div>
            <div className="fatality-editor__monaco">
              {isPhone ? (
                <textarea
                  className="fatality-editor__textarea"
                  value={editorValue}
                  onChange={(e) => {
                    setEditorValue(e.target.value)
                    if (lockOutcome === 'win') return
                    setLockOutcome('idle')
                  }}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              ) : (
                <Editor
                  height="100%"
                  language={editorLanguage}
                  theme="vs-dark"
                  value={editorValue}
                  onChange={(v) => {
                    setEditorValue(v ?? '')
                    if (lockOutcome === 'win') return
                    setLockOutcome('idle')
                  }}
                  options={editorOptions}
                />
              )}
            </div>
            {feedback && (
              <p className={`fatality-toast fatality-toast--${feedback.type}`}>
                {showVictory && !alreadyDone && <strong>FATALITY · </strong>}
                {feedback.text}
              </p>
            )}
          </div>
        </div>

        <div className="fatality-phone-actions">
          <button type="button" className="fatality-editor__btn fatality-editor__btn--ghost" onClick={showHint}>
            Hint
          </button>
          <button type="button" className="fatality-editor__btn fatality-editor__btn--check" onClick={onLockIn}>
            LOCK IN
          </button>
          {feedback?.type === 'win' && nextQuest && (
            <button
              type="button"
              className="fatality-editor__btn fatality-editor__btn--next"
              onClick={() => navigate(`/quest/${nextQuest.id}`)}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="learn-app">
      <QuestNav worldId={quest.worldId} />

      <div className="learn-grid">
        <LearnPanel quest={quest} checkResults={liveCheck?.results} />

        <div className="learn-workspace">
          <div className="learn-workspace__toolbar">
            <span className="learn-workspace__label">Your code</span>
            <div className="learn-workspace__actions">
              <ArenaButton
                variant="ghost"
                onClick={() => {
                  const hint = quest.hints[hintIndex]
                  if (hint) {
                    setFeedback({ type: 'fail', text: `💡 Hint: ${hint}` })
                    setHintIndex((i) => Math.min(i + 1, quest.hints.length - 1))
                  }
                }}
              >
                Hint
              </ArenaButton>
              <ArenaButton variant="gold" onClick={runCheck}>
                Run check
              </ArenaButton>
            </div>
          </div>

          <div className="editor-wrap editor-wrap--learn">
            {isPhone ? (
              <textarea
                className="fatality-editor__textarea fatality-editor__textarea--learn"
                value={editorValue}
                onChange={(e) => setEditorValue(e.target.value)}
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
              />
            ) : (
              <Editor
                height="420px"
                language={editorLanguage}
                theme="vs-dark"
                value={editorValue}
                onChange={(v) => setEditorValue(v ?? '')}
                options={{ ...editorOptions, fontSize: 15, padding: { top: 12 } }}
              />
            )}
          </div>

          {quest.starterCss !== undefined && <pre className="learn-template">{quest.starterHtml}</pre>}

          {feedback && (
            <div className={`learn-toast learn-toast--${feedback.type}`}>
              {showVictory && !alreadyDone && <strong>LEVEL CLEARED · </strong>}
              {feedback.text}
              {feedback.type === 'win' && nextQuest && (
                <button type="button" className="learn-toast__next" onClick={() => navigate(`/quest/${nextQuest.id}`)}>
                  Next chapter →
                </button>
              )}
            </div>
          )}
        </div>

        <div className="learn-preview-col">
          <h2 className="learn-preview-col__title">Live preview</h2>
          <p className="learn-preview-col__sub">This white box is your real browser page as you code.</p>
          <LiveQuestArena html={html} previewSrcDoc={previewSrcDoc} />
        </div>
      </div>
    </div>
  )
}

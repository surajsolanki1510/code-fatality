import Editor from '@monaco-editor/react'
import { useCallback, useDeferredValue, useEffect, useMemo, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LearnPanel } from '../components/LearnPanel'
import { ArenaButton, QuestNav } from '../components/QuestNav'
import { FatalityArena, type LockOutcome } from '../components/quest-visuals/FatalityArena'
import { LiveQuestArena } from '../components/quest-visuals/LiveQuestArena'
import { CssLabFroggyGame } from '../components/quest-visuals/CssLabFroggyGame'
import { PortfolioBuilderArena } from '../components/quest-visuals/PortfolioBuilderArena'
import { continuePortfolioFiles } from '../data/quests/portfolioHtml'
import { downloadPortfolioFiles, GITHUB_PAGES_STEPS } from '../lib/exportPortfolio'
import { injectPortfolioHtml, usePortfolioStore } from '../store/portfolioStore'
import { UNLOCK_ALL_QUESTS } from '../config/gameFlags'
import { BRAND } from '../config/brand'
import { getQuestById, getQuestsForWorld, isQuestUnlocked } from '../data/quests'
import { buildPreviewDocument, validateQuest } from '../lib/validateQuest'
import { useProgressStore } from '../store/progressStore'

const LAST_QUEST_KEY = 'codefatality.lastQuestByWorld'

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
  const [codeLang, setCodeLang] = useState<'html' | 'css'>('html')
  const [isPhone, setIsPhone] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 960px)').matches : false,
  )
  const [hydrated, setHydrated] = useState(() =>
    typeof window === 'undefined' ? false : usePortfolioStore.persist.hasHydrated(),
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
    const finish = () => setHydrated(true)
    if (usePortfolioStore.persist.hasHydrated()) finish()
    return usePortfolioStore.persist.onFinishHydration(finish)
  }, [])

  useEffect(() => {
    if (!quest) return
    if (quest.worldId === 'css-forest') {
      if (!hydrated) return
      if (quest.kind === 'lab') {
        setHtml(quest.starterHtml)
        setCss(quest.starterCss ?? '')
      } else {
        const { siteHtml, siteCss } = usePortfolioStore.getState()
        const next = continuePortfolioFiles(
          siteHtml ?? '',
          siteCss ?? '',
          quest.starterHtml,
          quest.starterCss ?? '',
        )
        setHtml(next.html)
        setCss(next.css)
      }
    } else {
      setHtml(quest.starterHtml)
      setCss(quest.starterCss ?? '')
    }
    setFeedback(null)
    setHintIndex(0)
    setFailIndex(0)
    setShowVictory(false)
    setLockOutcome('idle')
    setPhoneTab(quest.kind === 'lab' ? 'code' : 'learn')
    setCodeLang(quest.kind === 'lab' || (quest.worldId === 'css-forest' && quest.chapter > 1) ? 'css' : 'html')
  }, [quest, hydrated])

  const name = usePortfolioStore((s) => s.name)
  const tagline = usePortfolioStore((s) => s.tagline)
  const about = usePortfolioStore((s) => s.about)
  const photoDataUrl = usePortfolioStore((s) => s.photoDataUrl)
  const portfolioProfile = useMemo(
    () => ({ name, tagline, about, photoDataUrl, siteHtml: '', siteCss: '' }),
    [name, tagline, about, photoDataUrl],
  )

  const isCssForest = quest?.worldId === 'css-forest'
  const isCssLab = quest?.kind === 'lab'

  useEffect(() => {
    if (!isCssForest || !hydrated || isCssLab) return
    if (!html.trim() && !css.trim()) return
    usePortfolioStore.getState().saveSite(html, css)
  }, [html, css, isCssForest, hydrated, isCssLab])

  const portfolioHtml = useMemo(() => {
    if (!isCssForest || isCssLab) return deferredHtml
    return injectPortfolioHtml(deferredHtml, portfolioProfile)
  }, [deferredHtml, isCssForest, isCssLab, portfolioProfile])

  const liveCheck = useMemo(() => {
    if (!quest) return null
    if (isCssLab) return validateQuest(quest.id, deferredHtml, deferredCss)
    if (isCssForest) return validateQuest(quest.id, portfolioHtml, deferredCss)
    return validateQuest(
      quest.id,
      deferredHtml,
      quest.starterCss !== undefined ? deferredCss : undefined,
    )
  }, [quest, portfolioHtml, deferredHtml, deferredCss, isCssForest, isCssLab])

  const previewSrcDoc = useMemo(() => {
    if (!quest || isCssLab) return ''
    if (isCssForest) return buildPreviewDocument(portfolioHtml, deferredCss || undefined)
    const htmlSource = quest.starterCss !== undefined ? quest.starterHtml : deferredHtml
    const cssSource = quest.starterCss !== undefined ? deferredCss : deferredCss || undefined
    return buildPreviewDocument(htmlSource, cssSource)
  }, [portfolioHtml, deferredHtml, deferredCss, quest, isCssForest, isCssLab])

  const [colSplit, setColSplit] = useState(0.58)
  const [focusMode, setFocusMode] = useState(false)
  const editorLanguage = quest?.starterCss !== undefined ? 'css' : 'html'
  const editorValue = editorLanguage === 'css' ? css : html
  const setEditorValue = editorLanguage === 'css' ? setCss : setHtml

  const editorOptions = useMemo(
    () => ({
      fontFamily: 'Consolas, monospace',
      fontSize: isPhone ? 16 : 18,
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

  useEffect(() => {
    if (!quest) return
    const prevRaw = localStorage.getItem(LAST_QUEST_KEY)
    const prev = prevRaw ? (JSON.parse(prevRaw) as Record<string, string>) : {}
    prev[quest.worldId] = quest.id
    localStorage.setItem(LAST_QUEST_KEY, JSON.stringify(prev))
  }, [quest])

  const copyText = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text)
  }, [])

  const runCheck = useCallback(() => {
    if (!quest) return
    const outcome =
      quest.kind === 'lab'
        ? validateQuest(quest.id, html, css)
        : isCssForest
          ? validateQuest(quest.id, injectPortfolioHtml(html, portfolioProfile), css)
          : validateQuest(quest.id, html, quest.starterCss !== undefined ? css : undefined)
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
      window.setTimeout(() => setLockOutcome('idle'), 600)
    }
  }, [quest, html, css, completeQuest, isQuestComplete, failIndex, isCssForest, portfolioProfile])

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

  if (isCssForest) {
    const showHint = () => {
      const hint = quest.hints[hintIndex]
      if (hint) {
        setFeedback({ type: 'fail', text: `Hint: ${hint}` })
        setHintIndex((i) => Math.min(i + 1, quest.hints.length - 1))
        setPhoneTab('code')
      }
    }

    const onPostGlow = () => {
      runCheck()
      setPhoneTab('code')
    }

    const onCodeChange = () => {
      if (lockOutcome === 'win') return
      setLockOutcome('idle')
    }

    if (isCssLab) {
      const onLabCssChange = (v: string) => {
        setCss(v)
        if (lockOutcome === 'win') return
        setLockOutcome('idle')
      }
      return (
        <CssLabFroggyGame
          quest={quest}
          css={css}
          setCss={onLabCssChange}
          deferredCss={deferredCss}
          liveCheck={liveCheck}
          onHint={showHint}
          onSubmit={runCheck}
          feedback={feedback}
          won={lockOutcome === 'win' || alreadyDone}
          nextQuestId={nextQuest?.id}
          editorOptions={editorOptions}
          isPhone={isPhone}
        />
      )
    }

    const packLabel = quest.story[0]?.replace('Portfolio section: ', '') || 'CSS'
    const lesson = quest.tagLessons[0]
    const isLaunch = quest.id === 'css-p-e-boss'
    const showLaunch = isLaunch && (lockOutcome === 'win' || alreadyDone)
    const htmlStructureSnippet = `<header>\n  <h1>Your Name</h1>\n  <p>Your role / tagline</p>\n</header>\n\n<main>\n  <section id="about"></section>\n  <section id="projects"></section>\n  <section id="contact"></section>\n</main>`
    const lessonSnippet = lesson?.example?.trim() || ''

    const onColResizeStart = (e: ReactMouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const start = colSplit
      const onMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startX
        const next = Math.min(0.72, Math.max(0.28, start + dx / 900))
        setColSplit(next)
      }
      const onUp = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    }

    const splitStyle: CSSProperties = {
      '--pf-code-col': `${colSplit}fr`,
      '--pf-preview-col': `${1 - colSplit}fr`,
    } as CSSProperties

    return (
      <div
        className={`pf-game${phoneTab === 'code' ? ' is-phone-build' : ''}${focusMode ? ' is-focus' : ''}`}
        style={splitStyle}
      >
        {UNLOCK_ALL_QUESTS && (
          <p className="pf-unlock-banner">TEST MODE — all levels unlocked</p>
        )}
        <header className="pf-game__nav">
          <Link to={`/world/${quest.worldId}`}>← Portfolio</Link>
          <Link to="/map">Map</Link>
          <Link to={`/notebook/${quest.worldId}`}>Notebook</Link>
          <span className="pf-game__brand">PORTFOLIO FORGE</span>
          <button
            type="button"
            className={`pf-focus-btn${focusMode ? ' is-on' : ''}`}
            onClick={() => setFocusMode((f) => !f)}
          >
            {focusMode ? 'Show lesson' : 'Focus code'}
          </button>
          <span className="pf-game__chap">
            LVL {quest.chapter} · {packLabel}
            {quest.kind === 'boss' ? ' · BOSS' : ''}
          </span>
        </header>

        <nav className="pf-phone-tabs" aria-label="Sections">
          <button type="button" className={phoneTab === 'learn' ? 'is-on' : ''} onClick={() => setPhoneTab('learn')}>
            Learn
          </button>
          <button type="button" className={phoneTab === 'code' ? 'is-on' : ''} onClick={() => setPhoneTab('code')}>
            Code
            {passedCount > 0 && (
              <span className="fatality-phone-tabs__badge">
                {passedCount}/{totalCount}
              </span>
            )}
          </button>
        </nav>

        <div className="pf-game__split">
          <aside className={`pf-lesson${phoneTab === 'learn' ? ' is-phone-on' : ''}`}>
            <div className="pf-lesson__scroll">
              <span className="pf-lesson__pack">{packLabel} · {quest.tier}</span>
              <h1 className="pf-lesson__title">{quest.title}</h1>

              <div className="pf-lesson__job">
                <h2>Instruction</h2>
                <p>{quest.missionBrief}</p>
              </div>

              {lesson && (
                <div className="pf-lesson__note">
                  <code>Use: {lesson.tag}</code>
                  <pre>{lesson.example}</pre>
                  <button
                    type="button"
                    className="pf-code__btn pf-code__btn--ghost"
                    onClick={() =>
                      void copyText(lessonSnippet).then(() => setFeedback({ type: 'win', text: 'Snippet copied.' }))
                    }
                  >
                    Copy code
                  </button>
                </div>
              )}

              {codeLang === 'html' && (
                <div className="pf-lesson__note">
                  <code>Where to place tags</code>
                  <pre>{htmlStructureSnippet}</pre>
                  <button
                    type="button"
                    className="pf-code__btn pf-code__btn--ghost"
                    onClick={() =>
                      void copyText(htmlStructureSnippet).then(() =>
                        setFeedback({ type: 'win', text: 'HTML layout template copied.' }),
                      )
                    }
                  >
                    Copy layout
                  </button>
                </div>
              )}

              <ul className="pf-lesson__list">
                {quest.objectives.map((obj) => {
                  const done = liveCheck?.results.find((r) => r.id === obj.id)?.passed ?? false
                  return (
                    <li key={obj.id} className={done ? 'is-done' : ''}>
                      <span>{done ? '✓' : '○'}</span>
                      {obj.label}
                    </li>
                  )
                })}
              </ul>

              {showLaunch && (
                <div className="pf-launch">
                  <h3>Launch your portfolio</h3>
                  <p>Download your code, then host it free on GitHub Pages.</p>
                  <ol>
                    {GITHUB_PAGES_STEPS.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <div className="pf-launch__btns">
                    <button
                      type="button"
                      onClick={() => {
                        const { siteHtml, siteCss } = usePortfolioStore.getState()
                        downloadPortfolioFiles(siteHtml || html, siteCss || css, portfolioProfile)
                      }}
                    >
                      Download HTML + CSS
                    </button>
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => window.open('https://pages.github.com/', '_blank', 'noopener,noreferrer')}
                    >
                      GitHub Pages guide
                    </button>
                  </div>
                </div>
              )}

              <button type="button" className="pf-lesson__cta" onClick={() => setPhoneTab('code')}>
                Code your portfolio →
              </button>
            </div>
          </aside>

          <section className={`pf-stage${phoneTab === 'code' ? ' is-phone-on' : ''}`}>
            <PortfolioBuilderArena previewSrcDoc={previewSrcDoc} />
          </section>

          {!isPhone && (
            <div
              className="pf-split-handle pf-split-handle--col-preview"
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize code and preview"
              onMouseDown={onColResizeStart}
            />
          )}

          <div className={`pf-code${phoneTab === 'code' ? ' is-phone-on' : ''}`}>
            <div className="pf-code__tabs" role="tablist">
              <button
                type="button"
                data-lang="html"
                className={codeLang === 'html' ? 'is-on' : ''}
                onClick={() => setCodeLang('html')}
              >
                HTML
              </button>
              <button
                type="button"
                data-lang="css"
                className={codeLang === 'css' ? 'is-on' : ''}
                onClick={() => setCodeLang('css')}
              >
                CSS
              </button>
            </div>
            <p className="pf-code__hint">
              {codeLang === 'html'
                ? 'This HTML is your portfolio page. Type your name, photo (src="{{PHOTO}}"), and sections here.'
                : 'This CSS is your stylesheet. Every rule you write styles the page above — it stays for every level.'}
            </p>
            <div className="pf-code__editor">
              {isPhone ? (
                <textarea
                  className="fatality-editor__textarea"
                  value={codeLang === 'css' ? css : html}
                  onChange={(e) => {
                    if (codeLang === 'css') setCss(e.target.value)
                    else setHtml(e.target.value)
                    onCodeChange()
                  }}
                  spellCheck={false}
                />
              ) : (
                <Editor
                  height="100%"
                  language={codeLang === 'css' ? 'css' : 'html'}
                  theme="vs-dark"
                  value={codeLang === 'css' ? css : html}
                  onChange={(v) => {
                    if (codeLang === 'css') setCss(v ?? '')
                    else setHtml(v ?? '')
                    onCodeChange()
                  }}
                  options={editorOptions}
                />
              )}
            </div>
            <div className="pf-code__bar pf-code__bar--desktop">
              <span>index.html / styles.css</span>
              <button
                type="button"
                className="pf-code__btn pf-code__btn--ghost"
                onClick={() =>
                  void copyText(codeLang === 'css' ? css : html).then(() => setFeedback({ type: 'win', text: 'Code copied.' }))
                }
              >
                Copy code
              </button>
              <button type="button" className="pf-code__btn pf-code__btn--ghost" onClick={showHint}>
                Hint
              </button>
              <button type="button" className="pf-code__btn pf-code__btn--publish" onClick={runCheck}>
                PUBLISH SECTION
              </button>
              {feedback?.type === 'win' && nextQuest && (
                <button type="button" className="pf-code__btn pf-code__btn--next" onClick={() => navigate(`/quest/${nextQuest.id}`)}>
                  {nextQuest.kind === 'lab' ? 'Next lab →' : nextQuest.kind === 'boss' ? 'Boss →' : 'Back to portfolio →'}
                </button>
              )}
            </div>
            {feedback && (
              <p className={`pf-toast pf-toast--${feedback.type}`}>
                {showVictory && !alreadyDone && <strong>SAVED · </strong>}
                {feedback.text}
              </p>
            )}
          </div>
        </div>

        <div className="pf-phone-actions">
          <button
            type="button"
            className="pf-code__btn pf-code__btn--ghost"
            onClick={() =>
              void copyText(codeLang === 'css' ? css : html).then(() => setFeedback({ type: 'win', text: 'Code copied.' }))
            }
          >
            Copy
          </button>
          <button type="button" className="pf-code__btn pf-code__btn--ghost" onClick={showHint}>
            Hint
          </button>
          <button type="button" className="pf-code__btn pf-code__btn--publish" onClick={onPostGlow}>
            PUBLISH SECTION
          </button>
          {feedback?.type === 'win' && nextQuest && (
            <button type="button" className="pf-code__btn pf-code__btn--next" onClick={() => navigate(`/quest/${nextQuest.id}`)}>
              Next →
            </button>
          )}
        </div>
      </div>
    )
  }

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
          <Link to={`/notebook/${quest.worldId}`} className="fatality-game__notebook">
            Notebook
          </Link>
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

              <div className="fatality-explain">
                <h2>Instruction + code</h2>
                {quest.tagLessons.slice(0, 1).map((lesson) => (
                  <article key={`${quest.id}-${lesson.tag}`} className="fatality-tag-card">
                    <code>Use this tag: {lesson.tag}</code>
                    <p>{lesson.purpose}</p>
                    <pre>{lesson.example}</pre>
                    <button
                      type="button"
                      className="fatality-editor__btn fatality-editor__btn--ghost"
                      onClick={() => void copyText(lesson.example).then(() => setFeedback({ type: 'win', text: 'Snippet copied.' }))}
                    >
                      Copy code
                    </button>
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
              <button
                type="button"
                className="fatality-editor__btn fatality-editor__btn--ghost"
                onClick={() =>
                  void copyText(editorValue).then(() => setFeedback({ type: 'win', text: 'Code copied.' }))
                }
              >
                Copy code
              </button>
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
          <button
            type="button"
            className="fatality-editor__btn fatality-editor__btn--ghost"
            onClick={() => void copyText(editorValue).then(() => setFeedback({ type: 'win', text: 'Code copied.' }))}
          >
            Copy
          </button>
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
                onClick={() => void copyText(editorValue).then(() => setFeedback({ type: 'win', text: 'Code copied.' }))}
              >
                Copy code
              </ArenaButton>
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

import type { QuestDef, TagLesson } from '../data/quests/types'

type Props = {
  quest: QuestDef
  checkResults?: { id: string; passed: boolean; message: string }[]
}

function TagLessonCard({ lesson }: { lesson: TagLesson }) {
  return (
    <article className="tag-card">
      <code className="tag-card__tag">{lesson.tag}</code>
      <p className="tag-card__purpose">
        <strong>What is this?</strong> {lesson.purpose}
      </p>
      {lesson.why && (
        <p className="tag-card__why">
          <strong>Why?</strong> {lesson.why}
        </p>
      )}
      {lesson.whenToUse && (
        <p className="tag-card__when">
          <strong>When?</strong> {lesson.whenToUse}
        </p>
      )}
      {lesson.attributes && lesson.attributes.length > 0 && (
        <div className="tag-card__attrs">
          <strong>Extra options:</strong>
          <ul>
            {lesson.attributes.map((attr) => (
              <li key={attr.name}>
                <code>{attr.name}</code> — {attr.meaning}
              </li>
            ))}
          </ul>
        </div>
      )}
      <pre className="tag-card__example">{lesson.example}</pre>
      {lesson.mistake && (
        <p className="tag-card__mistake">
          <strong>Don&apos;t do this:</strong> {lesson.mistake}
        </p>
      )}
    </article>
  )
}

export function LearnPanel({ quest, checkResults }: Props) {
  return (
    <aside className="learn-panel">
      <div className="learn-panel__chapter">
        {quest.tier.toUpperCase()} · Chapter {quest.chapter}
        {quest.kind === 'boss' && ' · BOSS'}
      </div>
      <h1 className="learn-panel__title">{quest.title}</h1>
      <p className="learn-panel__hook">{quest.hook}</p>

      <div className="mentor-bubble">
        <span className="mentor-bubble__name">{quest.speaker}</span>
        {quest.story.map((line) => (
          <p key={line.slice(0, 24)} className="mentor-bubble__line">
            {line}
          </p>
        ))}
      </div>

      <div className="learn-box">
        <h2 className="learn-box__heading">How the code works</h2>
        <p className="learn-box__text">{quest.lessonSummary}</p>
      </div>

      {quest.tagLessons.length > 0 && (
        <div className="tag-academy">
          <h2 className="learn-box__heading">Easy tag guide</h2>
          {quest.tagLessons.map((t) => (
            <TagLessonCard key={t.tag} lesson={t} />
          ))}
        </div>
      )}

      <div className="learn-box">
        <h2 className="learn-box__heading">Your mission</h2>
        <ul className="mission-list">
          {quest.objectives.map((obj) => {
            const done = checkResults?.find((r) => r.id === obj.id)?.passed ?? false
            return (
              <li key={obj.id} className={done ? 'mission-list__done' : ''}>
                <span className="mission-list__icon">{done ? '✓' : '○'}</span>
                {obj.label}
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}

import { CSS_LAB_BY_ID } from '../../data/quests/cssLabs'
import type { QuestDef } from '../../data/quests/types'
import type { CheckResult } from '../../lib/validateQuest'

type Props = {
  quest: QuestDef
  css: string
  checkResults?: CheckResult[]
  won: boolean
}

/** Froggy-style visual CSS lab — write rules, watch the board react. */
export function CssLabArena({ quest, css, checkResults, won }: Props) {
  const lab = CSS_LAB_BY_ID[quest.id]
  if (!lab) return null

  const board = lab.board
  const id = board.target.replace(/^#/, '')
  const passed = checkResults?.filter((r) => r.passed).length ?? 0
  const total = quest.objectives.length

  const liveCss =
    board.mode === 'animation'
      ? css
      : `${board.before}\n${css}\n${board.after}`

  return (
    <div className={`css-lab css-lab--${board.mode}${won ? ' is-won' : ''}`}>
      <div className="css-lab__hud">
        <span className="css-lab__mode">{lab.pack}</span>
        <strong>
          {passed}/{total} locked in
        </strong>
        {won && <em className="css-lab__badge">CLEARED</em>}
      </div>

      <div className={`css-lab__stage ${board.boardClass ?? ''}`}>
        <style>{`
          .css-lab__stage #pond, .css-lab__stage #garden, .css-lab__stage #stage {
            width: 100%;
            min-height: 180px;
            height: 100%;
            box-sizing: border-box;
            padding: 1rem;
            border-radius: 16px;
            background: rgba(255,255,255,0.12);
            border: 2px dashed rgba(255,255,255,0.25);
          }
          .css-lab__stage .piece, .css-lab__stage #orb, .css-lab__stage #pulse {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            font-weight: 800;
            color: #0f172a;
            box-shadow: 0 8px 20px rgba(0,0,0,0.25);
            flex-shrink: 0;
          }
          .css-lab__stage.is-grid-basic #garden,
          .css-lab__stage.is-grid-3 #garden,
          .css-lab__stage.is-grid-auto #garden {
            min-height: 200px;
          }
          .css-lab__stage.is-grid-basic .piece,
          .css-lab__stage.is-grid-3 .piece,
          .css-lab__stage.is-grid-auto .piece {
            border-radius: 12px;
            width: auto;
            min-height: 64px;
          }
          .css-lab__stage.is-transition,
          .css-lab__stage.is-anim {
            display: grid;
            place-items: center;
          }
          .css-lab__stage.is-transition #orb,
          .css-lab__stage.is-anim #pulse {
            width: 88px;
            height: 88px;
            font-size: 1.6rem;
            cursor: pointer;
          }
          .css-lab__stage.is-responsive #stage > .piece {
            border-radius: 12px;
            width: auto;
            flex: 1;
            min-height: 72px;
          }
          ${liveCss}
        `}</style>

        {board.mode === 'flex' && (
          <div id={id}>
            {board.pieces.map((p) => (
              <div key={p.id} className="piece" style={{ background: p.hue }}>
                {p.label}
              </div>
            ))}
          </div>
        )}

        {board.mode === 'grid' && (
          <div id={id}>
            {board.pieces.map((p) => (
              <div key={p.id} className="piece" style={{ background: p.hue }}>
                {p.label}
              </div>
            ))}
          </div>
        )}

        {board.mode === 'transition' && (
          <div id="orb" style={{ background: board.pieces[0]?.hue }}>
            {board.pieces[0]?.label}
          </div>
        )}

        {board.mode === 'animation' && (
          <div id="pulse" style={{ background: board.pieces[0]?.hue }}>
            {board.pieces[0]?.label}
          </div>
        )}

        {board.mode === 'responsive' && (
          <div id={id}>
            {board.pieces.map((p) => (
              <div key={p.id} className="piece" style={{ background: p.hue }}>
                {p.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="css-lab__tip">
        {board.mode === 'transition'
          ? 'Hover the orb after you add transition — it should glide, not jump.'
          : board.mode === 'animation'
            ? 'Watch the piece — keyframes should make it move by itself.'
            : board.mode === 'responsive'
              ? 'Write a @media query. Shrink thinking: phone stacks the row.'
              : 'Write CSS for the board. When the checklist lights up, hit CLEAR LAB.'}
      </p>

      <ul className="css-lab__checks">
        {quest.objectives.map((obj) => {
          const done = checkResults?.find((r) => r.id === obj.id)?.passed ?? false
          return (
            <li key={obj.id} className={done ? 'is-done' : ''}>
              {done ? '✓' : '○'} {obj.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

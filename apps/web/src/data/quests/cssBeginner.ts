import type { QuestDef } from './types'

type Draft = Omit<QuestDef, 'worldId' | 'speaker' | 'xp' | 'winQuips' | 'failQuips'> & {
  winQuips?: string[]
  failQuips?: string[]
  xp?: number
}

function q(draft: Draft): QuestDef {
  return {
    worldId: 'css-forest',
    speaker: 'Zara',
    xp: draft.xp ?? (draft.tier === 'expert' ? 95 : draft.tier === 'intermediate' ? 75 : 55),
    winQuips: draft.winQuips ?? ['LOOK LOCKED. The runway felt that drip.'],
    failQuips: draft.failQuips ?? ['Vibe rejected. Check the selector and try again.'],
    ...draft,
  }
}

const runwayHtml = `<div class="runway">
  <h1 class="title">STYLE FORGE</h1>
  <p class="tag">Neon looks · real CSS</p>
  <div class="card">
    <span class="badge">LOOK</span>
    <p class="bio">Your CSS dresses this stage.</p>
  </div>
  <div class="row">
    <div class="tile">A</div>
    <div class="tile">B</div>
    <div class="tile">C</div>
  </div>
</div>`

/** STYLE FORGE — different fantasy from HTML combat: dress the neon runway with CSS */
export const CSS_BEGINNER: QuestDef[] = [
  q({
    id: 'css-b01',
    kind: 'tutorial',
    tier: 'beginner',
    chapter: 1,
    title: 'Flood the Stage',
    hook: 'Before outfits — light the room.',
    missionBrief: 'Paint the whole page with body { background-color: ... }.',
    realWorldWin: 'Landing pages, app shells, dark mode — every site starts with a stage color.',
    story: [
      'HTML built the bones. CSS is the glow-up.',
      'Hit the body selector and flood the runway with color.',
    ],
    lessonSummary: '`body { }` styles the whole page. `background-color` sets the wash behind everything.',
    tagLessons: [
      {
        tag: 'body { }',
        purpose: 'Targets the whole page canvas.',
        why: 'One rule can set dark mode or brand vibe instantly.',
        example: 'body {\n  background-color: #0b0612;\n}',
        mistake: 'Writing background without a selector does nothing.',
      },
    ],
    objectives: [{ id: 'body-bg', label: 'Set body { background-color: ... }' }],
    hints: ['body {\n  background-color: #0b0612;\n}'],
    starterHtml: runwayHtml,
    starterCss: `/* Mission: flood the stage */\n`,
    winQuips: ['STAGE LIT. Same skill as every dark-mode homepage.'],
  }),
  q({
    id: 'css-b02',
    kind: 'tutorial',
    tier: 'beginner',
    chapter: 2,
    title: 'Neon Title Drop',
    hook: 'The headline needs to scream.',
    missionBrief: 'Color the title: .title { color: ... }.',
    realWorldWin: 'Hero headlines, logos, CTAs — color hierarchy is everywhere.',
    story: ['White on black is safe. Neon on black is a statement.', 'Style .title and make it impossible to ignore.'],
    lessonSummary: '`color` paints text. Target `.title` so only the headline changes.',
    tagLessons: [
      {
        tag: '.title { color }',
        purpose: 'Changes text color for that class.',
        example: '.title {\n  color: #5dff9f;\n}',
      },
    ],
    objectives: [{ id: 'title-color', label: 'Set .title { color: ... }' }],
    hints: ['.title {\n  color: #5dff9f;\n}'],
    starterHtml: runwayHtml,
    starterCss: `body {\n  background-color: #0b0612;\n  color: #f2ebe0;\n}\n\n/* Neon the title */\n`,
  }),
  q({
    id: 'css-b03',
    kind: 'quest',
    tier: 'beginner',
    chapter: 3,
    title: 'Font Attitude',
    hook: 'Typography is personality.',
    missionBrief: 'Give .title a bigger font-size and a bold font-weight.',
    realWorldWin: 'Marketing sites and apps use size + weight to create hierarchy.',
    story: ['Tiny type whispers. Big type owns the runway.', 'Bump size and weight on .title.'],
    lessonSummary: '`font-size` controls scale. `font-weight` controls boldness.',
    tagLessons: [
      {
        tag: 'font-size / font-weight',
        purpose: 'Size and boldness of text.',
        example: '.title {\n  font-size: 2.4rem;\n  font-weight: 800;\n}',
      },
    ],
    objectives: [
      { id: 'title-size', label: 'Set .title { font-size: ... }' },
      { id: 'title-weight', label: 'Set .title { font-weight: ... }' },
    ],
    hints: ['.title {\n  font-size: 2.4rem;\n  font-weight: 800;\n}'],
    starterHtml: runwayHtml,
    starterCss: `body { background-color: #0b0612; color: #f2ebe0; }
.title { color: #5dff9f; }
`,
  }),
  q({
    id: 'css-b04',
    kind: 'quest',
    tier: 'beginner',
    chapter: 4,
    title: 'Center the Spotlight',
    hook: 'Runways love a centered look.',
    missionBrief: 'Center .runway text with text-align and add letter-spacing to .tag.',
    realWorldWin: 'Hero sections, captions, empty states — alignment sells polish.',
    story: ['Left-aligned is default. Centered feels intentional.', 'Align the stage. Space the tagline letters.'],
    lessonSummary: '`text-align` lines up text. `letter-spacing` opens the letters.',
    tagLessons: [
      {
        tag: 'text-align / letter-spacing',
        purpose: 'Align text and space characters.',
        example: '.runway { text-align: center; }\n.tag { letter-spacing: 0.2em; }',
      },
    ],
    objectives: [
      { id: 'align-center', label: 'Set .runway { text-align: center }' },
      { id: 'tracking', label: 'Set .tag { letter-spacing: ... }' },
    ],
    hints: ['.runway { text-align: center; }\n.tag { letter-spacing: 0.18em; }'],
    starterHtml: runwayHtml,
    starterCss: `body { background-color: #0b0612; color: #f2ebe0; }
.title { color: #5dff9f; font-size: 2.2rem; font-weight: 800; }
`,
  }),
  q({
    id: 'css-b05',
    kind: 'quest',
    tier: 'beginner',
    chapter: 5,
    title: 'Frame the Look Card',
    hook: 'Cards need borders and breathing room.',
    missionBrief: 'Style .card with padding, border, and border-radius.',
    realWorldWin: 'Product cards, profiles, pricing tiles — padding + radius = modern UI.',
    story: ['A naked box looks unfinished.', 'Pad it. Border it. Round the corners.'],
    lessonSummary: '`padding` is space inside. `border` draws the edge. `border-radius` softens corners.',
    tagLessons: [
      {
        tag: 'padding / border / border-radius',
        purpose: 'Box polish for cards.',
        example: '.card {\n  padding: 1rem;\n  border: 2px solid #5dff9f;\n  border-radius: 14px;\n}',
      },
    ],
    objectives: [
      { id: 'card-pad', label: 'Set .card { padding: ... }' },
      { id: 'card-border', label: 'Set .card { border: ... }' },
      { id: 'card-radius', label: 'Set .card { border-radius: ... }' },
    ],
    hints: ['.card {\n  padding: 1rem;\n  border: 2px solid #5dff9f;\n  border-radius: 14px;\n}'],
    starterHtml: runwayHtml,
    starterCss: `body { background-color: #0b0612; color: #f2ebe0; text-align: center; }
.title { color: #5dff9f; font-size: 2.2rem; font-weight: 800; }
.tag { letter-spacing: 0.16em; }
`,
  }),
  q({
    id: 'css-b06',
    kind: 'quest',
    tier: 'beginner',
    chapter: 6,
    title: 'Shadow Drip',
    hook: 'Depth sells the fantasy.',
    missionBrief: 'Add box-shadow to .card so it floats off the stage.',
    realWorldWin: 'Elevated cards, modals, buttons — shadows create layers.',
    story: ['Flat is fine. Floating looks expensive.', 'Drop a glow shadow under .card.'],
    lessonSummary: '`box-shadow` paints soft depth around an element.',
    tagLessons: [
      {
        tag: 'box-shadow',
        purpose: 'Adds depth/glow around a box.',
        example: '.card {\n  box-shadow: 0 12px 40px rgba(93, 255, 159, 0.35);\n}',
      },
    ],
    objectives: [{ id: 'card-shadow', label: 'Set .card { box-shadow: ... }' }],
    hints: ['.card {\n  box-shadow: 0 12px 40px rgba(93, 255, 159, 0.35);\n}'],
    starterHtml: runwayHtml,
    starterCss: `body { background-color: #0b0612; color: #f2ebe0; text-align: center; }
.title { color: #5dff9f; font-size: 2.2rem; font-weight: 800; }
.card {
  padding: 1rem;
  border: 2px solid #5dff9f;
  border-radius: 14px;
}
`,
  }),
  q({
    id: 'css-b07',
    kind: 'quest',
    tier: 'beginner',
    chapter: 7,
    title: 'Width Discipline',
    hook: 'Runaway full-width text looks messy.',
    missionBrief: 'Give .card a max-width and center it with margin: auto.',
    realWorldWin: 'Readable content columns on every blog and docs site.',
    story: ['On big screens, text shouldn’t stretch forever.', 'Cap the width. Auto-margins center the card.'],
    lessonSummary: '`max-width` caps size. `margin: auto` centers block elements.',
    tagLessons: [
      {
        tag: 'max-width / margin: auto',
        purpose: 'Control width and center blocks.',
        example: '.card {\n  max-width: 320px;\n  margin-left: auto;\n  margin-right: auto;\n}',
      },
    ],
    objectives: [
      { id: 'card-maxw', label: 'Set .card { max-width: ... }' },
      { id: 'card-center', label: 'Center .card with margin auto (left/right or shorthand)' },
    ],
    hints: ['.card {\n  max-width: 320px;\n  margin: 1rem auto;\n}'],
    starterHtml: runwayHtml,
    starterCss: `body { background-color: #0b0612; color: #f2ebe0; text-align: center; }
.title { color: #5dff9f; font-size: 2.2rem; font-weight: 800; }
.card {
  padding: 1rem;
  border: 2px solid #5dff9f;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(93, 255, 159, 0.3);
}
`,
  }),
  q({
    id: 'css-b08',
    kind: 'quest',
    tier: 'beginner',
    chapter: 8,
    title: 'Flex Formation',
    hook: 'Tiles want a lineup — not a messy stack.',
    missionBrief: 'Turn .row into a flex row with gap.',
    realWorldWin: 'Nav bars, chip rows, card rows — Flexbox is daily driver layout.',
    story: ['By default, divs stack. Flex puts them on a fashion line.', 'display: flex + gap = instant formation.'],
    lessonSummary: '`display: flex` lines children in a row. `gap` spaces them.',
    tagLessons: [
      {
        tag: 'display: flex / gap',
        purpose: 'Horizontal (or vertical) layout with spacing.',
        example: '.row {\n  display: flex;\n  gap: 0.75rem;\n}',
      },
    ],
    objectives: [
      { id: 'row-flex', label: 'Set .row { display: flex }' },
      { id: 'row-gap', label: 'Set .row { gap: ... }' },
    ],
    hints: ['.row {\n  display: flex;\n  gap: 0.75rem;\n  justify-content: center;\n}'],
    starterHtml: runwayHtml,
    starterCss: `body { background-color: #0b0612; color: #f2ebe0; text-align: center; }
.title { color: #5dff9f; font-size: 2.2rem; font-weight: 800; }
.card {
  max-width: 320px;
  margin: 1rem auto;
  padding: 1rem;
  border: 2px solid #5dff9f;
  border-radius: 14px;
}
.tile { padding: 0.8rem 1rem; background: #1a3d2a; border-radius: 8px; }
`,
  }),
  q({
    id: 'css-b09',
    kind: 'quest',
    tier: 'beginner',
    chapter: 9,
    title: 'Center the Squad',
    hook: 'Flex can center like a boss.',
    missionBrief: 'Use justify-content and align-items to center the .row formation.',
    realWorldWin: 'Hero CTAs, icon rows, empty states — centered flex is everywhere.',
    story: ['Gap alone isn’t enough. Center the squad on the runway.', 'justify-content + align-items = spotlight.'],
    lessonSummary: '`justify-content` aligns on the main axis. `align-items` aligns on the cross axis.',
    tagLessons: [
      {
        tag: 'justify-content / align-items',
        purpose: 'Center or distribute flex children.',
        example: '.row {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
      },
    ],
    objectives: [
      { id: 'row-justify', label: 'Set .row { justify-content: center } (or space-*)' },
      { id: 'row-align', label: 'Set .row { align-items: center }' },
    ],
    hints: ['.row {\n  display: flex;\n  gap: 0.75rem;\n  justify-content: center;\n  align-items: center;\n}'],
    starterHtml: runwayHtml,
    starterCss: `body { background-color: #0b0612; color: #f2ebe0; text-align: center; }
.title { color: #5dff9f; font-size: 2.2rem; font-weight: 800; }
.row { display: flex; gap: 0.75rem; min-height: 64px; }
.tile { padding: 0.8rem 1rem; background: #1a3d2a; border-radius: 8px; }
`,
  }),
  q({
    id: 'css-b-boss',
    kind: 'boss',
    tier: 'beginner',
    chapter: 10,
    title: 'BOSS · Full Look Drop',
    hook: 'Combine wash, neon type, card polish, and flex — one complete vibe.',
    missionBrief:
      'Ship a full look: body background, .title color, .card padding+radius, and .row as flex with gap.',
    realWorldWin: 'This is a mini landing-page style kit — same combo used on real product sites.',
    story: [
      'Boss fight isn’t punches — it’s taste.',
      'If the runway looks intentional, you win the drip.',
    ],
    lessonSummary: 'Boss check: combine background, text color, card polish, and flex layout.',
    tagLessons: [
      {
        tag: 'combo look',
        purpose: 'Multiple selectors working together.',
        example: 'body { background-color: #0b0612; }\n.title { color: #5dff9f; }\n.card { padding: 1rem; border-radius: 12px; }\n.row { display: flex; gap: 0.75rem; }',
      },
    ],
    objectives: [
      { id: 'body-bg', label: 'body background-color' },
      { id: 'title-color', label: '.title color' },
      { id: 'card-pad', label: '.card padding' },
      { id: 'card-radius', label: '.card border-radius' },
      { id: 'row-flex', label: '.row display: flex' },
      { id: 'row-gap', label: '.row gap' },
    ],
    hints: ['Reuse earlier chapters — stack the winning rules into one stylesheet.'],
    starterHtml: runwayHtml,
    starterCss: `/* BOSS LOOK — assemble the full drip */\n`,
    xp: 160,
    badgeId: 'badge-css-beginner',
    winQuips: ['STYLE FATALITY. Beginner runway cleared — Intermediate unlocks.'],
  }),
]

export const CSS_INTERMEDIATE: QuestDef[] = [
  q({
    id: 'css-i01',
    kind: 'tutorial',
    tier: 'intermediate',
    chapter: 11,
    title: 'Grid Catwalk',
    hook: 'Flex is a line. Grid is a stage map.',
    missionBrief: 'Make .row a CSS Grid with display: grid.',
    realWorldWin: 'Dashboards, galleries, pricing tables — Grid owns 2D layouts.',
    story: ['Flex lined the tiles. Grid places them on a map.', 'Flip .row to display: grid.'],
    lessonSummary: '`display: grid` creates a two-dimensional layout context.',
    tagLessons: [
      {
        tag: 'display: grid',
        purpose: 'Turns a container into a grid formatting context.',
        example: '.row {\n  display: grid;\n}',
      },
    ],
    objectives: [{ id: 'row-grid', label: 'Set .row { display: grid }' }],
    hints: ['.row {\n  display: grid;\n  gap: 0.75rem;\n}'],
    starterHtml: runwayHtml,
    starterCss: `body { background-color: #0b0612; color: #f2ebe0; text-align: center; }
.title { color: #5dff9f; font-size: 2.2rem; font-weight: 800; }
.tile { padding: 1rem; background: #1a3d2a; border-radius: 8px; }
`,
  }),
  q({
    id: 'css-i02',
    kind: 'quest',
    tier: 'intermediate',
    chapter: 12,
    title: 'Three-Lane Grid',
    hook: 'Columns make the gallery.',
    missionBrief: 'Set grid-template-columns so .row has three lanes.',
    realWorldWin: 'Product grids, feature rows, image galleries.',
    story: ['One column is a list. Three columns is a show.', 'Use repeat(3, 1fr) or three tracks.'],
    lessonSummary: '`grid-template-columns` defines vertical tracks (lanes).',
    tagLessons: [
      {
        tag: 'grid-template-columns',
        purpose: 'Defines how many columns and their sizes.',
        example: '.row {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 0.75rem;\n}',
      },
    ],
    objectives: [{ id: 'row-cols', label: 'Set .row { grid-template-columns: ... } with 3 tracks' }],
    hints: ['.row {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 0.75rem;\n}'],
    starterHtml: runwayHtml,
    starterCss: `body { background-color: #0b0612; color: #f2ebe0; text-align: center; }
.row { display: grid; gap: 0.75rem; }
.tile { padding: 1rem; background: #1a3d2a; border-radius: 8px; }
`,
  }),
  q({
    id: 'css-i03',
    kind: 'quest',
    tier: 'intermediate',
    chapter: 13,
    title: 'Hover Heat',
    hook: 'Interaction is part of the look.',
    missionBrief: 'Add a :hover rule that changes .tile background or color.',
    realWorldWin: 'Buttons, cards, nav links — hover feedback feels alive.',
    story: ['Static looks sleep. Hover wakes them.', 'Write .tile:hover { ... }.'],
    lessonSummary: '`:hover` applies styles while the pointer is over an element.',
    tagLessons: [
      {
        tag: ':hover',
        purpose: 'Style an element on pointer hover.',
        example: '.tile:hover {\n  background: #5dff9f;\n  color: #06140c;\n}',
      },
    ],
    objectives: [{ id: 'tile-hover', label: 'Add .tile:hover { ... } with a visible change' }],
    hints: ['.tile:hover {\n  background: #5dff9f;\n  color: #06140c;\n}'],
    starterHtml: runwayHtml,
    starterCss: `body { background-color: #0b0612; color: #f2ebe0; text-align: center; }
.row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
.tile { padding: 1rem; background: #1a3d2a; border-radius: 8px; }
`,
  }),
  q({
    id: 'css-i04',
    kind: 'quest',
    tier: 'intermediate',
    chapter: 14,
    title: 'Smooth Glide',
    hook: 'Snappy jumps feel cheap. Transitions feel premium.',
    missionBrief: 'Add transition on .tile so hover changes glide.',
    realWorldWin: 'Polished UI micro-interactions on buttons and cards.',
    story: ['Without transition, hover snaps. With it, the look breathes.', 'transition: background 0.2s ease;'],
    lessonSummary: '`transition` animates property changes over time.',
    tagLessons: [
      {
        tag: 'transition',
        purpose: 'Smooths property changes.',
        example: '.tile {\n  transition: background 0.25s ease, color 0.25s ease;\n}',
      },
    ],
    objectives: [{ id: 'tile-transition', label: 'Set .tile { transition: ... }' }],
    hints: ['.tile {\n  transition: background 0.25s ease, transform 0.25s ease;\n}'],
    starterHtml: runwayHtml,
    starterCss: `body { background-color: #0b0612; color: #f2ebe0; text-align: center; }
.row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
.tile { padding: 1rem; background: #1a3d2a; border-radius: 8px; }
.tile:hover { background: #5dff9f; color: #06140c; }
`,
  }),
  q({
    id: 'css-i05',
    kind: 'quest',
    tier: 'intermediate',
    chapter: 15,
    title: 'Gradient Sky',
    hook: 'Flat color is fine. Gradients are drama.',
    missionBrief: 'Give body a linear-gradient background.',
    realWorldWin: 'Hero banners, app backgrounds, brand moments.',
    story: ['One color washes. Two colors paint a sky.', 'background: linear-gradient(...);'],
    lessonSummary: '`linear-gradient` blends colors along a line for backgrounds.',
    tagLessons: [
      {
        tag: 'linear-gradient',
        purpose: 'Blended color backgrounds.',
        example: 'body {\n  background: linear-gradient(160deg, #0b0612, #123524);\n}',
      },
    ],
    objectives: [{ id: 'body-gradient', label: 'Set body background with linear-gradient(...)' }],
    hints: ['body {\n  background: linear-gradient(160deg, #0b0612, #123524);\n}'],
    starterHtml: runwayHtml,
    starterCss: `body { color: #f2ebe0; text-align: center; }
.title { color: #5dff9f; font-size: 2.2rem; font-weight: 800; }
`,
  }),
  q({
    id: 'css-i-boss',
    kind: 'boss',
    tier: 'intermediate',
    chapter: 16,
    title: 'BOSS · Runway Finale',
    hook: 'Grid lanes + hover heat + gradient sky — finale drip.',
    missionBrief: 'Combine body gradient, .row grid with 3 columns, and .tile:hover.',
    realWorldWin: 'Interactive gallery sections on modern marketing sites.',
    story: ['Finale isn’t louder combat — it’s a cleaner system.', 'Gradient. Grid. Hover. Lock the look.'],
    lessonSummary: 'Intermediate boss: gradient background + 3-col grid + hover state.',
    tagLessons: [
      {
        tag: 'finale combo',
        purpose: 'Gradient + grid + hover together.',
        example: 'body { background: linear-gradient(...); }\n.row { display: grid; grid-template-columns: repeat(3, 1fr); }\n.tile:hover { background: #5dff9f; }',
      },
    ],
    objectives: [
      { id: 'body-gradient', label: 'body linear-gradient background' },
      { id: 'row-grid', label: '.row display: grid' },
      { id: 'row-cols', label: '.row 3-column template' },
      { id: 'tile-hover', label: '.tile:hover style' },
    ],
    hints: ['Stack gradient + grid-template-columns: repeat(3, 1fr) + .tile:hover'],
    starterHtml: runwayHtml,
    starterCss: `/* FINALE — assemble intermediate drip */\n`,
    xp: 200,
    badgeId: 'badge-css-forest',
    winQuips: ['RUNWAY FINALE. CSS Forest Intermediate cleared.'],
  }),
]

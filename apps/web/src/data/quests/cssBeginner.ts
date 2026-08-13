import type { QuestDef } from './types'

type Draft = Omit<QuestDef, 'worldId' | 'speaker' | 'xp' | 'winQuips' | 'failQuips'> & {
  winQuips?: string[]
  failQuips?: string[]
  xp?: number
}

function q(draft: Draft): QuestDef {
  return {
    worldId: 'css-forest',
    speaker: 'Luxe',
    xp: draft.xp ?? (draft.tier === 'expert' ? 95 : draft.tier === 'intermediate' ? 75 : 55),
    winQuips: draft.winQuips ?? ['POSTED. That glow is immaculate.'],
    failQuips: draft.failQuips ?? ['Not quite aesthetic — tweak your HTML or CSS.'],
    ...draft,
  }
}

const rawDump = `<!-- RAW DUMP — fix in HTML + CSS -->
<p>untitled page</p>`

const studioShell = `<div class="studio">
  <h1 class="title">GLOW UP</h1>
</div>`

const withTag = `<div class="studio">
  <h1 class="title">GLOW UP</h1>
  <p class="tag">aesthetic lab</p>
</div>`

const withCard = `<div class="studio">
  <h1 class="title">GLOW UP</h1>
  <p class="tag">aesthetic lab</p>
  <div class="card">
    <span class="badge">NEW</span>
    <p class="bio">Your profile card lives here.</p>
  </div>
</div>`

const fullLayout = `<div class="studio">
  <h1 class="title">GLOW UP</h1>
  <p class="tag">aesthetic lab</p>
  <div class="card">
    <span class="badge">NEW</span>
    <p class="bio">Profile card — polish me.</p>
  </div>
  <div class="row">
    <div class="tile">01</div>
    <div class="tile">02</div>
    <div class="tile">03</div>
  </div>
</div>`

const heroStage = `<div class="studio">
  <header class="hero">
    <h1 class="title">NEON DROP</h1>
    <p class="tag">motion · layout · vibe</p>
    <button class="cta" type="button">Enter</button>
  </header>
  <div class="row">
    <div class="tile">A</div>
    <div class="tile">B</div>
    <div class="tile">C</div>
  </div>
</div>`

const galleryStage = `<div class="studio">
  <h1 class="title">GALLERY</h1>
  <div class="row">
    <article class="tile"><h2>One</h2><p>card</p></article>
    <article class="tile"><h2>Two</h2><p>card</p></article>
    <article class="tile"><h2>Three</h2><p>card</p></article>
    <article class="tile"><h2>Four</h2><p>card</p></article>
  </div>
</div>`

/** GLOW UP STUDIO — Beginner: structure + core visual CSS */
export const CSS_BEGINNER: QuestDef[] = [
  q({
    id: 'css-b01',
    kind: 'tutorial',
    tier: 'beginner',
    chapter: 1,
    title: 'Rescue the Dump',
    hook: 'Raw pages are embarrassing. Structure first, then color.',
    missionBrief:
      'Wrap everything in <div class="studio">, add <h1 class="title">, and paint the page with body { background-color }.',
    realWorldWin: 'Every site starts as messy markup — scaffold in HTML, brand with CSS.',
    story: ['HTML Village built the bones. Now we beautify.', 'Fix the dump: structure in HTML, mood in CSS.'],
    lessonSummary: 'HTML for structure. CSS on `body` for the canvas color.',
    tagLessons: [
      {
        tag: '<div class="studio">',
        purpose: 'Root wrapper for your page block.',
        example: '<div class="studio">\n  <h1 class="title">My Page</h1>\n</div>',
      },
      {
        tag: 'body { background-color }',
        purpose: 'Full-page backdrop color.',
        example: 'body {\n  background-color: #0f0a12;\n}',
      },
    ],
    objectives: [
      { id: 'html-studio', label: 'Wrap content in <div class="studio">' },
      { id: 'html-title', label: 'Add <h1 class="title"> with text' },
      { id: 'body-bg', label: 'Set body { background-color: ... }' },
    ],
    hints: [
      '<div class="studio">\n  <h1 class="title">GLOW UP</h1>\n</div>\n\nbody {\n  background-color: #0f0a12;\n}',
    ],
    starterHtml: rawDump,
    starterCss: `/* Paint the canvas */\n`,
  }),
  q({
    id: 'css-b02',
    kind: 'tutorial',
    tier: 'beginner',
    chapter: 2,
    title: 'Caption Line',
    hook: 'Headlines need a subtitle — HTML. Color is CSS.',
    missionBrief: 'Add <p class="tag"> under the title, then style .title { color: ... }.',
    realWorldWin: 'Hero sections pair headline + subline in HTML, hierarchy in CSS.',
    story: ['One line is a poster. Two lines is a brand.'],
    lessonSummary: 'Add elements in HTML. Target classes in CSS with `.title { color }`.',
    tagLessons: [
      { tag: '<p class="tag">', purpose: 'Subtitle under the heading.', example: '<p class="tag">aesthetic lab</p>' },
      { tag: '.title { color }', purpose: 'Text color for that class.', example: '.title {\n  color: #f4a4bc;\n}' },
    ],
    objectives: [
      { id: 'html-tag', label: 'Add <p class="tag"> with text' },
      { id: 'title-color', label: 'Set .title { color: ... }' },
    ],
    hints: ['<p class="tag">aesthetic lab</p>\n\n.title {\n  color: #f4a4bc;\n}'],
    starterHtml: studioShell,
    starterCss: `body {\n  background-color: #0f0a12;\n  color: #faf6f2;\n}\n`,
  }),
  q({
    id: 'css-b03',
    kind: 'quest',
    tier: 'beginner',
    chapter: 3,
    title: 'Type Mood',
    hook: 'Typography = personality.',
    missionBrief: 'Give .title a bigger font-size and bold font-weight.',
    realWorldWin: 'Size + weight create visual hierarchy on every marketing page.',
    story: ['Statement type owns the feed.'],
    lessonSummary: '`font-size` scales text. `font-weight` controls boldness.',
    tagLessons: [
      {
        tag: 'font-size / font-weight',
        purpose: 'Scale and weight of text.',
        example: '.title {\n  font-size: 2.4rem;\n  font-weight: 800;\n}',
      },
    ],
    objectives: [
      { id: 'title-size', label: 'Set .title { font-size: ... }' },
      { id: 'title-weight', label: 'Set .title { font-weight: ... }' },
    ],
    hints: ['.title {\n  font-size: 2.4rem;\n  font-weight: 800;\n}'],
    starterHtml: withTag,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; }\n.title { color: #f4a4bc; }\n`,
  }),
  q({
    id: 'css-b04',
    kind: 'quest',
    tier: 'beginner',
    chapter: 4,
    title: 'Center the Vibe',
    hook: 'Alignment sells polish.',
    missionBrief: 'Center .studio with text-align and add letter-spacing to .tag.',
    realWorldWin: 'Heroes, captions, empty states — alignment = class.',
    story: ['Centered feels intentional.'],
    lessonSummary: '`text-align` lines up text. `letter-spacing` opens letters.',
    tagLessons: [
      {
        tag: 'text-align / letter-spacing',
        purpose: 'Align text and space characters.',
        example: '.studio { text-align: center; }\n.tag { letter-spacing: 0.2em; }',
      },
    ],
    objectives: [
      { id: 'align-center', label: 'Set .studio { text-align: center }' },
      { id: 'tracking', label: 'Set .tag { letter-spacing: ... }' },
    ],
    hints: ['.studio { text-align: center; }\n.tag { letter-spacing: 0.18em; }'],
    starterHtml: withTag,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; }\n.title { color: #f4a4bc; font-size: 2.2rem; font-weight: 800; }\n`,
  }),
  q({
    id: 'css-b05',
    kind: 'quest',
    tier: 'beginner',
    chapter: 5,
    title: 'Profile Card',
    hook: 'Cards need HTML structure AND CSS polish.',
    missionBrief: 'Add <div class="card"> with content, then padding, border, and border-radius.',
    realWorldWin: 'Product cards, profiles, pricing tiles.',
    story: ['Structure in HTML. Polish in CSS.'],
    lessonSummary: 'Build the card in HTML. Polish with padding, border, border-radius.',
    tagLessons: [
      {
        tag: '<div class="card">',
        purpose: 'Contained block for grouped content.',
        example: '<div class="card">\n  <p class="bio">About me</p>\n</div>',
      },
      {
        tag: 'padding / border / border-radius',
        purpose: 'Inner space, edge, soft corners.',
        example: '.card {\n  padding: 1rem;\n  border: 2px solid #f4a4bc;\n  border-radius: 14px;\n}',
      },
    ],
    objectives: [
      { id: 'html-card', label: 'Add <div class="card"> with content' },
      { id: 'card-pad', label: 'Set .card { padding: ... }' },
      { id: 'card-border', label: 'Set .card { border: ... }' },
      { id: 'card-radius', label: 'Set .card { border-radius: ... }' },
    ],
    hints: [
      '<div class="card">\n  <p class="bio">Your bio</p>\n</div>\n\n.card {\n  padding: 1rem;\n  border: 2px solid #f4a4bc;\n  border-radius: 14px;\n}',
    ],
    starterHtml: withTag,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.title { color: #f4a4bc; font-size: 2.2rem; font-weight: 800; }\n.tag { letter-spacing: 0.16em; }\n`,
  }),
  q({
    id: 'css-b06',
    kind: 'quest',
    tier: 'beginner',
    chapter: 6,
    title: 'Soft Shadow',
    hook: 'Depth makes flat design feel premium.',
    missionBrief: 'Add box-shadow to .card.',
    realWorldWin: 'Elevated cards, modals, buttons.',
    story: ['Floating looks expensive.'],
    lessonSummary: '`box-shadow` paints soft depth.',
    tagLessons: [
      {
        tag: 'box-shadow',
        purpose: 'Depth/glow around a box.',
        example: '.card {\n  box-shadow: 0 12px 40px rgba(244, 164, 188, 0.35);\n}',
      },
    ],
    objectives: [{ id: 'card-shadow', label: 'Set .card { box-shadow: ... }' }],
    hints: ['.card {\n  box-shadow: 0 12px 40px rgba(244, 164, 188, 0.35);\n}'],
    starterHtml: withCard,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.title { color: #f4a4bc; font-size: 2.2rem; font-weight: 800; }\n.card {\n  padding: 1rem;\n  border: 2px solid #f4a4bc;\n  border-radius: 14px;\n}\n`,
  }),
  q({
    id: 'css-b07',
    kind: 'quest',
    tier: 'beginner',
    chapter: 7,
    title: 'Width Control',
    hook: 'Full-width text on desktop looks messy.',
    missionBrief: 'Give .card a max-width and center it with margin: auto.',
    realWorldWin: 'Readable content columns on blogs and docs.',
    story: ['Cap the width. Auto-margins center.'],
    lessonSummary: '`max-width` caps size. `margin: auto` centers blocks.',
    tagLessons: [
      {
        tag: 'max-width / margin: auto',
        purpose: 'Control width and center blocks.',
        example: '.card {\n  max-width: 320px;\n  margin: 1rem auto;\n}',
      },
    ],
    objectives: [
      { id: 'card-maxw', label: 'Set .card { max-width: ... }' },
      { id: 'card-center', label: 'Center .card with margin auto' },
    ],
    hints: ['.card {\n  max-width: 320px;\n  margin: 1rem auto;\n}'],
    starterHtml: withCard,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.title { color: #f4a4bc; font-size: 2.2rem; font-weight: 800; }\n.card {\n  padding: 1rem;\n  border: 2px solid #f4a4bc;\n  border-radius: 14px;\n  box-shadow: 0 12px 40px rgba(244, 164, 188, 0.3);\n}\n`,
  }),
  q({
    id: 'css-b08',
    kind: 'quest',
    tier: 'beginner',
    chapter: 8,
    title: 'Flex Lineup',
    hook: 'Layouts need HTML siblings + CSS flex.',
    missionBrief: 'Add <div class="row"> with three tiles, then display: flex and gap.',
    realWorldWin: 'Nav bars, chip rows, card rows — Flexbox daily.',
    story: ['Three tiles in HTML. Flex lines them up.'],
    lessonSummary: 'Sibling elements in HTML. `display: flex` + `gap` in CSS.',
    tagLessons: [
      {
        tag: '<div class="row"> + .tile',
        purpose: 'HTML creates items; CSS arranges them.',
        example: '<div class="row">\n  <div class="tile">A</div>\n  <div class="tile">B</div>\n</div>',
      },
      {
        tag: 'display: flex / gap',
        purpose: 'Horizontal layout with spacing.',
        example: '.row {\n  display: flex;\n  gap: 0.75rem;\n}',
      },
    ],
    objectives: [
      { id: 'html-row', label: 'Add <div class="row"> with 3+ tiles' },
      { id: 'row-flex', label: 'Set .row { display: flex }' },
      { id: 'row-gap', label: 'Set .row { gap: ... }' },
    ],
    hints: [
      '<div class="row">\n  <div class="tile">01</div>\n  <div class="tile">02</div>\n  <div class="tile">03</div>\n</div>\n\n.row {\n  display: flex;\n  gap: 0.75rem;\n}',
    ],
    starterHtml: withCard,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.title { color: #f4a4bc; font-size: 2.2rem; font-weight: 800; }\n.card {\n  max-width: 320px;\n  margin: 1rem auto;\n  padding: 1rem;\n  border: 2px solid #f4a4bc;\n  border-radius: 14px;\n}\n`,
  }),
  q({
    id: 'css-b09',
    kind: 'quest',
    tier: 'beginner',
    chapter: 9,
    title: 'Center the Squad',
    hook: 'Flex can center like a boss.',
    missionBrief: 'Use justify-content and align-items to center .row.',
    realWorldWin: 'Hero CTAs, icon rows, empty states.',
    story: ['justify-content + align-items = spotlight.'],
    lessonSummary: '`justify-content` main axis. `align-items` cross axis.',
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
    starterHtml: fullLayout,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.title { color: #f4a4bc; font-size: 2.2rem; font-weight: 800; }\n.row { display: flex; gap: 0.75rem; min-height: 64px; }\n.tile { padding: 0.8rem 1rem; background: #2a1528; border-radius: 8px; }\n`,
  }),
  q({
    id: 'css-b10',
    kind: 'quest',
    tier: 'beginner',
    chapter: 10,
    title: 'Box Model Brain',
    hook: 'Margin is outside. Padding is inside. Know both.',
    missionBrief: 'Add margin on .card and padding on .tile. Set box-sizing: border-box on * or body.',
    realWorldWin: 'Every layout bug traces back to the box model.',
    story: ['Pros always set box-sizing: border-box.'],
    lessonSummary: '`margin` outer space. `padding` inner. `box-sizing: border-box` includes border in width.',
    tagLessons: [
      {
        tag: 'margin / padding / box-sizing',
        purpose: 'Outer space, inner space, predictable widths.',
        example: '* { box-sizing: border-box; }\n.card { margin: 1.5rem auto; }\n.tile { padding: 1rem; }',
      },
    ],
    objectives: [
      { id: 'box-sizing', label: 'Set box-sizing: border-box (on * or body)' },
      { id: 'card-margin', label: 'Set .card { margin: ... }' },
      { id: 'tile-pad', label: 'Set .tile { padding: ... }' },
    ],
    hints: ['* { box-sizing: border-box; }\n.card { margin: 1.5rem auto; }\n.tile { padding: 1rem; }'],
    starterHtml: fullLayout,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.title { color: #f4a4bc; font-size: 2.2rem; font-weight: 800; }\n.row { display: flex; gap: 0.75rem; justify-content: center; }\n.card { max-width: 320px; border: 2px solid #f4a4bc; border-radius: 14px; }\n.tile { background: #2a1528; border-radius: 8px; }\n`,
  }),
  q({
    id: 'css-b11',
    kind: 'quest',
    tier: 'beginner',
    chapter: 11,
    title: 'Display Modes',
    hook: 'block stacks. inline sits. none hides.',
    missionBrief: 'Set .badge to display: inline-block and hide .bio with display: none (then restore if you want — checks need both rules present).',
    realWorldWin: 'Badges, chips, show/hide UI — display is everywhere.',
    story: ['Display controls how elements participate in layout.'],
    lessonSummary: '`inline-block` sizes like a box but sits in a line. `none` removes from layout.',
    tagLessons: [
      {
        tag: 'display: inline-block / none',
        purpose: 'Inline-sized boxes and hide elements.',
        example: '.badge { display: inline-block; }\n.bio { display: none; }',
      },
    ],
    objectives: [
      { id: 'badge-inline', label: 'Set .badge { display: inline-block }' },
      { id: 'bio-none', label: 'Set .bio { display: none }' },
    ],
    hints: ['.badge { display: inline-block; padding: 0.2rem 0.5rem; }\n.bio { display: none; }'],
    starterHtml: fullLayout,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.title { color: #f4a4bc; font-size: 2.2rem; font-weight: 800; }\n.card { max-width: 320px; margin: 1rem auto; padding: 1rem; border: 2px solid #f4a4bc; border-radius: 14px; }\n.badge { background: #f4a4bc; color: #1a0a10; border-radius: 999px; }\n`,
  }),
  q({
    id: 'css-b-boss',
    kind: 'boss',
    tier: 'beginner',
    chapter: 12,
    title: 'BOSS · Full Glow Up',
    hook: 'Ship a complete profile page — HTML + CSS.',
    missionBrief:
      'Build .studio, .title, .card, .row with tiles; body background, title color, card polish, flex row.',
    realWorldWin: 'Mini profile-page kit used on real product sites.',
    story: ['Structure in HTML. Aesthetic in CSS. Post the glow.'],
    lessonSummary: 'Boss: HTML scaffold + core visual + flex.',
    tagLessons: [
      {
        tag: 'full glow-up',
        purpose: 'HTML + CSS together.',
        example:
          '<div class="studio">...</div>\nbody { background-color: #0f0a12; }\n.title { color: #f4a4bc; }\n.row { display: flex; gap: 0.75rem; }',
      },
    ],
    objectives: [
      { id: 'html-studio', label: '<div class="studio"> wrapper' },
      { id: 'html-title', label: '<h1 class="title">' },
      { id: 'html-card', label: '<div class="card">' },
      { id: 'html-row', label: '<div class="row"> with tiles' },
      { id: 'body-bg', label: 'body background-color' },
      { id: 'title-color', label: '.title color' },
      { id: 'card-pad', label: '.card padding' },
      { id: 'row-flex', label: '.row display: flex' },
    ],
    hints: ['Combine every chapter — HTML scaffold + CSS polish.'],
    starterHtml: `<!-- BOSS — build the full profile from scratch -->\n<p>your glow up starts here</p>`,
    starterCss: `/* BOSS GLOW */\n`,
    xp: 160,
    badgeId: 'badge-css-beginner',
    winQuips: ['GLOW UP POSTED. Beginner cleared — Intermediate unlocks.'],
  }),
]

/** Intermediate: Grid, hover, transitions, transforms, position, pseudos */
export const CSS_INTERMEDIATE: QuestDef[] = [
  q({
    id: 'css-i01',
    kind: 'tutorial',
    tier: 'intermediate',
    chapter: 13,
    title: 'Grid Gallery',
    hook: 'Flex is a line. Grid is a mood board.',
    missionBrief: 'Make .row a CSS Grid with display: grid.',
    realWorldWin: 'Dashboards, galleries, pricing tables.',
    story: ['Grid places items on a 2D map.'],
    lessonSummary: '`display: grid` creates a two-dimensional layout.',
    tagLessons: [
      { tag: 'display: grid', purpose: 'Grid formatting context.', example: '.row {\n  display: grid;\n}' },
    ],
    objectives: [{ id: 'row-grid', label: 'Set .row { display: grid }' }],
    hints: ['.row {\n  display: grid;\n  gap: 0.75rem;\n}'],
    starterHtml: fullLayout,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.title { color: #f4a4bc; font-size: 2.2rem; font-weight: 800; }\n.tile { padding: 1rem; background: #2a1528; border-radius: 8px; }\n`,
  }),
  q({
    id: 'css-i02',
    kind: 'quest',
    tier: 'intermediate',
    chapter: 14,
    title: 'Three-Lane Grid',
    hook: 'Columns make the gallery.',
    missionBrief: 'Set grid-template-columns with 3 tracks on .row.',
    realWorldWin: 'Product grids, feature rows.',
    story: ['Use repeat(3, 1fr) or three tracks.'],
    lessonSummary: '`grid-template-columns` defines lanes.',
    tagLessons: [
      {
        tag: 'grid-template-columns',
        purpose: 'Column tracks and sizes.',
        example: '.row {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}',
      },
    ],
    objectives: [{ id: 'row-cols', label: 'Set .row { grid-template-columns: ... } with 3 tracks' }],
    hints: ['.row {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 0.75rem;\n}'],
    starterHtml: fullLayout,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.row { display: grid; gap: 0.75rem; }\n.tile { padding: 1rem; background: #2a1528; border-radius: 8px; }\n`,
  }),
  q({
    id: 'css-i03',
    kind: 'quest',
    tier: 'intermediate',
    chapter: 15,
    title: 'Hover Heat',
    hook: 'Interaction is part of the aesthetic.',
    missionBrief: 'Add .tile:hover that changes background or color.',
    realWorldWin: 'Buttons, cards, nav links.',
    story: ['Static looks sleep. Hover wakes them.'],
    lessonSummary: '`:hover` styles on pointer over.',
    tagLessons: [
      {
        tag: ':hover',
        purpose: 'Pointer hover styles.',
        example: '.tile:hover {\n  background: #f4a4bc;\n  color: #1a0a10;\n}',
      },
    ],
    objectives: [{ id: 'tile-hover', label: 'Add .tile:hover { ... } with a visible change' }],
    hints: ['.tile:hover {\n  background: #f4a4bc;\n  color: #1a0a10;\n}'],
    starterHtml: fullLayout,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }\n.tile { padding: 1rem; background: #2a1528; border-radius: 8px; }\n`,
  }),
  q({
    id: 'css-i04',
    kind: 'quest',
    tier: 'intermediate',
    chapter: 16,
    title: 'Smooth Transition',
    hook: 'Snappy jumps feel cheap. Transitions feel premium.',
    missionBrief: 'Add transition on .tile so hover changes glide.',
    realWorldWin: 'Polished UI micro-interactions.',
    story: ['transition: background 0.25s ease;'],
    lessonSummary: '`transition` animates property changes over time.',
    tagLessons: [
      {
        tag: 'transition',
        purpose: 'Smooth property changes.',
        example: '.tile {\n  transition: background 0.25s ease, transform 0.25s ease;\n}',
      },
    ],
    objectives: [{ id: 'tile-transition', label: 'Set .tile { transition: ... }' }],
    hints: ['.tile {\n  transition: background 0.25s ease, transform 0.25s ease;\n}'],
    starterHtml: fullLayout,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }\n.tile { padding: 1rem; background: #2a1528; border-radius: 8px; }\n.tile:hover { background: #f4a4bc; color: #1a0a10; }\n`,
  }),
  q({
    id: 'css-i05',
    kind: 'quest',
    tier: 'intermediate',
    chapter: 17,
    title: 'Transform Lift',
    hook: 'Scale and translate = modern card hover.',
    missionBrief: 'On .tile:hover use transform with scale or translate.',
    realWorldWin: 'Card lifts, button presses, icon pops.',
    story: ['transform never messes layout flow the way margin does.'],
    lessonSummary: '`transform: scale()` / `translate()` moves visually without reflow.',
    tagLessons: [
      {
        tag: 'transform: scale / translate',
        purpose: 'Visual lift without layout shift.',
        example: '.tile:hover {\n  transform: translateY(-6px) scale(1.03);\n}',
      },
    ],
    objectives: [{ id: 'tile-transform', label: 'Use transform (scale or translate) on .tile:hover' }],
    hints: ['.tile:hover {\n  transform: translateY(-6px) scale(1.04);\n}'],
    starterHtml: fullLayout,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }\n.tile {\n  padding: 1rem;\n  background: #2a1528;\n  border-radius: 8px;\n  transition: transform 0.25s ease, background 0.25s ease;\n}\n.tile:hover { background: #3a2038; }\n`,
  }),
  q({
    id: 'css-i06',
    kind: 'quest',
    tier: 'intermediate',
    chapter: 18,
    title: 'Gradient Sky',
    hook: 'Flat color is fine. Gradients are drama.',
    missionBrief: 'Give body a linear-gradient background.',
    realWorldWin: 'Hero banners, app backgrounds, brand moments.',
    story: ['Two colors paint a sky.'],
    lessonSummary: '`linear-gradient` blends colors for backgrounds.',
    tagLessons: [
      {
        tag: 'linear-gradient',
        purpose: 'Blended color backgrounds.',
        example: 'body {\n  background: linear-gradient(160deg, #0f0a12, #2a1528);\n}',
      },
    ],
    objectives: [{ id: 'body-gradient', label: 'Set body background with linear-gradient(...)' }],
    hints: ['body {\n  background: linear-gradient(160deg, #0f0a12, #2a1528);\n}'],
    starterHtml: fullLayout,
    starterCss: `body { color: #faf6f2; text-align: center; }\n.title { color: #f4a4bc; font-size: 2.2rem; font-weight: 800; }\n`,
  }),
  q({
    id: 'css-i07',
    kind: 'quest',
    tier: 'intermediate',
    chapter: 19,
    title: 'Absolute Badge',
    hook: 'Stick a badge on the card corner.',
    missionBrief: 'Make .card position: relative and .badge position: absolute with top/right.',
    realWorldWin: 'Sale tags, avatar status dots, floating labels.',
    story: ['Relative parent. Absolute child. Instant sticker.'],
    lessonSummary: '`position: relative` anchors. `absolute` places against that parent.',
    tagLessons: [
      {
        tag: 'position: relative / absolute',
        purpose: 'Overlay badges and floating UI.',
        example: '.card { position: relative; }\n.badge { position: absolute; top: 8px; right: 8px; }',
      },
    ],
    objectives: [
      { id: 'card-rel', label: 'Set .card { position: relative }' },
      { id: 'badge-abs', label: 'Set .badge { position: absolute }' },
      { id: 'badge-place', label: 'Set top and/or right (or left) on .badge' },
    ],
    hints: ['.card { position: relative; }\n.badge { position: absolute; top: 8px; right: 8px; }'],
    starterHtml: withCard,
    starterCss: `body { background: linear-gradient(160deg, #0f0a12, #2a1528); color: #faf6f2; text-align: center; }\n.card {\n  max-width: 320px;\n  margin: 2rem auto;\n  padding: 1.5rem;\n  border: 2px solid #f4a4bc;\n  border-radius: 14px;\n}\n.badge { background: #f4a4bc; color: #1a0a10; padding: 0.2rem 0.5rem; border-radius: 999px; }\n`,
  }),
  q({
    id: 'css-i08',
    kind: 'quest',
    tier: 'intermediate',
    chapter: 20,
    title: 'Sticky Header Energy',
    hook: 'Headers that stick while you scroll feel pro.',
    missionBrief: 'Make .hero position: sticky with top: 0 and a z-index.',
    realWorldWin: 'Nav bars, toolbars, floating CTAs.',
    story: ['sticky = relative until scroll threshold, then fixed.'],
    lessonSummary: '`position: sticky` + `top` + `z-index` keeps UI on screen.',
    tagLessons: [
      {
        tag: 'position: sticky / z-index',
        purpose: 'Stick UI while scrolling; layer order.',
        example: '.hero {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n}',
      },
    ],
    objectives: [
      { id: 'hero-sticky', label: 'Set .hero { position: sticky }' },
      { id: 'hero-top', label: 'Set .hero { top: ... }' },
      { id: 'hero-z', label: 'Set .hero { z-index: ... }' },
    ],
    hints: ['.hero {\n  position: sticky;\n  top: 0;\n  z-index: 10;\n  background: #0f0a12;\n}'],
    starterHtml: heroStage,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; margin: 0; min-height: 140vh; }\n.studio { padding: 1rem; }\n.hero { padding: 1rem; border-bottom: 1px solid #f4a4bc; }\n.title { color: #f4a4bc; }\n.row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-top: 2rem; }\n.tile { padding: 2rem 1rem; background: #2a1528; border-radius: 8px; }\n`,
  }),
  q({
    id: 'css-i09',
    kind: 'quest',
    tier: 'intermediate',
    chapter: 21,
    title: 'Before / After Glow',
    hook: 'Pseudo-elements add flair without extra HTML.',
    missionBrief: 'Style .title::before or .title::after with content and color.',
    realWorldWin: 'Decorative lines, icons, quote marks — zero extra tags.',
    story: ['::before and ::after are free design layers.'],
    lessonSummary: '`::before` / `::after` need `content` to appear.',
    tagLessons: [
      {
        tag: '::before / ::after',
        purpose: 'Generated decorative content.',
        example: '.title::after {\n  content: " ✦";\n  color: #e8c4a0;\n}',
      },
    ],
    objectives: [
      { id: 'pseudo', label: 'Add .title::before or .title::after with content: ...' },
    ],
    hints: ['.title::after {\n  content: " ✦";\n  color: #e8c4a0;\n}'],
    starterHtml: withTag,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.title { color: #f4a4bc; font-size: 2.2rem; font-weight: 800; }\n`,
  }),
  q({
    id: 'css-i10',
    kind: 'quest',
    tier: 'intermediate',
    chapter: 22,
    title: 'Focus + Nth Child',
    hook: 'Keyboard focus and patterned lists = accessible polish.',
    missionBrief: 'Style .cta:focus with an outline, and .tile:nth-child(odd) with a different background.',
    realWorldWin: 'Accessible forms + zebra lists + marketing grids.',
    story: ['Focus is for keyboards. nth-child paints patterns.'],
    lessonSummary: '`:focus` for keyboard. `:nth-child()` for patterns.',
    tagLessons: [
      {
        tag: ':focus / :nth-child',
        purpose: 'Focus rings and patterned children.',
        example: '.cta:focus { outline: 2px solid #e8c4a0; }\n.tile:nth-child(odd) { background: #3a2038; }',
      },
    ],
    objectives: [
      { id: 'cta-focus', label: 'Style .cta:focus { ... }' },
      { id: 'nth-odd', label: 'Style .tile:nth-child(odd) { ... }' },
    ],
    hints: [
      '.cta:focus { outline: 2px solid #e8c4a0; outline-offset: 3px; }\n.tile:nth-child(odd) { background: #3a2038; }',
    ],
    starterHtml: heroStage,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.cta { background: #f4a4bc; color: #1a0a10; border: none; padding: 0.6rem 1.2rem; border-radius: 999px; cursor: pointer; }\n.row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-top: 1rem; }\n.tile { padding: 1rem; background: #2a1528; border-radius: 8px; }\n`,
  }),
  q({
    id: 'css-i11',
    kind: 'quest',
    tier: 'intermediate',
    chapter: 23,
    title: 'Flex Wrap + Grow',
    hook: 'Responsive rows wrap. Items can grow to fill space.',
    missionBrief: 'Set .row to flex-wrap: wrap and .tile to flex: 1 (or flex-grow).',
    realWorldWin: 'Chip clouds, responsive nav, equal-height cards.',
    story: ['wrap + grow = layouts that survive phone screens.'],
    lessonSummary: '`flex-wrap: wrap` allows multi-line flex. `flex: 1` grows items.',
    tagLessons: [
      {
        tag: 'flex-wrap / flex',
        purpose: 'Wrapping flex rows and growing items.',
        example: '.row { display: flex; flex-wrap: wrap; gap: 0.75rem; }\n.tile { flex: 1; min-width: 120px; }',
      },
    ],
    objectives: [
      { id: 'row-wrap', label: 'Set .row { flex-wrap: wrap }' },
      { id: 'tile-grow', label: 'Set .tile { flex: 1 } or flex-grow' },
    ],
    hints: ['.row { display: flex; flex-wrap: wrap; gap: 0.75rem; }\n.tile { flex: 1; min-width: 100px; }'],
    starterHtml: galleryStage,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.row { display: flex; gap: 0.75rem; }\n.tile { padding: 1rem; background: #2a1528; border-radius: 8px; }\n`,
  }),
  q({
    id: 'css-i-boss',
    kind: 'boss',
    tier: 'intermediate',
    chapter: 24,
    title: 'BOSS · Studio Finale',
    hook: 'Grid + hover + transition + gradient — interactive aesthetic.',
    missionBrief: 'Combine body gradient, 3-col grid, .tile:hover, and transition.',
    realWorldWin: 'Interactive gallery sections on modern sites.',
    story: ['Gradient. Grid. Hover. Transition. Post.'],
    lessonSummary: 'Intermediate boss: gradient + grid + hover + transition.',
    tagLessons: [
      {
        tag: 'finale combo',
        purpose: 'Gradient + grid + hover + transition.',
        example:
          'body { background: linear-gradient(...); }\n.row { display: grid; grid-template-columns: repeat(3, 1fr); }\n.tile { transition: ...; }\n.tile:hover { transform: scale(1.04); }',
      },
    ],
    objectives: [
      { id: 'body-gradient', label: 'body linear-gradient' },
      { id: 'row-grid', label: '.row display: grid' },
      { id: 'row-cols', label: '.row 3-column template' },
      { id: 'tile-hover', label: '.tile:hover style' },
      { id: 'tile-transition', label: '.tile transition' },
    ],
    hints: ['Stack gradient + grid + hover + transition'],
    starterHtml: fullLayout,
    starterCss: `/* FINALE */\n`,
    xp: 200,
    badgeId: 'badge-css-forest',
    winQuips: ['STUDIO FINALE POSTED. Intermediate cleared — Expert unlocks.'],
  }),
]

/** Expert: variables, keyframes, animations, filters, media queries, advanced grid */
export const CSS_EXPERT: QuestDef[] = [
  q({
    id: 'css-e01',
    kind: 'tutorial',
    tier: 'expert',
    chapter: 25,
    title: 'Design Tokens',
    hook: 'CSS variables = one place to change the whole brand.',
    missionBrief: 'Define --accent and --bg on :root (or body) and use them with var().',
    realWorldWin: 'Themes, dark mode, design systems.',
    story: ['Pros don’t hardcode the same pink 40 times.'],
    lessonSummary: 'Custom properties `--name` + `var(--name)`.',
    tagLessons: [
      {
        tag: ':root { --token } / var()',
        purpose: 'Reusable design tokens.',
        example: ':root {\n  --accent: #f4a4bc;\n  --bg: #0f0a12;\n}\nbody { background: var(--bg); }\n.title { color: var(--accent); }',
      },
    ],
    objectives: [
      { id: 'css-var', label: 'Define --accent (or similar) custom property' },
      { id: 'css-var-use', label: 'Use var(--...) somewhere in CSS' },
    ],
    hints: [':root {\n  --accent: #f4a4bc;\n  --bg: #0f0a12;\n}\nbody { background: var(--bg); }\n.title { color: var(--accent); }'],
    starterHtml: withTag,
    starterCss: `body { color: #faf6f2; text-align: center; }\n`,
  }),
  q({
    id: 'css-e02',
    kind: 'quest',
    tier: 'expert',
    chapter: 26,
    title: 'Keyframe Pulse',
    hook: 'Real motion starts with @keyframes.',
    missionBrief: 'Write @keyframes and apply animation to .title or .cta.',
    realWorldWin: 'Loaders, attention CTAs, onboarding motion.',
    story: ['Define the motion. Attach it with animation.'],
    lessonSummary: '`@keyframes name { }` + `animation: name duration`.',
    tagLessons: [
      {
        tag: '@keyframes / animation',
        purpose: 'Named motion sequences.',
        example:
          '@keyframes pulse {\n  from { transform: scale(1); }\n  to { transform: scale(1.06); }\n}\n.cta {\n  animation: pulse 1.2s ease-in-out infinite alternate;\n}',
      },
    ],
    objectives: [
      { id: 'keyframes', label: 'Add @keyframes { ... }' },
      { id: 'animation', label: 'Set animation: ... on an element' },
    ],
    hints: [
      '@keyframes pulse {\n  from { opacity: 0.7; }\n  to { opacity: 1; }\n}\n.title {\n  animation: pulse 1.5s ease-in-out infinite alternate;\n}',
    ],
    starterHtml: heroStage,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.title { color: #f4a4bc; font-size: 2.4rem; }\n.cta { background: #f4a4bc; color: #1a0a10; border: none; padding: 0.7rem 1.4rem; border-radius: 999px; }\n`,
  }),
  q({
    id: 'css-e03',
    kind: 'quest',
    tier: 'expert',
    chapter: 27,
    title: 'Animation Control',
    hook: 'Duration, iteration, timing — direct the show.',
    missionBrief: 'Use animation-duration (or shorthand), animation-iteration-count, and a timing function (ease/linear/etc).',
    realWorldWin: 'Loaders that loop, one-shot entrances, snappy vs silky motion.',
    story: ['infinite loops for pulses. 1 for entrances.'],
    lessonSummary: 'Control speed, repeats, and easing of animations.',
    tagLessons: [
      {
        tag: 'animation-duration / iteration / timing',
        purpose: 'Fine control of motion.',
        example: '.title {\n  animation-name: fadeIn;\n  animation-duration: 0.8s;\n  animation-iteration-count: 1;\n  animation-timing-function: ease-out;\n}',
      },
    ],
    objectives: [
      { id: 'keyframes', label: 'Keep or add @keyframes' },
      { id: 'anim-duration', label: 'Set animation-duration or duration in shorthand' },
      { id: 'anim-iter', label: 'Set animation-iteration-count or infinite in shorthand' },
    ],
    hints: [
      '@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(8px); }\n  to { opacity: 1; transform: none; }\n}\n.title {\n  animation: fadeIn 0.8s ease-out 1;\n}',
    ],
    starterHtml: heroStage,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.title { color: #f4a4bc; font-size: 2.4rem; }\n`,
  }),
  q({
    id: 'css-e04',
    kind: 'quest',
    tier: 'expert',
    chapter: 28,
    title: 'Rotate + Spin',
    hook: 'Transforms inside keyframes = spinner energy.',
    missionBrief: 'Animate transform: rotate(...) with @keyframes on .badge or .cta.',
    realWorldWin: 'Spinners, loading icons, playful UI.',
    story: ['rotate(360deg) + infinite = classic spin.'],
    lessonSummary: 'Combine `transform: rotate` with looping animation.',
    tagLessons: [
      {
        tag: 'transform: rotate + animation',
        purpose: 'Spinning / rotating motion.',
        example:
          '@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n.badge {\n  display: inline-block;\n  animation: spin 2s linear infinite;\n}',
      },
    ],
    objectives: [
      { id: 'keyframes', label: 'Add @keyframes with rotate/transform' },
      { id: 'animation', label: 'Apply animation to .badge or .cta' },
    ],
    hints: [
      '@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n.badge {\n  display: inline-block;\n  animation: spin 2s linear infinite;\n}',
    ],
    starterHtml: withCard,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.card { max-width: 320px; margin: 2rem auto; padding: 1.5rem; border: 2px solid #f4a4bc; border-radius: 14px; }\n.badge { background: #e8c4a0; color: #1a0a10; padding: 0.3rem 0.6rem; border-radius: 999px; }\n`,
  }),
  q({
    id: 'css-e05',
    kind: 'quest',
    tier: 'expert',
    chapter: 29,
    title: 'Filter Atmosphere',
    hook: 'Blur, brightness, drop-shadow — cinematic CSS.',
    missionBrief: 'Apply filter: (blur, brightness, contrast, or drop-shadow) to .card or .tile.',
    realWorldWin: 'Glassmorphism, image treatments, hover drama.',
    story: ['filter paints mood without new assets.'],
    lessonSummary: '`filter` applies visual effects to an element.',
    tagLessons: [
      {
        tag: 'filter',
        purpose: 'Blur, brightness, drop-shadow effects.',
        example: '.card {\n  filter: drop-shadow(0 12px 24px rgba(244, 164, 188, 0.4));\n}',
      },
    ],
    objectives: [{ id: 'filter', label: 'Set filter: ... on .card or .tile' }],
    hints: ['.card {\n  filter: drop-shadow(0 12px 24px rgba(244, 164, 188, 0.45));\n}'],
    starterHtml: withCard,
    starterCss: `body { background: linear-gradient(160deg, #0f0a12, #2a1528); color: #faf6f2; text-align: center; }\n.card {\n  max-width: 320px;\n  margin: 2rem auto;\n  padding: 1.5rem;\n  border-radius: 16px;\n  background: rgba(255,255,255,0.06);\n  border: 1px solid rgba(244,164,188,0.35);\n}\n`,
  }),
  q({
    id: 'css-e06',
    kind: 'quest',
    tier: 'expert',
    chapter: 30,
    title: 'Glass Backdrop',
    hook: 'backdrop-filter = frosted glass UI.',
    missionBrief: 'Use backdrop-filter: blur(...) on .card or .hero.',
    realWorldWin: 'iOS-style bars, modal frosts, premium overlays.',
    story: ['Blur what’s behind — not the element itself.'],
    lessonSummary: '`backdrop-filter` blurs content behind a translucent layer.',
    tagLessons: [
      {
        tag: 'backdrop-filter',
        purpose: 'Frosted glass over background content.',
        example: '.card {\n  background: rgba(255,255,255,0.08);\n  backdrop-filter: blur(12px);\n}',
      },
    ],
    objectives: [{ id: 'backdrop', label: 'Set backdrop-filter: blur(...)' }],
    hints: ['.card {\n  background: rgba(255,255,255,0.08);\n  backdrop-filter: blur(12px);\n}'],
    starterHtml: withCard,
    starterCss: `body {\n  background: linear-gradient(160deg, #0f0a12, #4a2040, #0f0a12);\n  color: #faf6f2;\n  text-align: center;\n  min-height: 100vh;\n}\n.card {\n  max-width: 320px;\n  margin: 3rem auto;\n  padding: 1.5rem;\n  border-radius: 16px;\n  border: 1px solid rgba(255,255,255,0.2);\n}\n`,
  }),
  q({
    id: 'css-e07',
    kind: 'quest',
    tier: 'expert',
    chapter: 31,
    title: 'Responsive Break',
    hook: 'Crazy sites survive phones — media queries.',
    missionBrief: 'Add @media (max-width: ...) that changes .row to 1 column or stacks layout.',
    realWorldWin: 'Every production website is responsive.',
    story: ['Desktop grid. Phone stack. Same HTML.'],
    lessonSummary: '`@media (max-width: 600px) { }` overrides styles for small screens.',
    tagLessons: [
      {
        tag: '@media',
        purpose: 'Responsive breakpoints.',
        example:
          '.row { display: grid; grid-template-columns: repeat(3, 1fr); }\n@media (max-width: 600px) {\n  .row { grid-template-columns: 1fr; }\n}',
      },
    ],
    objectives: [
      { id: 'media', label: 'Add @media (max-width: ...) { ... }' },
      { id: 'media-rule', label: 'Change a layout property inside the media query' },
    ],
    hints: [
      '.row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }\n@media (max-width: 600px) {\n  .row { grid-template-columns: 1fr; }\n}',
    ],
    starterHtml: fullLayout,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }\n.tile { padding: 1rem; background: #2a1528; border-radius: 8px; }\n`,
  }),
  q({
    id: 'css-e08',
    kind: 'quest',
    tier: 'expert',
    chapter: 32,
    title: 'Auto-Fit Grid',
    hook: 'minmax + auto-fit = magical responsive grids.',
    missionBrief: 'Use grid-template-columns: repeat(auto-fit, minmax(...)) on .row.',
    realWorldWin: 'Card galleries that reflow without media queries.',
    story: ['One line of CSS. Infinite screen sizes.'],
    lessonSummary: '`repeat(auto-fit, minmax(min, 1fr))` auto-fills columns.',
    tagLessons: [
      {
        tag: 'auto-fit / minmax',
        purpose: 'Responsive grids without many breakpoints.',
        example: '.row {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));\n  gap: 0.75rem;\n}',
      },
    ],
    objectives: [{ id: 'autofit', label: 'Use repeat(auto-fit, minmax(...)) on .row' }],
    hints: [
      '.row {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));\n  gap: 0.75rem;\n}',
    ],
    starterHtml: galleryStage,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.row { display: grid; gap: 0.75rem; }\n.tile { padding: 1rem; background: #2a1528; border-radius: 8px; }\n`,
  }),
  q({
    id: 'css-e09',
    kind: 'quest',
    tier: 'expert',
    chapter: 33,
    title: 'Overflow & Scroll Snap',
    hook: 'Carousels and horizontal feeds need overflow + snap.',
    missionBrief: 'Set .row to overflow-x: auto and scroll-snap-type: x mandatory; tiles get scroll-snap-align.',
    realWorldWin: 'Story trays, product carousels, Gen-Z horizontal scroll.',
    story: ['Snap makes scroll feel intentional.'],
    lessonSummary: '`overflow-x` + `scroll-snap-type` + `scroll-snap-align`.',
    tagLessons: [
      {
        tag: 'overflow / scroll-snap',
        purpose: 'Scrollable rows that snap to cards.',
        example:
          '.row {\n  display: flex;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;\n  gap: 0.75rem;\n}\n.tile {\n  flex: 0 0 70%;\n  scroll-snap-align: center;\n}',
      },
    ],
    objectives: [
      { id: 'overflow-x', label: 'Set overflow-x: auto (or scroll) on .row' },
      { id: 'snap-type', label: 'Set scroll-snap-type on .row' },
      { id: 'snap-align', label: 'Set scroll-snap-align on .tile' },
    ],
    hints: [
      '.row {\n  display: flex;\n  overflow-x: auto;\n  scroll-snap-type: x mandatory;\n  gap: 0.75rem;\n}\n.tile {\n  flex: 0 0 70%;\n  scroll-snap-align: center;\n}',
    ],
    starterHtml: fullLayout,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; }\n.row { display: flex; gap: 0.75rem; }\n.tile { padding: 2rem; background: #2a1528; border-radius: 12px; min-width: 200px; }\n`,
  }),
  q({
    id: 'css-e10',
    kind: 'quest',
    tier: 'expert',
    chapter: 34,
    title: 'Cubic Bezier Timing',
    hook: 'Custom easing = signature motion.',
    missionBrief: 'Use transition or animation with cubic-bezier(...).',
    realWorldWin: 'Brand-feeling motion on buttons and cards.',
    story: ['ease is fine. cubic-bezier is character.'],
    lessonSummary: '`cubic-bezier(x1, y1, x2, y2)` customizes acceleration.',
    tagLessons: [
      {
        tag: 'cubic-bezier',
        purpose: 'Custom easing curves.',
        example: '.tile {\n  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);\n}',
      },
    ],
    objectives: [{ id: 'cubic', label: 'Use cubic-bezier(...) in transition or animation' }],
    hints: ['.tile {\n  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);\n}\n.tile:hover { transform: scale(1.05); }'],
    starterHtml: fullLayout,
    starterCss: `body { background-color: #0f0a12; color: #faf6f2; text-align: center; }\n.row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }\n.tile { padding: 1rem; background: #2a1528; border-radius: 8px; }\n.tile:hover { transform: scale(1.05); }\n`,
  }),
  q({
    id: 'css-e11',
    kind: 'quest',
    tier: 'expert',
    chapter: 35,
    title: 'Opacity + Mix',
    hook: 'Fade layers and blend modes for crazy overlays.',
    missionBrief: 'Set opacity on .tag and mix-blend-mode on .title or .badge.',
    realWorldWin: 'Overlays on photos, neon text on gradients.',
    story: ['Opacity fades. Blend modes remix colors.'],
    lessonSummary: '`opacity` fades the element. `mix-blend-mode` blends with what’s behind.',
    tagLessons: [
      {
        tag: 'opacity / mix-blend-mode',
        purpose: 'Transparency and color blending.',
        example: '.tag { opacity: 0.7; }\n.title { mix-blend-mode: screen; }',
      },
    ],
    objectives: [
      { id: 'opacity', label: 'Set opacity: ... on an element' },
      { id: 'blend', label: 'Set mix-blend-mode: ... on an element' },
    ],
    hints: ['.tag { opacity: 0.65; letter-spacing: 0.2em; }\n.title { mix-blend-mode: screen; color: #f4a4bc; }'],
    starterHtml: withTag,
    starterCss: `body {\n  background: linear-gradient(120deg, #0f0a12, #4a2040);\n  color: #faf6f2;\n  text-align: center;\n}\n.title { font-size: 2.6rem; font-weight: 800; }\n`,
  }),
  q({
    id: 'css-e-boss',
    kind: 'boss',
    tier: 'expert',
    chapter: 36,
    title: 'BOSS · Crazy Dynamic Drop',
    hook: 'Ship a living page — variables, keyframes, hover motion, responsive grid.',
    missionBrief:
      'Combine CSS variables, @keyframes animation, transition or transform hover, and a media query or auto-fit grid.',
    realWorldWin: 'This is the toolkit for modern dynamic marketing sites.',
    story: ['Tokens. Motion. Interaction. Responsive. Post the crazy.'],
    lessonSummary: 'Expert boss: variables + animation + interaction + responsive layout.',
    tagLessons: [
      {
        tag: 'dynamic finale',
        purpose: 'Variables + keyframes + hover + responsive.',
        example:
          ':root { --accent: #f4a4bc; }\n@keyframes pulse { ... }\n.tile { transition: transform 0.3s; animation: pulse 2s infinite; }\n@media (max-width: 600px) { .row { grid-template-columns: 1fr; } }',
      },
    ],
    objectives: [
      { id: 'css-var', label: 'Define a CSS variable (--...)' },
      { id: 'css-var-use', label: 'Use var(--...)' },
      { id: 'keyframes', label: '@keyframes present' },
      { id: 'animation', label: 'animation applied' },
      { id: 'tile-transition', label: 'transition or transform hover' },
      { id: 'responsive', label: '@media OR auto-fit/minmax grid' },
    ],
    hints: [
      ':root { --accent: #f4a4bc; --bg: #0f0a12; }\nbody { background: var(--bg); }\n@keyframes pulse { from { opacity: 0.8; } to { opacity: 1; } }\n.title { color: var(--accent); animation: pulse 1.5s infinite alternate; }\n.tile { transition: transform 0.3s ease; }\n.tile:hover { transform: scale(1.05); }\n.row { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); }\n@media (max-width: 500px) { .title { font-size: 1.6rem; } }',
    ],
    starterHtml: heroStage,
    starterCss: `/* CRAZY DYNAMIC DROP — assemble the expert toolkit */\n`,
    xp: 260,
    badgeId: 'badge-css-expert',
    winQuips: ['DYNAMIC DROP POSTED. CSS Forest Expert cleared — you can make crazy sites now.'],
  }),
]

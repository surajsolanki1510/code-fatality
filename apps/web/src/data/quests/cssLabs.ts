import type { QuestDef, QuestObjective, SkillTier } from './types'

export type LabMode = 'flex' | 'grid' | 'transition' | 'animation' | 'responsive'

export type CssLabBoard = {
  mode: LabMode
  target: string
  before: string
  after: string
  pieces: { id: string; label: string; hue: string }[]
  boardClass?: string
  slots?: number
}

type LabSpec = {
  id: string
  /** Portfolio quest id — labs run BEFORE this level */
  before: string
  tier: SkillTier
  gameTitle: string
  pack: string
  title: string
  hook: string
  job: string
  learn: { tag: string; plain: string; example: string }[]
  hint: string
  starter: string
  board: CssLabBoard
  objectives: QuestObjective[]
  checks: Record<string, (css: string) => boolean>
}

function has(css: string, re: RegExp) {
  return re.test(css)
}

/** Order in this array = play order when multiple labs share the same `before` id. */
const LABS: LabSpec[] = [
  // ═══ FLEX POND — before portfolio flex levels (css-p10) ═══
  {
    id: 'css-lab-flex-0',
    before: 'css-p10',
    tier: 'beginner',
    gameTitle: 'FLEX POND',
    pack: 'LEVEL 1',
    title: 'Wake the Pond',
    hook: 'Orbs are stuck. Wake the row with display:flex.',
    job: 'Set #pond { display: flex } so orbs line up in a row.',
    learn: [
      {
        tag: 'display: flex',
        plain: 'Turns on flexbox — children sit in a row (by default).',
        example: '#pond {\n  display: flex;\n}',
      },
    ],
    hint: 'display: flex;',
    starter: '',
    board: {
      mode: 'flex',
      target: '#pond',
      before: '#pond {',
      after: '}',
      pieces: [
        { id: 'a', label: '◉', hue: '#ff6b9d' },
        { id: 'b', label: '◉', hue: '#7c6bff' },
        { id: 'c', label: '◉', hue: '#3dd6c6' },
      ],
      slots: 3,
      boardClass: 'is-flex-row',
    },
    objectives: [{ id: 'lab-flex', label: 'display: flex' }],
    checks: { 'lab-flex': (c) => has(c, /display\s*:\s*flex/i) },
  },
  {
    id: 'css-lab-flex-1',
    before: 'css-p10',
    tier: 'beginner',
    gameTitle: 'FLEX POND',
    pack: 'LEVEL 2',
    title: 'Right Lily Pads',
    hook: 'Slide glowing orbs onto the RIGHT pads — Froggy style.',
    job: 'Add justify-content: flex-end on #pond.',
    learn: [
      {
        tag: 'justify-content: flex-end',
        plain: 'Pushes flex items to the end of the row (right in LTR).',
        example: '#pond {\n  display: flex;\n  justify-content: flex-end;\n}',
      },
    ],
    hint: 'display: flex;\njustify-content: flex-end;',
    starter: 'display: flex;\n',
    board: {
      mode: 'flex',
      target: '#pond',
      before: '#pond {',
      after: '}',
      pieces: [
        { id: 'a', label: 'A', hue: '#ff6b9d' },
        { id: 'b', label: 'B', hue: '#7c6bff' },
        { id: 'c', label: 'C', hue: '#3dd6c6' },
      ],
      slots: 3,
      boardClass: 'is-end',
    },
    objectives: [
      { id: 'lab-flex', label: 'display: flex' },
      { id: 'lab-end', label: 'justify-content: flex-end' },
    ],
    checks: {
      'lab-flex': (c) => has(c, /display\s*:\s*flex/i),
      'lab-end': (c) => has(c, /justify-content\s*:\s*flex-end/i),
    },
  },
  {
    id: 'css-lab-flex-2',
    before: 'css-p10',
    tier: 'beginner',
    gameTitle: 'FLEX POND',
    pack: 'LEVEL 3',
    title: 'Center Squad',
    hook: 'Perfect symmetry — center every orb on the pond.',
    job: 'justify-content: center AND align-items: center.',
    learn: [
      {
        tag: 'center both axes',
        plain: 'justify = main axis. align-items = cross axis.',
        example: '#pond {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}',
      },
    ],
    hint: 'display: flex;\njustify-content: center;\nalign-items: center;',
    starter: 'display: flex;\n',
    board: {
      mode: 'flex',
      target: '#pond',
      before: '#pond {',
      after: '}',
      pieces: [
        { id: 'a', label: '✦', hue: '#ff6b9d' },
        { id: 'b', label: '✦', hue: '#7c6bff' },
      ],
      slots: 2,
      boardClass: 'is-center',
    },
    objectives: [
      { id: 'lab-flex', label: 'display: flex' },
      { id: 'lab-center', label: 'justify-content: center' },
      { id: 'lab-align', label: 'align-items: center' },
    ],
    checks: {
      'lab-flex': (c) => has(c, /display\s*:\s*flex/i),
      'lab-center': (c) => has(c, /justify-content\s*:\s*center/i),
      'lab-align': (c) => has(c, /align-items\s*:\s*center/i),
    },
  },
  {
    id: 'css-lab-flex-3',
    before: 'css-p10',
    tier: 'beginner',
    gameTitle: 'FLEX POND',
    pack: 'LEVEL 4',
    title: 'Space Between',
    hook: 'Pin orbs to opposite shores with max drama.',
    job: 'justify-content: space-between on #pond.',
    learn: [
      {
        tag: 'space-between',
        plain: 'First item at start, last at end, equal space between.',
        example: '#pond {\n  display: flex;\n  justify-content: space-between;\n}',
      },
    ],
    hint: 'display: flex;\njustify-content: space-between;',
    starter: 'display: flex;\n',
    board: {
      mode: 'flex',
      target: '#pond',
      before: '#pond {',
      after: '}',
      pieces: [
        { id: 'a', label: '1', hue: '#ff8a4c' },
        { id: 'b', label: '2', hue: '#4cc9f0' },
        { id: 'c', label: '3', hue: '#b8f25a' },
      ],
      slots: 3,
      boardClass: 'is-between',
    },
    objectives: [
      { id: 'lab-flex', label: 'display: flex' },
      { id: 'lab-between', label: 'justify-content: space-between' },
    ],
    checks: {
      'lab-flex': (c) => has(c, /display\s*:\s*flex/i),
      'lab-between': (c) => has(c, /justify-content\s*:\s*space-between/i),
    },
  },
  {
    id: 'css-lab-flex-4',
    before: 'css-p10',
    tier: 'beginner',
    gameTitle: 'FLEX POND',
    pack: 'BOSS',
    title: 'Column Stack',
    hook: 'Stack orbs vertically — then gap them.',
    job: 'flex-direction: column + gap on #pond.',
    learn: [
      {
        tag: 'column + gap',
        plain: 'column = vertical stack. gap = space without margin hacks.',
        example: '#pond {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  align-items: center;\n}',
      },
    ],
    hint: 'display: flex;\nflex-direction: column;\ngap: 1rem;\nalign-items: center;',
    starter: 'display: flex;\n',
    board: {
      mode: 'flex',
      target: '#pond',
      before: '#pond {',
      after: '}',
      pieces: [
        { id: 'a', label: '↑', hue: '#ff6b9d' },
        { id: 'b', label: '↑', hue: '#7c6bff' },
        { id: 'c', label: '↑', hue: '#3dd6c6' },
      ],
      slots: 3,
      boardClass: 'is-column',
    },
    objectives: [
      { id: 'lab-flex', label: 'display: flex' },
      { id: 'lab-col', label: 'flex-direction: column' },
      { id: 'lab-gap', label: 'gap: ...' },
    ],
    checks: {
      'lab-flex': (c) => has(c, /display\s*:\s*flex/i),
      'lab-col': (c) => has(c, /flex-direction\s*:\s*column/i),
      'lab-gap': (c) => has(c, /\bgap\s*:/i),
    },
  },

  // ═══ GRID GARDEN — before css-p14 ═══
  {
    id: 'css-lab-grid-1',
    before: 'css-p14',
    tier: 'intermediate',
    gameTitle: 'GRID GARDEN',
    pack: 'LEVEL 1',
    title: 'Plant the Grid',
    hook: 'Seeds want rows AND columns — display:grid.',
    job: '#garden { display: grid; gap: ... }',
    learn: [
      {
        tag: 'display: grid',
        plain: 'Grid = 2D layout. Perfect for project galleries.',
        example: '#garden {\n  display: grid;\n  gap: 12px;\n}',
      },
    ],
    hint: 'display: grid;\ngap: 12px;',
    starter: '',
    board: {
      mode: 'grid',
      target: '#garden',
      before: '#garden {',
      after: '}',
      pieces: [
        { id: '1', label: '🌱', hue: '#86efac' },
        { id: '2', label: '🌱', hue: '#4ade80' },
        { id: '3', label: '🌱', hue: '#22c55e' },
        { id: '4', label: '🌱', hue: '#16a34a' },
      ],
      slots: 4,
      boardClass: 'is-grid-basic',
    },
    objectives: [
      { id: 'lab-grid', label: 'display: grid' },
      { id: 'lab-gap', label: 'gap' },
    ],
    checks: {
      'lab-grid': (c) => has(c, /display\s*:\s*grid/i),
      'lab-gap': (c) => has(c, /\bgap\s*:/i),
    },
  },
  {
    id: 'css-lab-grid-2',
    before: 'css-p14',
    tier: 'intermediate',
    gameTitle: 'GRID GARDEN',
    pack: 'LEVEL 2',
    title: 'Three Beds',
    hook: 'Carve the garden into three equal columns.',
    job: 'grid-template-columns: repeat(3, 1fr) or 1fr 1fr 1fr.',
    learn: [
      {
        tag: 'grid-template-columns',
        plain: 'Defines column count and width.',
        example: '#garden {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}',
      },
    ],
    hint: 'display: grid;\ngrid-template-columns: repeat(3, 1fr);\ngap: 12px;',
    starter: 'display: grid;\ngap: 12px;\n',
    board: {
      mode: 'grid',
      target: '#garden',
      before: '#garden {',
      after: '}',
      pieces: [
        { id: '1', label: 'A', hue: '#4ade80' },
        { id: '2', label: 'B', hue: '#22c55e' },
        { id: '3', label: 'C', hue: '#16a34a' },
      ],
      slots: 3,
      boardClass: 'is-grid-3',
    },
    objectives: [
      { id: 'lab-grid', label: 'display: grid' },
      { id: 'lab-cols', label: '3 columns' },
    ],
    checks: {
      'lab-grid': (c) => has(c, /display\s*:\s*grid/i),
      'lab-cols': (c) =>
        has(c, /grid-template-columns\s*:\s*repeat\s*\(\s*3\s*,/i) ||
        has(c, /grid-template-columns\s*:\s*1fr\s+1fr\s+1fr/i),
    },
  },
  {
    id: 'css-lab-grid-3',
    before: 'css-p14',
    tier: 'intermediate',
    gameTitle: 'GRID GARDEN',
    pack: 'BOSS',
    title: 'Auto-Fit Magic',
    hook: 'Cards reflow when the garden shrinks.',
    job: 'repeat(auto-fit, minmax(100px, 1fr)).',
    learn: [
      {
        tag: 'auto-fit + minmax',
        plain: 'Responsive columns without media queries.',
        example: 'grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));',
      },
    ],
    hint: 'display: grid;\ngrid-template-columns: repeat(auto-fit, minmax(100px, 1fr));\ngap: 10px;',
    starter: 'display: grid;\ngap: 10px;\n',
    board: {
      mode: 'grid',
      target: '#garden',
      before: '#garden {',
      after: '}',
      pieces: [
        { id: '1', label: '◆', hue: '#86efac' },
        { id: '2', label: '◆', hue: '#4ade80' },
        { id: '3', label: '◆', hue: '#22c55e' },
        { id: '4', label: '◆', hue: '#16a34a' },
        { id: '5', label: '◆', hue: '#15803d' },
        { id: '6', label: '◆', hue: '#14532d' },
      ],
      slots: 6,
      boardClass: 'is-grid-auto',
    },
    objectives: [
      { id: 'lab-autofit', label: 'auto-fit' },
      { id: 'lab-minmax', label: 'minmax(...)' },
    ],
    checks: {
      'lab-autofit': (c) => has(c, /auto-fit/i),
      'lab-minmax': (c) => has(c, /minmax\s*\(/i),
    },
  },

  // ═══ GLOW SHIFT — before css-p18 (transitions) ═══
  {
    id: 'css-lab-trans-1',
    before: 'css-p18',
    tier: 'intermediate',
    gameTitle: 'GLOW SHIFT',
    pack: 'LEVEL 1',
    title: 'No Teleporting',
    hook: 'The orb SNAPS on hover. Fix it with transition.',
    job: 'Add transition on #orb (transform or all).',
    learn: [
      {
        tag: 'transition',
        plain: 'Smooth property changes — glide, don\'t teleport.',
        example: '#orb {\n  transition: transform 0.4s ease;\n}',
      },
    ],
    hint: 'transition: transform 0.4s ease, box-shadow 0.4s ease;',
    starter: '',
    board: {
      mode: 'transition',
      target: '#orb',
      before: '#orb {',
      after: '}\n#orb:hover {\n  transform: scale(1.25);\n  box-shadow: 0 0 40px #ff6b9d;\n}',
      pieces: [{ id: 'orb', label: '◎', hue: '#ff6b9d' }],
      boardClass: 'is-transition',
    },
    objectives: [
      { id: 'lab-trans', label: 'transition: ...' },
      { id: 'lab-trans-time', label: 'duration (s or ms)' },
    ],
    checks: {
      'lab-trans': (c) => has(c, /transition\s*:/i),
      'lab-trans-time': (c) => has(c, /\d+(\.\d+)?(s|ms)/i),
    },
  },
  {
    id: 'css-lab-trans-2',
    before: 'css-p18',
    tier: 'intermediate',
    gameTitle: 'GLOW SHIFT',
    pack: 'LEVEL 2',
    title: 'Float Up',
    hook: 'Hover should lift the orb with silky motion.',
    job: 'transition on transform + test hover block.',
    learn: [
      {
        tag: 'transform transition',
        plain: 'Pair transition with :hover transform for lift effect.',
        example: '#orb { transition: transform 0.35s ease; }\n#orb:hover { transform: translateY(-14px); }',
      },
    ],
    hint: 'transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);',
    starter: '',
    board: {
      mode: 'transition',
      target: '#orb',
      before: '#orb {',
      after: '}\n#orb:hover {\n  transform: translateY(-14px) scale(1.1);\n  background: #7c6bff;\n}',
      pieces: [{ id: 'orb', label: '◎', hue: '#7c6bff' }],
      boardClass: 'is-transition',
    },
    objectives: [
      { id: 'lab-trans', label: 'transition' },
      { id: 'lab-bezier', label: 'ease or cubic-bezier' },
    ],
    checks: {
      'lab-trans': (c) => has(c, /transition\s*:/i),
      'lab-bezier': (c) => has(c, /cubic-bezier\s*\(|ease/i),
    },
  },
  {
    id: 'css-lab-trans-3',
    before: 'css-p18',
    tier: 'intermediate',
    gameTitle: 'GLOW SHIFT',
    pack: 'BOSS',
    title: 'Transition All',
    hook: 'One spell line — transition: all.',
    job: 'transition: all 0.35s ease on #orb.',
    learn: [
      {
        tag: 'transition: all',
        plain: 'Shortcut for every property (great for learning, be specific in prod).',
        example: '#orb { transition: all 0.35s ease; }',
      },
    ],
    hint: 'transition: all 0.35s ease;',
    starter: '',
    board: {
      mode: 'transition',
      target: '#orb',
      before: '#orb {',
      after: '}\n#orb:hover {\n  transform: rotate(12deg) scale(1.15);\n  box-shadow: 0 0 50px #fbbf24;\n}',
      pieces: [{ id: 'orb', label: '✦', hue: '#fbbf24' }],
      boardClass: 'is-transition',
    },
    objectives: [
      { id: 'lab-trans-all', label: 'transition: all' },
      { id: 'lab-trans-time', label: 'duration' },
    ],
    checks: {
      'lab-trans-all': (c) => has(c, /transition\s*:\s*all/i),
      'lab-trans-time': (c) => has(c, /\d+(\.\d+)?(s|ms)/i),
    },
  },

  // ═══ BEAT FORGE — before css-p28 (animation) ═══
  {
    id: 'css-lab-anim-1',
    before: 'css-p28',
    tier: 'expert',
    gameTitle: 'BEAT FORGE',
    pack: 'LEVEL 1',
    title: 'First Pulse',
    hook: 'Crystal is frozen. Write @keyframes + animation.',
    job: '@keyframes pulse { ... } and animation on #pulse.',
    learn: [
      {
        tag: '@keyframes + animation',
        plain: 'Keyframes = dance steps. animation = play them on loop.',
        example: '@keyframes pulse {\n  from { transform: scale(1); }\n  to { transform: scale(1.2); }\n}\n#pulse { animation: pulse 1s infinite alternate; }',
      },
    ],
    hint: '@keyframes pulse {\n  from { transform: scale(1); opacity: 1; }\n  to { transform: scale(1.25); opacity: 0.75; }\n}\n#pulse { animation: pulse 1s ease infinite alternate; }',
    starter: '',
    board: {
      mode: 'animation',
      target: '#pulse',
      before: '',
      after: '',
      pieces: [{ id: 'pulse', label: '♥', hue: '#ff6b9d' }],
      boardClass: 'is-anim',
    },
    objectives: [
      { id: 'lab-kf', label: '@keyframes' },
      { id: 'lab-anim', label: 'animation: ...' },
    ],
    checks: {
      'lab-kf': (c) => has(c, /@keyframes\s+\w+/i),
      'lab-anim': (c) => has(c, /animation\s*:/i),
    },
  },
  {
    id: 'css-lab-anim-2',
    before: 'css-p28',
    tier: 'expert',
    gameTitle: 'BEAT FORGE',
    pack: 'LEVEL 2',
    title: 'Infinite Beat',
    hook: 'Keep the crystal dancing forever.',
    job: 'animation with infinite keyword.',
    learn: [
      {
        tag: 'infinite',
        plain: 'Loop the animation forever. alternate = ping-pong.',
        example: 'animation: pulse 1.2s ease-in-out infinite alternate;',
      },
    ],
    hint: '@keyframes pulse {\n  0% { transform: translateY(0); }\n  100% { transform: translateY(-18px); }\n}\n#pulse { animation: pulse 1.2s ease-in-out infinite alternate; }',
    starter: '@keyframes pulse {\n  from { transform: translateY(0); }\n  to { transform: translateY(-18px); }\n}\n#pulse {\n  \n}',
    board: {
      mode: 'animation',
      target: '#pulse',
      before: '',
      after: '',
      pieces: [{ id: 'pulse', label: '▲', hue: '#fbbf24' }],
      boardClass: 'is-anim',
    },
    objectives: [
      { id: 'lab-kf', label: '@keyframes' },
      { id: 'lab-anim', label: 'animation' },
      { id: 'lab-inf', label: 'infinite' },
    ],
    checks: {
      'lab-kf': (c) => has(c, /@keyframes/i),
      'lab-anim': (c) => has(c, /animation\s*:/i),
      'lab-inf': (c) => has(c, /\binfinite\b/i),
    },
  },
  {
    id: 'css-lab-anim-3',
    before: 'css-p28',
    tier: 'expert',
    gameTitle: 'BEAT FORGE',
    pack: 'BOSS',
    title: 'Spin & Glow',
    hook: 'Combine rotate + scale in keyframes.',
    job: '@keyframes with transform rotate AND animation.',
    learn: [
      {
        tag: 'transform in keyframes',
        plain: 'Animate multiple transforms in one dance.',
        example: '@keyframes spin {\n  to { transform: rotate(360deg) scale(1.1); }\n}',
      },
    ],
    hint: '@keyframes spin {\n  from { transform: rotate(0deg) scale(1); }\n  to { transform: rotate(360deg) scale(1.15); }\n}\n#pulse { animation: spin 2s linear infinite; }',
    starter: '',
    board: {
      mode: 'animation',
      target: '#pulse',
      before: '',
      after: '',
      pieces: [{ id: 'pulse', label: '◈', hue: '#a78bfa' }],
      boardClass: 'is-anim is-spin',
    },
    objectives: [
      { id: 'lab-kf', label: '@keyframes' },
      { id: 'lab-rotate', label: 'rotate in keyframes' },
      { id: 'lab-anim', label: 'animation' },
    ],
    checks: {
      'lab-kf': (c) => has(c, /@keyframes/i),
      'lab-rotate': (c) => has(c, /rotate\s*\(/i),
      'lab-anim': (c) => has(c, /animation\s*:/i),
    },
  },

  // ═══ SHRINK RAY — before css-p32 (responsive) ═══
  {
    id: 'css-lab-resp-1',
    before: 'css-p32',
    tier: 'expert',
    gameTitle: 'SHRINK RAY',
    pack: 'LEVEL 1',
    title: 'Phone Mode',
    hook: 'Drag the slider — layout breaks until @media saves it.',
    job: '@media (max-width: 600px) { #stage { flex-direction: column; } }',
    learn: [
      {
        tag: '@media',
        plain: 'CSS that kicks in below a screen width — mobile first thinking.',
        example: '@media (max-width: 600px) {\n  #stage { flex-direction: column; }\n}',
      },
    ],
    hint: '@media (max-width: 600px) {\n  #stage { flex-direction: column; }\n}',
    starter: '#stage {\n  display: flex;\n  gap: 12px;\n}\n',
    board: {
      mode: 'responsive',
      target: '#stage',
      before: '',
      after: '',
      pieces: [
        { id: 'a', label: 'Nav', hue: '#94a3b8' },
        { id: 'b', label: 'Main', hue: '#38bdf8' },
        { id: 'c', label: 'Aside', hue: '#a78bfa' },
      ],
      boardClass: 'is-responsive',
    },
    objectives: [
      { id: 'lab-media', label: '@media (max-width: …)' },
      { id: 'lab-col', label: 'flex-direction: column in media' },
    ],
    checks: {
      'lab-media': (c) => has(c, /@media\s*\([^)]*max-width/i),
      'lab-col': (c) => has(c, /@media[\s\S]*flex-direction\s*:\s*column/i),
    },
  },
  {
    id: 'css-lab-resp-2',
    before: 'css-p32',
    tier: 'expert',
    gameTitle: 'SHRINK RAY',
    pack: 'BOSS',
    title: 'Grid Collapse',
    hook: 'On phone, garden becomes one column.',
    job: '@media rule that sets grid-template-columns: 1fr.',
    learn: [
      {
        tag: 'responsive grid',
        plain: 'Collapse multi-column grids on small screens.',
        example: '@media (max-width: 600px) {\n  #garden { grid-template-columns: 1fr; }\n}',
      },
    ],
    hint: '#garden { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }\n@media (max-width: 600px) {\n  #garden { grid-template-columns: 1fr; }\n}',
    starter: '#garden {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}\n',
    board: {
      mode: 'grid',
      target: '#garden',
      before: '',
      after: '',
      pieces: [
        { id: '1', label: '1', hue: '#38bdf8' },
        { id: '2', label: '2', hue: '#0ea5e9' },
        { id: '3', label: '3', hue: '#0284c7' },
      ],
      slots: 3,
      boardClass: 'is-grid-3 is-responsive-grid',
    },
    objectives: [
      { id: 'lab-media', label: '@media' },
      { id: 'lab-one-col', label: 'grid-template-columns: 1fr in media' },
    ],
    checks: {
      'lab-media': (c) => has(c, /@media/i),
      'lab-one-col': (c) => has(c, /@media[\s\S]*grid-template-columns\s*:\s*1fr/i),
    },
  },
]

export const CSS_LAB_BY_ID: Record<string, LabSpec> = Object.fromEntries(LABS.map((l) => [l.id, l]))

export function getLabBeforeMap(): Record<string, LabSpec[]> {
  const map: Record<string, LabSpec[]> = {}
  for (const lab of LABS) {
    ;(map[lab.before] ??= []).push(lab)
  }
  return map
}

/** @deprecated use getLabBeforeMap */
export function getLabAfterMap(): Record<string, LabSpec[]> {
  return getLabBeforeMap()
}

export function labToQuest(lab: LabSpec): QuestDef {
  return {
    id: lab.id,
    worldId: 'css-forest',
    speaker: 'Luxe',
    kind: 'lab',
    tier: lab.tier,
    chapter: 0,
    title: lab.title,
    hook: lab.hook,
    story: [`${lab.gameTitle} · ${lab.pack}`, lab.hook],
    missionBrief: lab.job,
    lessonSummary: lab.learn.map((l) => l.plain).join(' '),
    tagLessons: lab.learn.map((l) => ({ tag: l.tag, purpose: l.plain, example: l.example })),
    objectives: lab.objectives,
    hints: [lab.hint],
    winQuips: [
      `${lab.gameTitle} cleared! Apply this on your portfolio next.`,
      'PERFECT ALIGNMENT. Portfolio time.',
      'Skill unlocked — your site is about to look fire.',
    ],
    failQuips: ['Not yet — check the glowing checklist.', 'Wrong spell — peek the hint.', 'The board is waiting…'],
    starterHtml: '<!-- CSS game — edit styles below -->',
    starterCss: lab.starter,
    xp: lab.tier === 'expert' ? 80 : lab.tier === 'intermediate' ? 65 : 55,
  }
}

export function getLabMeta(questId: string) {
  return CSS_LAB_BY_ID[questId]
}

export function validateCssLab(questId: string, css: string): { passed: boolean; results: { id: string; passed: boolean; message: string }[] } | null {
  const lab = CSS_LAB_BY_ID[questId]
  if (!lab) return null
  const results = lab.objectives.map((obj) => {
    const ok = lab.checks[obj.id]?.(css) ?? false
    return { id: obj.id, passed: ok, message: obj.label }
  })
  return { passed: results.length > 0 && results.every((r) => r.passed), results }
}

export { LABS as CSS_LAB_SPECS }

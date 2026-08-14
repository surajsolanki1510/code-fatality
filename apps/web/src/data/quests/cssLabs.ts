import type { QuestDef, QuestObjective, SkillTier } from './types'

export type LabMode = 'flex' | 'grid' | 'transition' | 'animation' | 'responsive'

export type CssLabBoard = {
  mode: LabMode
  /** CSS selector the player styles */
  target: string
  /** Readonly CSS shell shown around the editor lines */
  before: string
  after: string
  /** Visual pieces on the board */
  pieces: { id: string; label: string; hue: string }[]
  /** Extra board markup class */
  boardClass?: string
  /** Number of grid/flex slots for ghosts */
  slots?: number
}

type LabSpec = {
  id: string
  after: string
  tier: SkillTier
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

const LABS: LabSpec[] = [
  {
    id: 'css-lab-flex-1',
    after: 'css-p10',
    tier: 'beginner',
    pack: 'FLEX LAB',
    title: 'Pond · justify-content',
    hook: 'Slide the orbs onto the lily pads — like Flexbox Froggy.',
    job: 'On #pond set display:flex and justify-content: flex-end so orbs sit on the right pads.',
    learn: [
      {
        tag: 'justify-content',
        plain: 'Moves flex items along the row: flex-start, center, flex-end, space-between…',
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
    after: 'css-lab-flex-1',
    tier: 'beginner',
    pack: 'FLEX LAB',
    title: 'Pond · center',
    hook: 'Center every orb on the pond.',
    job: 'justify-content: center + align-items: center on #pond.',
    learn: [
      {
        tag: 'align-items',
        plain: 'Moves items on the cross axis (up/down in a row).',
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
    after: 'css-lab-flex-2',
    tier: 'beginner',
    pack: 'FLEX LAB',
    title: 'Pond · space-between',
    hook: 'Pin orbs to opposite ends with equal air in the middle.',
    job: 'justify-content: space-between on #pond.',
    learn: [
      {
        tag: 'space-between',
        plain: 'First item at start, last at end, equal gaps between.',
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
    after: 'css-p12',
    tier: 'beginner',
    pack: 'FLEX LAB',
    title: 'Pond · column + gap',
    hook: 'Stack orbs vertically with breathing room.',
    job: 'flex-direction: column and gap on #pond.',
    learn: [
      {
        tag: 'flex-direction + gap',
        plain: 'column stacks top→bottom. gap spaces them.',
        example: '#pond {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}',
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
  {
    id: 'css-lab-grid-1',
    after: 'css-p14',
    tier: 'intermediate',
    pack: 'GRID LAB',
    title: 'Garden · display grid',
    hook: 'Plant cards into a CSS grid garden.',
    job: 'Make #garden a grid with gap.',
    learn: [
      {
        tag: 'display: grid',
        plain: 'Grid = rows AND columns at once. Perfect for galleries.',
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
        { id: '1', label: '1', hue: '#86efac' },
        { id: '2', label: '2', hue: '#86efac' },
        { id: '3', label: '3', hue: '#86efac' },
        { id: '4', label: '4', hue: '#86efac' },
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
    after: 'css-lab-grid-1',
    tier: 'intermediate',
    pack: 'GRID LAB',
    title: 'Garden · 3 columns',
    hook: 'Carve the garden into three equal beds.',
    job: 'grid-template-columns: 1fr 1fr 1fr (or repeat(3, 1fr)).',
    learn: [
      {
        tag: 'grid-template-columns',
        plain: 'Defines how many columns and their widths.',
        example: '#garden {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 12px;\n}',
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
      { id: 'lab-cols', label: '3 columns (1fr × 3 or repeat)' },
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
    after: 'css-p16',
    tier: 'intermediate',
    pack: 'GRID LAB',
    title: 'Garden · auto-fit',
    hook: 'Cards reflow as the garden shrinks — responsive magic.',
    job: 'Use repeat(auto-fit, minmax(100px, 1fr)).',
    learn: [
      {
        tag: 'auto-fit + minmax',
        plain: 'Columns wrap automatically based on available width.',
        example: '#garden {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));\n}',
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
  {
    id: 'css-lab-trans-1',
    after: 'css-p18',
    tier: 'intermediate',
    pack: 'MOTION LAB',
    title: 'Glow Orb · transition',
    hook: 'Make the orb glide when it changes — not snap.',
    job: 'Add transition on #orb for transform and box-shadow.',
    learn: [
      {
        tag: 'transition',
        plain: 'Smooths property changes over time when hover/state flips.',
        example: '#orb {\n  transition: transform 0.4s ease, box-shadow 0.4s ease;\n}',
      },
    ],
    hint: 'transition: transform 0.4s ease, box-shadow 0.4s ease;',
    starter: '',
    board: {
      mode: 'transition',
      target: '#orb',
      before: '#orb {',
      after: '}\n#orb:hover {\n  transform: scale(1.2);\n  box-shadow: 0 0 30px #ff6b9d;\n}',
      pieces: [{ id: 'orb', label: '◎', hue: '#ff6b9d' }],
      boardClass: 'is-transition',
    },
    objectives: [
      { id: 'lab-trans', label: 'transition: ...' },
      { id: 'lab-trans-time', label: 'time unit (s or ms)' },
    ],
    checks: {
      'lab-trans': (c) => has(c, /transition\s*:/i),
      'lab-trans-time': (c) => has(c, /\d+(\.\d+)?(s|ms)/i),
    },
  },
  {
    id: 'css-lab-trans-2',
    after: 'css-lab-trans-1',
    tier: 'intermediate',
    pack: 'MOTION LAB',
    title: 'Glow Orb · all',
    hook: 'One line to animate every changing property.',
    job: 'transition: all 0.35s ease;',
    learn: [
      {
        tag: 'transition: all',
        plain: 'Handy shortcut — but prefer listing properties on real sites.',
        example: '#orb {\n  transition: all 0.35s ease;\n}',
      },
    ],
    hint: 'transition: all 0.35s ease;',
    starter: '',
    board: {
      mode: 'transition',
      target: '#orb',
      before: '#orb {',
      after: '}\n#orb:hover {\n  transform: translateY(-12px) rotate(8deg);\n  background: #7c6bff;\n}',
      pieces: [{ id: 'orb', label: '◎', hue: '#7c6bff' }],
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
  {
    id: 'css-lab-anim-1',
    after: 'css-p28',
    tier: 'expert',
    pack: 'ANIM LAB',
    title: 'Pulse · @keyframes',
    hook: 'Invent a keyframe dance, then attach it.',
    job: 'Write @keyframes pulse and animation on #pulse.',
    learn: [
      {
        tag: '@keyframes + animation',
        plain: 'Keyframes = the dance steps. animation = play them.',
        example: '@keyframes pulse {\n  from { transform: scale(1); }\n  to { transform: scale(1.2); }\n}\n#pulse { animation: pulse 1s infinite alternate; }',
      },
    ],
    hint: '@keyframes pulse {\n  from { transform: scale(1); opacity: 1; }\n  to { transform: scale(1.25); opacity: 0.7; }\n}\n#pulse {\n  animation: pulse 1s ease infinite alternate;\n}',
    starter: '',
    board: {
      mode: 'animation',
      target: '#pulse',
      before: '/* write keyframes + #pulse rules */',
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
    after: 'css-lab-anim-1',
    tier: 'expert',
    pack: 'ANIM LAB',
    title: 'Pulse · infinite loop',
    hook: 'Keep the beat forever.',
    job: 'animation with infinite (and ideally alternate or ease).',
    learn: [
      {
        tag: 'animation: … infinite',
        plain: 'infinite = never stop. alternate = ping-pong the keyframes.',
        example: '#pulse {\n  animation: pulse 1.2s ease-in-out infinite alternate;\n}',
      },
    ],
    hint: '@keyframes pulse {\n  0% { transform: translateY(0); }\n  100% { transform: translateY(-16px); }\n}\n#pulse { animation: pulse 1.2s ease-in-out infinite alternate; }',
    starter: '@keyframes pulse {\n  from { transform: translateY(0); }\n  to { transform: translateY(-16px); }\n}\n#pulse {\n  \n}',
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
    id: 'css-lab-resp-1',
    after: 'css-p32',
    tier: 'expert',
    pack: 'RESPONSIVE LAB',
    title: 'Phone · @media',
    hook: 'Shrink the stage — restyle for mobile width.',
    job: 'Write @media (max-width: 600px) and change #stage flex-direction to column.',
    learn: [
      {
        tag: '@media',
        plain: 'CSS that only applies at certain screen sizes — real responsive websites.',
        example: '@media (max-width: 600px) {\n  #stage { flex-direction: column; }\n}',
      },
    ],
    hint: '@media (max-width: 600px) {\n  #stage {\n    flex-direction: column;\n  }\n}',
    starter: '',
    board: {
      mode: 'responsive',
      target: '#stage',
      before: '#stage {\n  display: flex;\n  gap: 12px;\n}\n',
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
      { id: 'lab-col', label: 'flex-direction: column inside media' },
    ],
    checks: {
      'lab-media': (c) => has(c, /@media\s*\([^)]*max-width/i),
      'lab-col': (c) => has(c, /@media[\s\S]*flex-direction\s*:\s*column/i),
    },
  },
]

export const CSS_LAB_BY_ID: Record<string, LabSpec> = Object.fromEntries(LABS.map((l) => [l.id, l]))

export function getLabAfterMap(): Record<string, LabSpec[]> {
  const map: Record<string, LabSpec[]> = {}
  for (const lab of LABS) {
    ;(map[lab.after] ??= []).push(lab)
  }
  return map
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
    story: [`CSS Lab: ${lab.pack}`, lab.hook],
    missionBrief: lab.job,
    lessonSummary: lab.learn.map((l) => l.plain).join(' '),
    tagLessons: lab.learn.map((l) => ({ tag: l.tag, purpose: l.plain, example: l.example })),
    objectives: lab.objectives,
    hints: [lab.hint],
    winQuips: ['Lab cleared — back to your portfolio with new powers.', 'Nice. That skill is yours now.', 'Froggy vibes. Portfolio next.'],
    failQuips: ['Almost — check the checklist.', 'Peek the hint, then try again.', 'One property at a time.'],
    starterHtml: '<!-- lab board is visual — edit CSS only -->',
    starterCss: lab.starter,
    xp: lab.tier === 'expert' ? 80 : lab.tier === 'intermediate' ? 65 : 55,
  }
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

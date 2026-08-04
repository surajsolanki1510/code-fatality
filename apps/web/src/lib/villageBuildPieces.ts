/** What each objective summons in the village build arena. */
export type BuildPieceKind =
  | 'speech'
  | 'house'
  | 'sign'
  | 'district'
  | 'board'
  | 'steps'
  | 'power'
  | 'spark'
  | 'spotlight'
  | 'portal'
  | 'mural'
  | 'road'
  | 'secret'
  | 'badge'
  | 'quote'
  | 'code'
  | 'generic'

export type BuildPieceDef = {
  tag: string
  name: string
  summonLine: string
  color: string
  kind: BuildPieceKind
  /** Placement key used by CSS */
  slot: string
}

const BY_ID: Record<string, BuildPieceDef> = {
  p: {
    tag: '<p>',
    name: 'Voice',
    summonLine: 'Words hit the street — the village can talk.',
    color: '#5dff9f',
    kind: 'speech',
    slot: 'npc',
  },
  div: {
    tag: '<div>',
    name: 'House',
    summonLine: 'Foundation locks. A real container just rose.',
    color: '#ffe27a',
    kind: 'house',
    slot: 'house',
  },
  h1: {
    tag: '<h1>',
    name: 'Title Sign',
    summonLine: 'Headline drop. Everyone can see the name now.',
    color: '#ff6b6b',
    kind: 'sign',
    slot: 'sign',
  },
  h2: {
    tag: '<h2>',
    name: 'District',
    summonLine: 'New district lights up.',
    color: '#6ec6ff',
    kind: 'district',
    slot: 'district',
  },
  h3: {
    tag: '<h3>',
    name: 'Side Street',
    summonLine: 'Side street unlocked.',
    color: '#9ad7ff',
    kind: 'district',
    slot: 'district-b',
  },
  ul: {
    tag: '<ul>',
    name: 'Quest Board',
    summonLine: 'Quest board slammed onto the wall.',
    color: '#ffb347',
    kind: 'board',
    slot: 'board',
  },
  ol: {
    tag: '<ol>',
    name: 'Step Path',
    summonLine: 'Numbered steps carve a path.',
    color: '#c4a0ff',
    kind: 'steps',
    slot: 'board',
  },
  strong: {
    tag: '<strong>',
    name: 'Power Word',
    summonLine: 'IMPORTANT — that word hits harder.',
    color: '#ff6b6b',
    kind: 'power',
    slot: 'fx',
  },
  em: {
    tag: '<em>',
    name: 'Tone Spark',
    summonLine: 'Emphasis spark — tone unlocked.',
    color: '#ff9ecd',
    kind: 'spark',
    slot: 'fx',
  },
  emph: {
    tag: '<strong>',
    name: 'Power Word',
    summonLine: 'Emphasis armed.',
    color: '#ff6b6b',
    kind: 'power',
    slot: 'fx',
  },
  span: {
    tag: '<span>',
    name: 'Spotlight',
    summonLine: 'Spotlight on those words only.',
    color: '#ffe27a',
    kind: 'spotlight',
    slot: 'fx',
  },
  a: {
    tag: '<a>',
    name: 'Portal',
    summonLine: 'Portal open — the village links out.',
    color: '#a78bfa',
    kind: 'portal',
    slot: 'portal',
  },
  img: {
    tag: '<img>',
    name: 'Mural',
    summonLine: 'Mural hung. The wall has life.',
    color: '#5dff9f',
    kind: 'mural',
    slot: 'mural',
  },
  br: {
    tag: '<br>',
    name: 'Line Break',
    summonLine: 'Path breaks to a new line.',
    color: '#8ecae6',
    kind: 'road',
    slot: 'road',
  },
  hr: {
    tag: '<hr>',
    name: 'Divider',
    summonLine: 'Road divider cuts the square.',
    color: '#c4a574',
    kind: 'road',
    slot: 'road',
  },
  comment: {
    tag: '<!-- -->',
    name: 'Secret Note',
    summonLine: 'Architect note planted. Visitors will never see it.',
    color: '#9aa0b8',
    kind: 'secret',
    slot: 'secret',
  },
  id: {
    tag: 'id',
    name: 'Nameplate',
    summonLine: 'Unique ID locked on.',
    color: '#ffe27a',
    kind: 'badge',
    slot: 'badge',
  },
  class: {
    tag: 'class',
    name: 'Crew Badge',
    summonLine: 'Class badge stamped — reusable power.',
    color: '#5dff9f',
    kind: 'badge',
    slot: 'badge',
  },
  bq: {
    tag: '<blockquote>',
    name: 'Quote Stage',
    summonLine: 'Quote stage rises.',
    color: '#6ec6ff',
    kind: 'quote',
    slot: 'quote',
  },
  cite: {
    tag: '<cite>',
    name: 'Credit',
    summonLine: 'Source credited.',
    color: '#9ad7ff',
    kind: 'quote',
    slot: 'quote',
  },
  code: {
    tag: '<code>',
    name: 'Code Glyph',
    summonLine: 'Code glyphs light the wall.',
    color: '#5dff9f',
    kind: 'code',
    slot: 'code',
  },
  pre: {
    tag: '<pre>',
    name: 'Code Scroll',
    summonLine: 'Code scroll unrolls.',
    color: '#2d9b74',
    kind: 'code',
    slot: 'code',
  },
}

export function buildPieceForObjective(id: string, label: string): BuildPieceDef {
  if (BY_ID[id]) return BY_ID[id]
  const tagMatch = label.match(/<[\w/!-]+>/)
  return {
    tag: tagMatch?.[0] ?? id,
    name: label.slice(0, 18),
    summonLine: `${label} — summoned.`,
    color: '#ffe27a',
    kind: 'generic',
    slot: 'generic',
  }
}

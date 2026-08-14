export type WorldId = 'html-village' | 'css-forest' | 'js-arena' | 'web-fusion'

export type WorldDef = {
  id: WorldId
  name: string
  subtitle: string
  description: string
  bannerClass: string
  art: string
  accent: string
  unlockAfterWorld?: WorldId
  bossQuestId: string
}

export const WORLDS: WorldDef[] = [
  {
    id: 'html-village',
    name: 'HTML Village',
    subtitle: 'REALM I — STRUCTURE',
    description:
      'Beginner → Intermediate → Expert. 48 chapters. Zero to production HTML. Nova teaches every tag.',
    bannerClass: 'world-card__banner--html',
    art: '/art/world-html.jpg',
    accent: '#e8b86d',
    bossQuestId: 'html-village-boss',
  },
  {
    id: 'css-forest',
    name: 'CSS Forest',
    subtitle: 'REALM II — STYLE',
    description:
      'PORTFOLIO FORGE — build YOUR unique site + Froggy-style CSS labs (flex, grid, motion, responsive). Download + host on GitHub at the end.',
    bannerClass: 'world-card__banner--css',
    art: '/art/world-css.jpg',
    accent: '#5dff9f',
    bossQuestId: 'css-p-e-boss',
  },
  {
    id: 'js-arena',
    name: 'JavaScript Arena',
    subtitle: 'REALM III — LOGIC',
    description: 'Bring fighters to life with variables, functions, and DOM power.',
    bannerClass: 'world-card__banner--js',
    art: '/art/world-js.jpg',
    accent: '#ffe566',
    bossQuestId: 'js-arena-boss',
  },
  {
    id: 'web-fusion',
    name: 'Web Fusion',
    subtitle: 'REALM IV — TRINITY',
    description: 'HTML + CSS + JS unite. Ship a real mini-app and unlock the next continent.',
    bannerClass: 'world-card__banner--fusion',
    art: '/art/world-fusion.jpg',
    accent: '#d4a5ff',
    bossQuestId: 'web-fusion-boss',
  },
]

export function isWorldUnlocked(
  _world: WorldDef,
  _completedQuestIds: string[],
  _worlds: WorldDef[] = WORLDS,
): boolean {
  // Languages stay open; only chapters/levels lock in order.
  return true
}

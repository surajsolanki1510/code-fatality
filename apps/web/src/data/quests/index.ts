import { HTML_BEGINNER } from './htmlBeginner'
import { HTML_INTERMEDIATE } from './htmlIntermediate'
import { HTML_EXPERT } from './htmlExpert'
import { storyBeatsFor } from './htmlStoryBeats'
import { enrichTagLessons } from './tagGuide'
import type { QuestDef, SkillTier } from './types'

const cssDefaults = {
  hook: '',
  lessonSummary: '',
  tagLessons: [] as QuestDef['tagLessons'],
  winQuips: ['Nice!'],
  failQuips: ['Try again — you got this.'],
  tier: 'beginner' as SkillTier,
}

function withStoryBeats(quests: QuestDef[]): QuestDef[] {
  return quests.map((q) => ({
    ...q,
    tagLessons: enrichTagLessons(q.tagLessons),
    storyBeats: storyBeatsFor(q.id) ?? q.storyBeats,
  }))
}

export const HTML_VILLAGE_QUESTS: QuestDef[] = withStoryBeats([
  ...HTML_BEGINNER,
  ...HTML_INTERMEDIATE,
  ...HTML_EXPERT,
])

export const CSS_FOREST_QUESTS: QuestDef[] = [
  {
    ...cssDefaults,
    id: 'css-forest-1',
    worldId: 'css-forest',
    kind: 'tutorial',
    chapter: 1,
    title: 'Paint the World',
    speaker: 'Zara',
    hook: 'HTML built the bones. CSS is the glow-up.',
    story: ['Color and typography change everything.'],
    lessonSummary: 'CSS selects HTML elements and styles them.',
    tagLessons: [
      { tag: 'body { }', purpose: 'Styles the whole page background.', example: 'body { background-color: #0a0a12; }' },
    ],
    objectives: [
      { id: 'body-bg', label: 'Set body { background-color: ... }' },
      { id: 'h1-color', label: 'Style h1 { color: ... }' },
    ],
    hints: ['Use any colors you like'],
    starterHtml: `<div class="grove">
  <h1>CSS Forest</h1>
  <p>Wake the colors.</p>
</div>`,
    starterCss: `/* Your CSS here */\n`,
    xp: 50,
  },
  {
    ...cssDefaults,
    id: 'css-forest-boss',
    worldId: 'css-forest',
    kind: 'boss',
    chapter: 2,
    title: 'Flex Boss',
    speaker: 'Zara',
    hook: 'Flexbox = layout cheat code.',
    story: ['Align the stones in a row with display: flex.'],
    lessonSummary: 'Flexbox lines items up horizontally or vertically.',
    objectives: [
      { id: 'flex', label: 'Use display: flex on .grove' },
      { id: 'spacing', label: 'Use gap or margin for spacing' },
    ],
    hints: ['.grove { display: flex; gap: 1rem; }'],
    starterHtml: `<div class="grove">
  <div class="stone">I</div>
  <div class="stone">II</div>
  <div class="stone">III</div>
</div>`,
    starterCss: `.grove { min-height: 120px; }
.stone { padding: 1rem; background: #2d5a3d; color: #fff; }
`,
    xp: 200,
    badgeId: 'badge-css-forest',
  },
]

export const ALL_QUESTS: QuestDef[] = [...HTML_VILLAGE_QUESTS, ...CSS_FOREST_QUESTS]

export function getQuestById(id: string): QuestDef | undefined {
  return ALL_QUESTS.find((q) => q.id === id)
}

export function getQuestsForWorld(worldId: string): QuestDef[] {
  return ALL_QUESTS.filter((q) => q.worldId === worldId).sort((a, b) => a.chapter - b.chapter)
}

export function getQuestsByTier(worldId: string, tier: SkillTier): QuestDef[] {
  return getQuestsForWorld(worldId).filter((q) => q.tier === tier)
}

export function getChapterProgress(worldId: string, completedIds: string[]): { done: number; total: number } {
  const quests = getQuestsForWorld(worldId)
  const done = quests.filter((q) => completedIds.includes(q.id)).length
  return { done, total: quests.length }
}

export function getTierProgress(
  worldId: string,
  tier: SkillTier,
  completedIds: string[],
): { done: number; total: number } {
  const quests = getQuestsByTier(worldId, tier)
  const done = quests.filter((q) => completedIds.includes(q.id)).length
  return { done, total: quests.length }
}

/** Chapters unlock in order — first incomplete previous chapter blocks next */
export function isQuestUnlocked(quest: QuestDef, completedIds: string[]): boolean {
  const siblings = getQuestsForWorld(quest.worldId)
  const index = siblings.findIndex((q) => q.id === quest.id)
  if (index <= 0) return true
  const prev = siblings[index - 1]
  return completedIds.includes(prev.id)
}

export function isTierUnlocked(_worldId: string, tier: SkillTier, completedIds: string[]): boolean {
  if (tier === 'beginner') return true
  if (tier === 'intermediate') {
    return completedIds.includes('html-b-boss')
  }
  if (tier === 'expert') {
    return completedIds.includes('html-i-boss')
  }
  return false
}

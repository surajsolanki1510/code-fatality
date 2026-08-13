import { HTML_BEGINNER } from './htmlBeginner'
import { HTML_INTERMEDIATE } from './htmlIntermediate'
import { HTML_EXPERT } from './htmlExpert'
import { CSS_BEGINNER, CSS_INTERMEDIATE, CSS_EXPERT } from './cssBeginner'
import { makeCssEasy } from './cssEasyTalk'
import { storyBeatsFor } from './htmlStoryBeats'
import { enrichTagLessons } from './tagGuide'
import type { QuestDef, SkillTier } from './types'

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

export const CSS_FOREST_QUESTS: QuestDef[] = [...CSS_BEGINNER, ...CSS_INTERMEDIATE, ...CSS_EXPERT].map((q) =>
  makeCssEasy(q),
)

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

export function isTierUnlocked(worldId: string, tier: SkillTier, completedIds: string[]): boolean {
  if (tier === 'beginner') return true
  if (worldId === 'css-forest') {
    if (tier === 'intermediate') return completedIds.includes('css-b-boss')
    if (tier === 'expert') return completedIds.includes('css-i-boss')
    return false
  }
  if (tier === 'intermediate') {
    return completedIds.includes('html-b-boss')
  }
  if (tier === 'expert') {
    return completedIds.includes('html-i-boss')
  }
  return false
}

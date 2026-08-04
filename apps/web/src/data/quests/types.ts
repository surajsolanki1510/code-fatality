export type QuestKind = 'tutorial' | 'quest' | 'boss'
export type SkillTier = 'beginner' | 'intermediate' | 'expert'

export type TagAttribute = {
  name: string
  meaning: string
}

export type TagLesson = {
  tag: string
  /** What the tag is, in plain words */
  purpose: string
  /** Why real websites use it */
  why?: string
  /** When you should pick this tag */
  whenToUse?: string
  /** Important attributes for this tag */
  attributes?: TagAttribute[]
  /** Correct complete example */
  example: string
  /** Common beginner mistake to avoid */
  mistake?: string
}

/** Must match validateQuest check `id` for live mission ticks */
export type QuestObjective = {
  id: string
  label: string
}

export type StoryScene =
  | 'speechBubble'
  | 'boxRise'
  | 'signDrop'
  | 'sectionLights'
  | 'listBoard'
  | 'orderedBoard'
  | 'emphasisFlash'
  | 'spanGlow'
  | 'portalOpen'
  | 'portraitIn'
  | 'genericPulse'

export type StoryBeat = {
  /** Tag or condition key detected in HTML */
  when: string
  scene: StoryScene
  line: string
}

export type QuestDef = {
  id: string
  worldId: string
  kind: QuestKind
  tier: SkillTier
  chapter: number
  title: string
  speaker: string
  hook: string
  story: string[]
  /** Creative brief: what you’re actually building this chapter */
  missionBrief?: string
  /** Where this skill shows up on real sites / apps */
  realWorldWin?: string
  lessonSummary: string
  tagLessons: TagLesson[]
  objectives: QuestObjective[]
  hints: string[]
  winQuips: string[]
  failQuips: string[]
  starterHtml: string
  starterCss?: string
  storyBeats?: StoryBeat[]
  xp: number
  badgeId?: string
}

export const TIER_LABEL: Record<SkillTier, string> = {
  beginner: 'BEGINNER',
  intermediate: 'INTERMEDIATE',
  expert: 'EXPERT',
}

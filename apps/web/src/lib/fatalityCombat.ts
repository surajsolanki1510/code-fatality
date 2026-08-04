/**
 * Asset paths for Code Fatality Arena.
 * Drop your real files here — gameplay does not change:
 *   public/art/fatality/hero.png
 *   public/art/fatality/enemy.png
 *   public/art/fatality/arena.mp4  (or arena.webm)
 */
export const FATALITY_ASSETS = {
  // Match landing page warriors for visual consistency.
  hero: '/warrior-left-cut.png',
  heroFallback: '/warrior-left-cut.png',
  enemy: '/warrior-right-cut.png',
  enemyFallback: '/warrior-right-cut.png',
  /** Primary loop — drop your file at public/art/fatality/arena.mp4 */
  arenaVideo: '/art/fatality/arena.mp4',
  arenaPoster: '/art/world-html.jpg',
} as const

export type CombatCheck = { id: string; passed: boolean }

export type CombatSnapshot = {
  passedCount: number
  total: number
  /** 0–100 remaining enemy HP */
  enemyHp: number
  /** 0–100 hero HP (cosmetic; floors at 20) */
  heroHp: number
  combo: number
}

export function combatFromChecks(
  results: CombatCheck[] | undefined,
  totalObjectives: number,
  heroHitsTaken: number,
): CombatSnapshot {
  const total = Math.max(1, totalObjectives)
  const passedCount = results?.filter((r) => r.passed).length ?? 0
  const enemyHp = Math.max(0, Math.round(100 - (passedCount / total) * 100))
  const heroHp = Math.max(20, 100 - heroHitsTaken * 18)
  return {
    passedCount,
    total,
    enemyHp,
    heroHp,
    combo: passedCount,
  }
}

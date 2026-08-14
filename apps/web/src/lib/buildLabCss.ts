import type { LabMode } from '../data/quests/cssLabs'

/** Merge player CSS into one valid rule — no double #pond { blocks. */
export function buildLabCss(
  target: string,
  before: string,
  after: string,
  userCss: string,
  mode: LabMode,
): string {
  const raw = userCss.trim()

  if (mode === 'animation') return raw
  if (mode === 'responsive') return raw

  const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const blockRe = new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`, 'i')
  const blockMatch = raw.match(blockRe)

  let decl = raw
  if (blockMatch) {
    decl = blockMatch[1]?.trim() ?? ''
  }

  // Strip comment-only lines from declarations
  decl = decl.replace(/\/\*[\s\S]*?\*\//g, '').trim()

  const userRule = decl ? `${target} {\n${decl}\n}` : ''

  if (mode === 'transition') {
    const hoverAlready = /#orb:hover/i.test(raw)
    const parts = [userRule, hoverAlready ? '' : after].filter(Boolean)
    return parts.join('\n')
  }

  if (blockMatch && !before) return raw

  if (blockMatch) return userRule

  if (!before) return raw

  return `${before}\n${decl}\n${after}`.replace(/\n\s*\n/g, '\n')
}

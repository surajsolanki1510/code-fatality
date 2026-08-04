export type HtmlBuildFlags = {
  hasP: boolean
  hasDiv: boolean
  hasPInDiv: boolean
  hasH1: boolean
  hasH2: boolean
  hasH3: boolean
  ulItems: number
  olItems: number
  listItems: number
  hasStrong: boolean
  hasEm: boolean
  hasSpan: boolean
  hasLink: boolean
  hasImg: boolean
  hasBr: boolean
  hasHr: boolean
  hasComment: boolean
  hasId: boolean
  hasClass: boolean
  hasBlockquote: boolean
  hasCite: boolean
  hasCode: boolean
  hasPre: boolean
  hasForm: boolean
  hasLabel: boolean
  hasHeader: boolean
  hasMain: boolean
  hasFooter: boolean
  hasNavLink: boolean
  hasSection: boolean
  hasArticle: boolean
  h1Text: string
  h2Text: string
  pText: string
  linkText: string
  imgAlt: string
}

export function analyzeHtml(html: string): HtmlBuildFlags {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const div = doc.querySelector('div')
  const h1 = doc.querySelector('h1')
  const h2 = doc.querySelector('h2')
  const p = doc.querySelector('p')
  const pInDiv = doc.querySelector('div p')
  const a = doc.querySelector('a[href]')
  const img = doc.querySelector('img[alt], img[src]')

  return {
    hasP: p !== null,
    hasDiv: div !== null,
    hasPInDiv: pInDiv !== null,
    hasH1: h1 !== null,
    hasH2: h2 !== null,
    hasH3: doc.querySelector('h3') !== null,
    ulItems: doc.querySelectorAll('ul li').length,
    olItems: doc.querySelectorAll('ol li').length,
    listItems: doc.querySelectorAll('ul li, ol li').length,
    hasStrong: doc.querySelector('strong') !== null,
    hasEm: doc.querySelector('em') !== null,
    hasSpan: doc.querySelector('span') !== null,
    hasLink: a !== null,
    hasImg: img !== null,
    hasBr: doc.querySelector('br') !== null,
    hasHr: doc.querySelector('hr') !== null,
    hasComment: /<!--[\s\S]*?-->/.test(html),
    hasId: doc.querySelector('[id]') !== null,
    hasClass: doc.querySelector('[class]') !== null,
    hasBlockquote: doc.querySelector('blockquote') !== null,
    hasCite: doc.querySelector('cite') !== null,
    hasCode: doc.querySelector('code') !== null,
    hasPre: doc.querySelector('pre') !== null,
    hasForm: doc.querySelector('form') !== null,
    hasLabel: doc.querySelector('label') !== null,
    hasHeader: doc.querySelector('header') !== null,
    hasMain: doc.querySelector('main') !== null,
    hasFooter: doc.querySelector('footer') !== null,
    hasNavLink: doc.querySelector('nav a') !== null,
    hasSection: doc.querySelector('section') !== null,
    hasArticle: doc.querySelector('article') !== null,
    h1Text: h1?.textContent?.trim().slice(0, 36) ?? '',
    h2Text: h2?.textContent?.trim().slice(0, 28) ?? '',
    pText: (pInDiv ?? p)?.textContent?.trim().slice(0, 72) ?? '',
    linkText: a?.textContent?.trim().slice(0, 24) ?? '',
    imgAlt: img?.getAttribute('alt')?.trim().slice(0, 28) ?? '',
  }
}

/** Progress from live mission ticks (0–1). */
export function progressFromChecks(passed: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(1, passed / total)
}

/** Fallback visual progress when checks aren't available. */
export function buildProgressFromFlags(flags: HtmlBuildFlags): number {
  const checks = [
    flags.hasP,
    flags.hasDiv,
    flags.hasH1,
    flags.hasH2,
    flags.listItems >= 2,
    flags.hasLink,
    flags.hasImg,
    flags.hasForm,
  ]
  return checks.filter(Boolean).length / checks.length
}

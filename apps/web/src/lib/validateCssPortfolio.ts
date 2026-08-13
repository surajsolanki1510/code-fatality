import type { CheckResult, ValidationOutcome } from './validateQuest'

function hasClassTag(html: string, tag: string, className: string): boolean {
  return new RegExp(`<${tag}\\b[^>]*class\\s*=\\s*["'][^"']*\\b${className}\\b`, 'i').test(html)
}

function hasClassWithContent(html: string, tag: string, className: string): boolean {
  const re = new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}\\s*>`, 'gi')
  let match: RegExpExecArray | null
  while ((match = re.exec(html)) !== null) {
    const attrs = match[1] ?? ''
    const inner = match[2] ?? ''
    if (
      new RegExp(`class\\s*=\\s*["'][^"']*\\b${className}\\b`, 'i').test(attrs) &&
      (inner.replace(/<[^>]+>/g, '').trim().length > 0 || /<[a-z]/i.test(inner))
    ) {
      return true
    }
  }
  return false
}

function hasCompleteWithText(html: string, tag: string): boolean {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}\\s*>`, 'gi')
  let match: RegExpExecArray | null
  while ((match = re.exec(html)) !== null) {
    if (match[1]?.replace(/<[^>]+>/g, '').trim().length) return true
  }
  return false
}

function sheetHas(sheet: string, re: RegExp) {
  return re.test(sheet)
}

type CheckFn = (html: string, css: string) => CheckResult

const CHECKS: Record<string, CheckFn> = {
  'html-portfolio': (html) => ({
    id: 'html-portfolio',
    passed: hasClassTag(html, 'div', 'portfolio'),
    message: 'Add <div class="portfolio">',
  }),
  'html-name': (html) => ({
    id: 'html-name',
    passed: hasClassTag(html, 'h1', 'name') && hasCompleteWithText(html, 'h1'),
    message: 'Add <h1 class="name">',
  }),
  'html-hero': (html) => ({
    id: 'html-hero',
    passed: hasClassTag(html, 'header', 'hero') || hasClassWithContent(html, 'header', 'hero'),
    message: 'Add <header class="hero">',
  }),
  'html-avatar': (html) => ({
    id: 'html-avatar',
    passed: hasClassTag(html, 'img', 'avatar'),
    message: 'Add <img class="avatar">',
  }),
  'html-tagline': (html) => ({
    id: 'html-tagline',
    passed: hasClassTag(html, 'p', 'tagline'),
    message: 'Add <p class="tagline">',
  }),
  'body-bg': (_h, css) => ({
    id: 'body-bg',
    passed: sheetHas(css, /body\s*\{[^}]*background(-color)?\s*:/i),
    message: 'body { background-color }',
  }),
  'body-color': (_h, css) => ({
    id: 'body-color',
    passed: sheetHas(css, /body\s*\{[^}]*\bcolor\s*:/i),
    message: 'body { color }',
  }),
  'name-color': (_h, css) => ({
    id: 'name-color',
    passed: sheetHas(css, /\.name\s*\{[^}]*\bcolor\s*:/i),
    message: '.name { color }',
  }),
  'name-size': (_h, css) => ({
    id: 'name-size',
    passed: sheetHas(css, /\.name\s*\{[^}]*font-size\s*:/i),
    message: '.name { font-size }',
  }),
  'name-weight': (_h, css) => ({
    id: 'name-weight',
    passed: sheetHas(css, /\.name\s*\{[^}]*font-weight\s*:/i),
    message: '.name { font-weight }',
  }),
  'hero-align': (_h, css) => ({
    id: 'hero-align',
    passed: sheetHas(css, /\.hero\s*\{[^}]*text-align\s*:\s*center/i),
    message: '.hero { text-align: center }',
  }),
  'tag-tracking': (_h, css) => ({
    id: 'tag-tracking',
    passed: sheetHas(css, /\.tagline\s*\{[^}]*letter-spacing\s*:/i),
    message: '.tagline { letter-spacing }',
  }),
  'hero-pad': (_h, css) => ({
    id: 'hero-pad',
    passed: sheetHas(css, /\.hero\s*\{[^}]*padding\s*:/i),
    message: '.hero { padding }',
  }),
  'port-pad': (_h, css) => ({
    id: 'port-pad',
    passed: sheetHas(css, /\.portfolio\s*\{[^}]*padding\s*:/i),
    message: '.portfolio { padding }',
  }),
  'box-sizing': (_h, css) => ({
    id: 'box-sizing',
    passed: sheetHas(css, /box-sizing\s*:\s*border-box/i),
    message: 'box-sizing: border-box',
  }),
  'section-margin': (_h, css) => ({
    id: 'section-margin',
    passed: sheetHas(css, /\.(about|hero|portfolio)\s*\{[^}]*margin(-[a-z]+)?\s*:/i),
    message: 'margin on .about or .hero',
  }),
  'bio-pad': (_h, css) => ({
    id: 'bio-pad',
    passed: sheetHas(css, /\.bio\s*\{[^}]*padding\s*:/i),
    message: '.bio { padding }',
  }),
  'av-width': (_h, css) => ({
    id: 'av-width',
    passed: sheetHas(css, /\.avatar\s*\{[^}]*\bwidth\s*:/i),
    message: '.avatar { width }',
  }),
  'av-height': (_h, css) => ({
    id: 'av-height',
    passed: sheetHas(css, /\.avatar\s*\{[^}]*\bheight\s*:/i),
    message: '.avatar { height }',
  }),
  'av-radius': (_h, css) => ({
    id: 'av-radius',
    passed: sheetHas(css, /\.avatar\s*\{[^}]*border-radius\s*:\s*50%/i),
    message: '.avatar { border-radius: 50% }',
  }),
  'about-pad': (_h, css) => ({
    id: 'about-pad',
    passed: sheetHas(css, /\.about\s*\{[^}]*padding\s*:/i),
    message: '.about { padding }',
  }),
  'about-border': (_h, css) => ({
    id: 'about-border',
    passed: sheetHas(css, /\.about\s*\{[^}]*border(-width|-style|-color)?\s*:/i),
    message: '.about { border }',
  }),
  'about-radius': (_h, css) => ({
    id: 'about-radius',
    passed: sheetHas(css, /\.about\s*\{[^}]*border-radius\s*:/i),
    message: '.about { border-radius }',
  }),
  'about-shadow': (_h, css) => ({
    id: 'about-shadow',
    passed: sheetHas(css, /\.about\s*\{[^}]*box-shadow\s*:/i),
    message: '.about { box-shadow }',
  }),
  'about-maxw': (_h, css) => ({
    id: 'about-maxw',
    passed: sheetHas(css, /\.about\s*\{[^}]*max-width\s*:/i),
    message: '.about { max-width }',
  }),
  'about-center': (_h, css) => ({
    id: 'about-center',
    passed: sheetHas(css, /\.about\s*\{[^}]*margin\s*:[^;]*auto/i),
    message: '.about { margin: auto }',
  }),
  'skill-flex': (_h, css) => ({
    id: 'skill-flex',
    passed: sheetHas(css, /\.skill-row\s*\{[^}]*display\s*:\s*flex/i),
    message: '.skill-row { display: flex }',
  }),
  'skill-gap': (_h, css) => ({
    id: 'skill-gap',
    passed: sheetHas(css, /\.skill-row\s*\{[^}]*\bgap\s*:/i),
    message: '.skill-row { gap }',
  }),
  'skill-justify': (_h, css) => ({
    id: 'skill-justify',
    passed: sheetHas(css, /\.skill-row\s*\{[^}]*justify-content\s*:\s*center/i),
    message: '.skill-row { justify-content: center }',
  }),
  'skill-align': (_h, css) => ({
    id: 'skill-align',
    passed: sheetHas(css, /\.skill-row\s*\{[^}]*align-items\s*:\s*center/i),
    message: '.skill-row { align-items: center }',
  }),
  'skill-pad': (_h, css) => ({
    id: 'skill-pad',
    passed: sheetHas(css, /\.skill\s*\{[^}]*padding\s*:/i),
    message: '.skill { padding }',
  }),
  'skill-radius': (_h, css) => ({
    id: 'skill-radius',
    passed: sheetHas(css, /\.skill\s*\{[^}]*border-radius\s*:/i),
    message: '.skill { border-radius }',
  }),
  'skill-inline': (_h, css) => ({
    id: 'skill-inline',
    passed: sheetHas(css, /\.skill\s*\{[^}]*display\s*:\s*inline-block/i),
    message: '.skill { display: inline-block }',
  }),
  'grid-display': (_h, css) => ({
    id: 'grid-display',
    passed: sheetHas(css, /\.project-grid\s*\{[^}]*display\s*:\s*grid/i),
    message: '.project-grid { display: grid }',
  }),
  'grid-gap': (_h, css) => ({
    id: 'grid-gap',
    passed: sheetHas(css, /\.project-grid\s*\{[^}]*\bgap\s*:/i),
    message: '.project-grid { gap }',
  }),
  'grid-cols': (_h, css) => ({
    id: 'grid-cols',
    passed:
      sheetHas(css, /\.project-grid\s*\{[^}]*grid-template-columns\s*:\s*repeat\s*\(\s*3\s*,/i) ||
      sheetHas(css, /\.project-grid\s*\{[^}]*grid-template-columns\s*:[^;]*1fr[^;]*1fr[^;]*1fr/i),
    message: 'grid-template-columns: repeat(3, 1fr)',
  }),
  'proj-pad': (_h, css) => ({
    id: 'proj-pad',
    passed: sheetHas(css, /\.project-card\s*\{[^}]*padding\s*:/i),
    message: '.project-card { padding }',
  }),
  'proj-border': (_h, css) => ({
    id: 'proj-border',
    passed: sheetHas(css, /\.project-card\s*\{[^}]*border(-width|-style|-color)?\s*:/i),
    message: '.project-card { border }',
  }),
  'proj-radius': (_h, css) => ({
    id: 'proj-radius',
    passed: sheetHas(css, /\.project-card\s*\{[^}]*border-radius\s*:/i),
    message: '.project-card { border-radius }',
  }),
  'proj-hover': (_h, css) => ({
    id: 'proj-hover',
    passed: sheetHas(css, /\.project-card\s*:\s*hover\s*\{/i),
    message: '.project-card:hover',
  }),
  'proj-transition': (_h, css) => ({
    id: 'proj-transition',
    passed: sheetHas(css, /\.project-card\s*\{[^}]*transition\s*:/i),
    message: '.project-card { transition }',
  }),
  'proj-transform': (_h, css) => ({
    id: 'proj-transform',
    passed: sheetHas(css, /\.project-card\s*:\s*hover\s*\{[^}]*transform\s*:/i),
    message: '.project-card:hover { transform }',
  }),
  gradient: (_h, css) => ({
    id: 'gradient',
    passed: sheetHas(css, /linear-gradient\s*\(/i),
    message: 'linear-gradient',
  }),
  'proj-rel': (_h, css) => ({
    id: 'proj-rel',
    passed: sheetHas(css, /\.project-card\s*\{[^}]*position\s*:\s*relative/i),
    message: '.project-card { position: relative }',
  }),
  'proj-abs': (_h, css) => ({
    id: 'proj-abs',
    passed: sheetHas(css, /position\s*:\s*absolute/i) && sheetHas(css, /\.project-card/i),
    message: 'absolute on project card',
  }),
  'hero-sticky': (_h, css) => ({
    id: 'hero-sticky',
    passed: sheetHas(css, /\.hero\s*\{[^}]*position\s*:\s*sticky/i),
    message: '.hero { position: sticky }',
  }),
  'hero-top': (_h, css) => ({
    id: 'hero-top',
    passed: sheetHas(css, /\.hero\s*\{[^}]*\btop\s*:/i),
    message: '.hero { top: 0 }',
  }),
  'hero-z': (_h, css) => ({
    id: 'hero-z',
    passed: sheetHas(css, /\.hero\s*\{[^}]*z-index\s*:/i),
    message: '.hero { z-index }',
  }),
  pseudo: (_h, css) => ({
    id: 'pseudo',
    passed: sheetHas(css, /\.name\s*::\s*(before|after)\s*\{[^}]*content\s*:/i),
    message: '.name::before/::after with content',
  }),
  'link-focus': (_h, css) => ({
    id: 'link-focus',
    passed: sheetHas(css, /\.contact-link\s*:\s*focus\s*\{/i) || sheetHas(css, /a\s*:\s*focus\s*\{/i),
    message: 'link:focus',
  }),
  'nth-odd': (_h, css) => ({
    id: 'nth-odd',
    passed: sheetHas(css, /\.project-card\s*:\s*nth-child\s*\(\s*odd\s*\)\s*\{/i),
    message: '.project-card:nth-child(odd)',
  }),
  'skill-wrap': (_h, css) => ({
    id: 'skill-wrap',
    passed: sheetHas(css, /\.skill-row\s*\{[^}]*flex-wrap\s*:\s*wrap/i),
    message: '.skill-row { flex-wrap: wrap }',
  }),
  'skill-flex1': (_h, css) => ({
    id: 'skill-flex1',
    passed: sheetHas(css, /\.skill\s*\{[^}]*flex(-grow)?\s*:/i),
    message: '.skill { flex: 1 }',
  }),
  'css-var': (_h, css) => ({
    id: 'css-var',
    passed: sheetHas(css, /--[a-zA-Z][\w-]*\s*:/i),
    message: 'CSS variable --name',
  }),
  'css-var-use': (_h, css) => ({
    id: 'css-var-use',
    passed: sheetHas(css, /var\s*\(\s*--/i),
    message: 'var(--name)',
  }),
  keyframes: (_h, css) => ({
    id: 'keyframes',
    passed: sheetHas(css, /@keyframes\s+[\w-]+\s*\{/i),
    message: '@keyframes',
  }),
  animation: (_h, css) => ({
    id: 'animation',
    passed: sheetHas(css, /animation(-name)?\s*:/i),
    message: 'animation',
  }),
  'anim-infinite': (_h, css) => ({
    id: 'anim-infinite',
    passed: sheetHas(css, /animation[^;]*\binfinite\b/i) || sheetHas(css, /animation-iteration-count\s*:\s*infinite/i),
    message: 'infinite animation',
  }),
  filter: (_h, css) => ({
    id: 'filter',
    passed: sheetHas(css, /\.avatar\s*\{[^}]*filter\s*:/i),
    message: '.avatar { filter }',
  }),
  backdrop: (_h, css) => ({
    id: 'backdrop',
    passed: sheetHas(css, /backdrop-filter\s*:\s*blur\s*\(/i),
    message: 'backdrop-filter: blur',
  }),
  media: (_h, css) => ({
    id: 'media',
    passed: sheetHas(css, /@media\s*\([^)]*max-width/i),
    message: '@media (max-width)',
  }),
  'media-rule': (_h, css) => ({
    id: 'media-rule',
    passed: sheetHas(css, /@media[^{]*\{[\s\S]*?(grid-template-columns|display|font-size|flex-direction)\s*:/i),
    message: 'layout rule inside @media',
  }),
  autofit: (_h, css) => ({
    id: 'autofit',
    passed: sheetHas(css, /grid-template-columns\s*:\s*repeat\s*\(\s*auto-fit\s*,\s*minmax\s*\(/i),
    message: 'repeat(auto-fit, minmax(...))',
  }),
  'overflow-x': (_h, css) => ({
    id: 'overflow-x',
    passed: sheetHas(css, /\.project-grid\s*\{[^}]*overflow-x\s*:\s*(auto|scroll)/i),
    message: 'overflow-x on project grid',
  }),
  'snap-type': (_h, css) => ({
    id: 'snap-type',
    passed: sheetHas(css, /scroll-snap-type\s*:/i),
    message: 'scroll-snap-type',
  }),
  'snap-align': (_h, css) => ({
    id: 'snap-align',
    passed: sheetHas(css, /\.project-card\s*\{[^}]*scroll-snap-align\s*:/i),
    message: 'scroll-snap-align on cards',
  }),
  'contact-pad': (_h, css) => ({
    id: 'contact-pad',
    passed: sheetHas(css, /\.contact\s*\{[^}]*padding\s*:/i),
    message: '.contact { padding }',
  }),
  'link-color': (_h, css) => ({
    id: 'link-color',
    passed: sheetHas(css, /\.contact-link\s*\{[^}]*\bcolor\s*:/i),
    message: '.contact-link { color }',
  }),
  'link-decor': (_h, css) => ({
    id: 'link-decor',
    passed: sheetHas(css, /\.contact-link\s*\{[^}]*text-decoration\s*:/i),
    message: '.contact-link { text-decoration }',
  }),
  cubic: (_h, css) => ({
    id: 'cubic',
    passed: sheetHas(css, /cubic-bezier\s*\(/i),
    message: 'cubic-bezier',
  }),
  opacity: (_h, css) => ({
    id: 'opacity',
    passed: sheetHas(css, /opacity\s*:\s*[\d.]+/i),
    message: 'opacity',
  }),
  blend: (_h, css) => ({
    id: 'blend',
    passed: sheetHas(css, /mix-blend-mode\s*:/i),
    message: 'mix-blend-mode',
  }),
  'section-show': (_h, css) => ({
    id: 'section-show',
    passed: sheetHas(css, /section\s*\{[^}]*display\s*:\s*(block|flex|grid)/i),
    message: 'section { display }',
  }),
  'link-hover': (_h, css) => ({
    id: 'link-hover',
    passed: sheetHas(css, /\.contact-link\s*:\s*hover\s*\{/i),
    message: '.contact-link:hover',
  }),
  'link-transition': (_h, css) => ({
    id: 'link-transition',
    passed: sheetHas(css, /\.contact-link\s*\{[^}]*transition\s*:/i),
    message: '.contact-link { transition }',
  }),
}

const QUEST_OBJECTIVES: Record<string, string[]> = {
  'css-p01': ['html-portfolio', 'html-name', 'body-bg', 'body-color'],
  'css-p02': ['html-hero', 'html-avatar', 'html-tagline', 'name-color'],
  'css-p03': ['name-size', 'name-weight'],
  'css-p04': ['hero-align', 'tag-tracking'],
  'css-p05': ['hero-pad', 'port-pad'],
  'css-p06': ['box-sizing', 'section-margin', 'bio-pad'],
  'css-p07': ['av-width', 'av-height', 'av-radius'],
  'css-p08': ['about-pad', 'about-border', 'about-radius'],
  'css-p09': ['about-shadow', 'about-maxw', 'about-center'],
  'css-p10': ['skill-flex', 'skill-gap'],
  'css-p11': ['skill-justify', 'skill-align'],
  'css-p12': ['skill-pad', 'skill-radius', 'skill-inline'],
  'css-p-boss': ['html-portfolio', 'html-avatar', 'body-bg', 'name-color', 'about-radius', 'skill-flex'],
  'css-p14': ['grid-display', 'grid-gap'],
  'css-p15': ['grid-cols'],
  'css-p16': ['proj-pad', 'proj-border', 'proj-radius'],
  'css-p17': ['proj-hover'],
  'css-p18': ['proj-transition'],
  'css-p19': ['proj-transform'],
  'css-p20': ['gradient'],
  'css-p21': ['proj-rel', 'proj-abs'],
  'css-p22': ['hero-sticky', 'hero-top', 'hero-z'],
  'css-p23': ['pseudo'],
  'css-p24': ['link-focus', 'nth-odd'],
  'css-p25': ['skill-wrap', 'skill-flex1'],
  'css-p-i-boss': ['grid-display', 'grid-cols', 'proj-hover', 'proj-transition', 'gradient'],
  'css-p27': ['css-var', 'css-var-use'],
  'css-p28': ['keyframes', 'animation'],
  'css-p29': ['keyframes', 'anim-infinite'],
  'css-p30': ['filter'],
  'css-p31': ['backdrop'],
  'css-p32': ['media', 'media-rule'],
  'css-p33': ['autofit'],
  'css-p34': ['overflow-x', 'snap-type', 'snap-align'],
  'css-p35': ['contact-pad', 'link-color', 'link-decor'],
  'css-p36': ['cubic'],
  'css-p37': ['opacity', 'blend'],
  'css-p38': ['skill-flex', 'section-show'],
  'css-p39': ['link-hover', 'link-transition'],
  'css-p-e-boss': ['css-var', 'css-var-use', 'keyframes', 'animation', 'gradient', 'grid-display', 'proj-hover', 'media'],
}

export function validateCssPortfolio(questId: string, html: string, css: string): ValidationOutcome | null {
  const ids = QUEST_OBJECTIVES[questId]
  if (!ids) return null
  const sheet = css ?? ''
  const results = ids.map((id) => {
    const fn = CHECKS[id]
    return fn ? fn(html, sheet) : { id, passed: false, message: `Unknown check: ${id}` }
  })
  return {
    passed: results.length > 0 && results.every((r) => r.passed),
    results,
  }
}

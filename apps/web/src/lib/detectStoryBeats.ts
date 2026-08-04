import type { StoryBeat } from '../data/quests/types'

function hasComment(html: string) {
  return /<!--[\s\S]*?-->/.test(html)
}

/** Detect which story beat keys are currently satisfied by the student's HTML. */
export function detectUnlockedBeats(html: string, beats: StoryBeat[]): Set<string> {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const unlocked = new Set<string>()

  const tests: Record<string, () => boolean> = {
    p: () => doc.querySelector('p') !== null,
    div: () => doc.querySelector('div') !== null,
    'nested-p': () => doc.querySelector('div p') !== null,
    h1: () => doc.querySelector('h1') !== null,
    h2: () => doc.querySelector('h2') !== null,
    h3: () => doc.querySelector('h3') !== null,
    ul: () => doc.querySelectorAll('ul li').length >= 2,
    ol: () => doc.querySelectorAll('ol li').length >= 2,
    strong: () => doc.querySelector('p strong, strong') !== null,
    em: () => doc.querySelector('p em, em') !== null,
    span: () => doc.querySelector('p span, span') !== null,
    a: () => doc.querySelector('a[href]') !== null,
    img: () => doc.querySelector('img[alt], img[src]') !== null,
    br: () => doc.querySelector('p br, br') !== null,
    hr: () => doc.querySelector('hr') !== null,
    comment: () => hasComment(html),
    id: () => doc.querySelector('[id]') !== null,
    class: () => doc.querySelector('[class]') !== null,
    bq: () => doc.querySelector('blockquote') !== null,
    cite: () => doc.querySelector('cite') !== null,
    code: () => doc.querySelector('code') !== null,
    pre: () => doc.querySelector('pre') !== null,
    header: () => doc.querySelector('header') !== null,
    main: () => doc.querySelector('main') !== null,
    nav: () => doc.querySelector('nav') !== null,
    footer: () => doc.querySelector('footer') !== null,
    section: () => doc.querySelector('section') !== null,
    article: () => doc.querySelector('article') !== null,
    aside: () => doc.querySelector('aside') !== null,
    figimg: () => doc.querySelector('figure img') !== null,
    figcap: () => doc.querySelector('figure figcaption') !== null,
    form: () => doc.querySelector('form') !== null,
    input: () => doc.querySelector('input') !== null,
    label: () => doc.querySelector('label') !== null,
    submit: () => doc.querySelector('button[type="submit"]') !== null,
    email: () => doc.querySelector('input[type="email"]') !== null,
    pass: () => doc.querySelector('input[type="password"]') !== null,
    ta: () => doc.querySelector('textarea') !== null,
    select: () => doc.querySelectorAll('select option').length >= 2,
    cb: () => doc.querySelector('input[type="checkbox"]') !== null,
    radio: () => {
      const radios = [...doc.querySelectorAll('input[type="radio"]')]
      const names = radios.map((r) => r.getAttribute('name')).filter(Boolean)
      return radios.length >= 2 && names.some((n) => names.filter((x) => x === n).length >= 2)
    },
    fs: () => doc.querySelector('fieldset legend') !== null,
    rows: () => doc.querySelectorAll('table tr').length >= 2,
    td: () => doc.querySelector('table td') !== null,
    thead: () => doc.querySelector('thead th') !== null,
    tbody: () => doc.querySelector('tbody td') !== null,
    video: () => doc.querySelector('video') !== null,
    audio: () => doc.querySelector('audio') !== null,
    details: () => doc.querySelector('details summary') !== null,
    html: () => /<html[\s>]/i.test(html) || doc.querySelector('html') !== null,
    body: () => doc.querySelector('body *') !== null,
    head: () => doc.querySelector('head') !== null,
    title: () => doc.querySelector('head title, title') !== null,
    lang: () => doc.documentElement.hasAttribute('lang') || doc.querySelector('html[lang]') !== null,
    desc: () => doc.querySelector('meta[name="description"]') !== null,
    vp: () => {
      const c = doc.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? ''
      return /width\s*=\s*device-width/i.test(c)
    },
    charset: () => doc.querySelector('meta[charset]') !== null || /charset\s*=\s*["']?utf-8/i.test(html),
    forid: () =>
      [...doc.querySelectorAll('label[for]')].some((l) => {
        const id = l.getAttribute('for')
        return Boolean(id && doc.getElementById(id))
      }),
    req: () => doc.querySelector('input[required]') !== null,
    ph: () => doc.querySelector('input[placeholder]') !== null,
    aria: () => doc.querySelector('[aria-label]') !== null,
    role: () => doc.querySelector('[role]') !== null,
    source: () => doc.querySelector('picture source') !== null,
    time: () => doc.querySelector('time') !== null,
    addr: () => doc.querySelector('address') !== null,
    progress: () => doc.querySelector('progress') !== null,
    meter: () => doc.querySelector('meter') !== null,
    dl: () => {
      const list = doc.querySelector('input[list]')
      const id = list?.getAttribute('list')
      const dl = id ? doc.getElementById(id) : null
      return Boolean(list && dl && dl.tagName.toLowerCase() === 'datalist')
    },
    ogt: () => doc.querySelector('meta[property="og:title"]') !== null,
    ogd: () => doc.querySelector('meta[property="og:description"]') !== null,
    a11y: () =>
      [...doc.querySelectorAll('label[for]')].some((l) => {
        const id = l.getAttribute('for')
        return Boolean(id && doc.getElementById(id))
      }),
    media: () => doc.querySelector('img[alt], figure') !== null,
    adv: () => doc.querySelector('time, progress, details, picture') !== null,
  }

  for (const beat of beats) {
    const test = tests[beat.when]
    if (test?.()) unlocked.add(beat.when)
  }

  return unlocked
}

export function extractSceneText(html: string): { h1: string; p: string } {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return {
    h1: doc.querySelector('h1')?.textContent?.trim().slice(0, 32) ?? '',
    p: doc.querySelector('p')?.textContent?.trim().slice(0, 60) ?? '',
  }
}

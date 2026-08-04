export type CheckResult = { id: string; passed: boolean; message: string }

export type ValidationOutcome = {
  passed: boolean
  results: CheckResult[]
}

function parseDoc(html: string): Document {
  const parser = new DOMParser()
  return parser.parseFromString(html, 'text/html')
}

export function sanitizeHtml(html: string): string {
  const doc = parseDoc(html)
  doc.querySelectorAll('script, iframe, object, embed').forEach((el) => el.remove())
  doc.querySelectorAll('*').forEach((el) => {
    for (const attr of [...el.attributes]) {
      if (attr.name.toLowerCase().startsWith('on')) el.removeAttribute(attr.name)
      if (attr.name.toLowerCase() === 'href' && attr.value.trim().toLowerCase().startsWith('javascript:')) {
        el.removeAttribute('href')
      }
    }
  })
  return doc.body.innerHTML
}

export function buildPreviewDocument(html: string, css?: string): string {
  const trimmed = html.trim()
  const looksFull = /<html[\s>]/i.test(trimmed)
  const safe = looksFull ? sanitizeFullDocument(html) : sanitizeHtml(html)
  const style = css ? `<style>${css}</style>` : ''
  if (looksFull) {
    if (css && /<\/head>/i.test(safe)) {
      return safe.replace(/<\/head>/i, `${style}</head>`)
    }
    return safe
  }
  return `<!DOCTYPE html><html><head><meta charset="utf-8">${style}</head><body>${safe}</body></html>`
}

function sanitizeFullDocument(html: string): string {
  const doc = parseDoc(html)
  doc.querySelectorAll('script').forEach((el) => el.remove())
  return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML
}

function hasComment(html: string): boolean {
  return /<!--[\s\S]*?-->/.test(html)
}

/** Strip tags/comments and measure visible text. */
function textOnly(inner: string): string {
  return inner
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function hasChildElement(inner: string): boolean {
  return /<[A-Za-z][^>]*>/.test(inner)
}

/**
 * IMPORTANT: DOMParser auto-closes tags, so incomplete `<header>` alone
 * still creates an element in the DOM. Always validate against SOURCE text.
 */
function eachClosedTag(html: string, tag: string, fn: (inner: string) => boolean): boolean {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}\\s*>`, 'gi')
  let match: RegExpExecArray | null
  while ((match = re.exec(html)) !== null) {
    if (fn(match[1] ?? '')) return true
  }
  return false
}

/** Complete open+close with text OR meaningful child tags. */
function hasCompleteWithContent(html: string, tag: string): boolean {
  return eachClosedTag(html, tag, (inner) => textOnly(inner).length > 0 || hasChildElement(inner))
}

/** Complete open+close with real text content (not empty). */
function hasCompleteWithText(html: string, tag: string): boolean {
  return eachClosedTag(html, tag, (inner) => textOnly(inner).length > 0)
}

/** Parent fully closed and contains a complete child with content/text. */
function hasNestedComplete(
  html: string,
  parent: string,
  child: string,
  childNeedsText = true,
): boolean {
  return eachClosedTag(html, parent, (inner) => {
    if (childNeedsText) return hasCompleteWithText(inner, child) || hasCompleteWithContent(inner, child)
    return eachClosedTag(inner, child, () => true)
  })
}

/** Void / self-closing style tags in source (img, br, hr, input, meta...). */
function hasVoidTag(html: string, tag: string, attrPattern?: RegExp): boolean {
  const re = new RegExp(`<${tag}\\b([^>]*)/?>`, 'gi')
  let match: RegExpExecArray | null
  while ((match = re.exec(html)) !== null) {
    const attrs = match[1] ?? ''
    if (!attrPattern || attrPattern.test(attrs)) return true
  }
  return false
}

function countClosedItemsWithText(html: string, parent: string, child: string, min: number): boolean {
  return eachClosedTag(html, parent, (inner) => {
    const re = new RegExp(`<${child}\\b[^>]*>([\\s\\S]*?)<\\/${child}\\s*>`, 'gi')
    let count = 0
    let match: RegExpExecArray | null
    while ((match = re.exec(inner)) !== null) {
      if (textOnly(match[1] ?? '').length > 0 || hasChildElement(match[1] ?? '')) count += 1
    }
    return count >= min
  })
}

function sourceHasAttr(html: string, tag: string, attrName: string, attrValue?: string): boolean {
  const re = new RegExp(`<${tag}\\b([^>]*)>`, 'gi')
  let match: RegExpExecArray | null
  while ((match = re.exec(html)) !== null) {
    const attrs = match[1] ?? ''
    if (attrValue != null) {
      const valueRe = new RegExp(
        `${attrName}\\s*=\\s*(["'])${attrValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1`,
        'i',
      )
      if (valueRe.test(attrs)) return true
    } else if (new RegExp(`\\b${attrName}\\b`, 'i').test(attrs)) {
      return true
    }
  }
  return false
}

export function validateQuest(questId: string, html: string, css?: string): ValidationOutcome {
  const doc = parseDoc(html)
  const checks: CheckResult[] = []

  const push = (id: string, passed: boolean, message: string) => {
    checks.push({ id, passed, message })
  }

  switch (questId) {
    case 'html-b01':
      push('p', hasCompleteWithText(html, 'p'), 'Write a complete <p>…</p> with real text inside.')
      break
    case 'html-b02':
      push('div', hasCompleteWithContent(html, 'div'), 'Add a complete <div>…</div> (must close the tag).')
      push('p', hasNestedComplete(html, 'div', 'p'), 'Put a complete <p> with text inside that div.')
      break
    case 'html-b03':
      push('h1', hasCompleteWithText(html, 'h1'), 'Add a complete <h1>…</h1> with title text.')
      push('p', hasCompleteWithText(html, 'p'), 'Also add a complete <p>…</p> with text.')
      break
    case 'html-b04':
      push('h1', hasCompleteWithText(html, 'h1'), 'Include a complete <h1> with text.')
      push('h2', hasCompleteWithText(html, 'h2'), 'Include a complete <h2> with text.')
      push('h3', hasCompleteWithText(html, 'h3'), 'Include a complete <h3> with text.')
      push('p', hasCompleteWithText(html, 'p'), 'Include a complete <p> with text.')
      break
    case 'html-b05':
      push('ul', countClosedItemsWithText(html, 'ul', 'li', 2), 'Add complete <ul> with 2+ <li> items that have text.')
      break
    case 'html-b06':
      push('ol', countClosedItemsWithText(html, 'ol', 'li', 2), 'Add complete <ol> with 2+ <li> items that have text.')
      break
    case 'html-b07':
      push(
        'strong',
        eachClosedTag(html, 'p', (inner) => hasCompleteWithText(inner, 'strong')),
        'Use complete <strong>…</strong> with text inside a <p>.',
      )
      push(
        'em',
        eachClosedTag(html, 'p', (inner) => hasCompleteWithText(inner, 'em')),
        'Use complete <em>…</em> with text inside a <p>.',
      )
      break
    case 'html-b08':
      push(
        'span',
        eachClosedTag(html, 'p', (inner) => hasCompleteWithText(inner, 'span') || hasCompleteWithContent(inner, 'span')),
        'Put a complete <span>…</span> inside a <p>.',
      )
      break
    case 'html-b09':
      push(
        'a',
        eachClosedTag(html, 'a', (inner) => {
          return textOnly(inner).length > 0
        }) && sourceHasAttr(html, 'a', 'href', 'https://example.com'),
        'Add complete <a href="https://example.com">link text</a>.',
      )
      break
    case 'html-b10':
      push(
        'img',
        hasVoidTag(html, 'img', /\bsrc\s*=/i) && hasVoidTag(html, 'img', /\balt\s*=/i),
        'Add <img> with both src and alt attributes.',
      )
      break
    case 'html-b11':
      push('br', eachClosedTag(html, 'p', (inner) => /<br\b[^>]*>/i.test(inner)), 'Use <br> inside a complete <p>.')
      push('hr', hasVoidTag(html, 'hr'), 'Add an <hr> divider.')
      break
    case 'html-b12':
      push('comment', hasComment(html), 'Include an HTML comment <!-- ... -->.')
      push('p', hasCompleteWithText(html, 'p'), 'Include a complete visible <p> with text.')
      break
    case 'html-b13':
      push('id', /<[A-Za-z][^>]*\bid\s*=\s*["'][^"']+["'][^>]*>/i.test(html), 'Give an element an id="...".')
      push(
        'class',
        /<[A-Za-z][^>]*\bclass\s*=\s*["'][^"']+["'][^>]*>/i.test(html),
        'Give an element a class="...".',
      )
      break
    case 'html-b14':
      push('bq', hasCompleteWithContent(html, 'blockquote'), 'Add a complete <blockquote>…</blockquote> with content.')
      push('cite', hasCompleteWithText(html, 'cite'), 'Add a complete <cite>…</cite> with text.')
      break
    case 'html-b15':
      push('code', hasCompleteWithText(html, 'code') || hasCompleteWithContent(html, 'code'), 'Include complete <code>…</code>.')
      push('pre', hasCompleteWithContent(html, 'pre'), 'Include complete <pre>…</pre>.')
      break
    case 'html-b-boss':
      push('h1', hasCompleteWithText(html, 'h1'), 'Include complete <h1> with text.')
      push('h2', hasCompleteWithText(html, 'h2'), 'Include complete <h2> with text.')
      push(
        'emph',
        eachClosedTag(
          html,
          'p',
          (inner) => hasCompleteWithText(inner, 'strong') || hasCompleteWithText(inner, 'em'),
        ),
        'Include a <p> with complete <strong> or <em> text.',
      )
      push('ul', countClosedItemsWithText(html, 'ul', 'li', 2), 'Include <ul> with 2+ text <li> items.')
      push(
        'a',
        eachClosedTag(html, 'a', (inner) => textOnly(inner).length > 0) && sourceHasAttr(html, 'a', 'href'),
        'Include a complete link with href and text.',
      )
      push('img', hasVoidTag(html, 'img', /\bsrc\s*=/i) && hasVoidTag(html, 'img', /\balt\s*=/i), 'Include <img> with src and alt.')
      push('comment', hasComment(html), 'Include an HTML comment.')
      break

    case 'html-i01':
      push('header', hasCompleteWithContent(html, 'header'), 'Add complete <header>…</header> with content inside.')
      push('main', hasCompleteWithContent(html, 'main'), 'Add complete <main>…</main> with content inside.')
      break
    case 'html-i02':
      push(
        'nav',
        eachClosedTag(html, 'nav', (inner) =>
          eachClosedTag(inner, 'a', (aInner) => textOnly(aInner).length > 0),
        ) && /<nav\b[\s\S]*?<a\b[^>]*href\s*=/i.test(html),
        'Add complete <nav>…</nav> with at least one <a href="...">link text</a>.',
      )
      push('footer', hasCompleteWithContent(html, 'footer'), 'Add complete <footer>…</footer> with content.')
      break
    case 'html-i03':
      push('section', hasCompleteWithContent(html, 'section'), 'Include complete <section>…</section> with content.')
      push('article', hasCompleteWithContent(html, 'article'), 'Include complete <article>…</article> with content.')
      break
    case 'html-i04':
      push('aside', hasCompleteWithText(html, 'aside') || hasCompleteWithContent(html, 'aside'), 'Add complete <aside> with some text/content.')
      break
    case 'html-i05':
      push(
        'figimg',
        eachClosedTag(html, 'figure', (inner) => hasVoidTag(inner, 'img', /\bsrc\s*=/i)),
        'figure must contain an <img src="...">.',
      )
      push(
        'figcap',
        eachClosedTag(html, 'figure', (inner) => hasCompleteWithText(inner, 'figcaption')),
        'figure must contain complete <figcaption> with text.',
      )
      break
    case 'html-i06':
      push('form', hasCompleteWithContent(html, 'form'), 'Add a complete <form>…</form>.')
      push(
        'input',
        eachClosedTag(html, 'form', (inner) => hasVoidTag(inner, 'input', /type\s*=\s*(["'])text\1/i)),
        'Add <input type="text"> inside the form.',
      )
      break
    case 'html-i07':
      push(
        'input',
        eachClosedTag(html, 'form', (inner) => hasVoidTag(inner, 'input', /type\s*=\s*(["'])text\1/i)),
        'Form with text input.',
      )
      push(
        'label',
        eachClosedTag(html, 'form', (inner) => hasCompleteWithText(inner, 'label')),
        'Include a complete <label> with text inside the form.',
      )
      push(
        'submit',
        /<button\b[^>]*type\s*=\s*(["'])submit\1[^>]*>[\s\S]*?<\/button>/i.test(html),
        'Include complete <button type="submit">…</button>.',
      )
      break
    case 'html-i08':
      push('email', hasVoidTag(html, 'input', /type\s*=\s*(["'])email\1/i), 'Include <input type="email">.')
      push('pass', hasVoidTag(html, 'input', /type\s*=\s*(["'])password\1/i), 'Include <input type="password">.')
      break
    case 'html-i09':
      push('ta', /<textarea\b[^>]*>[\s\S]*?<\/textarea>/i.test(html), 'Add a complete <textarea>…</textarea>.')
      push(
        'select',
        eachClosedTag(html, 'select', (inner) => (inner.match(/<option\b/gi) ?? []).length >= 2),
        'Add complete <select> with 2+ <option> items.',
      )
      break
    case 'html-i10': {
      push('cb', hasVoidTag(html, 'input', /type\s*=\s*(["'])checkbox\1/i), 'Add a checkbox input.')
      const radioRe = /<input\b[^>]*type\s*=\s*(["'])radio\1[^>]*>/gi
      const radios = html.match(radioRe) ?? []
      const names = radios
        .map((tag) => tag.match(/\bname\s*=\s*(["'])([^"']+)\1/i)?.[2])
        .filter(Boolean) as string[]
      const shared = names.some((n) => names.filter((x) => x === n).length >= 2)
      push('radio', radios.length >= 2 && shared, 'Add 2+ radios sharing the same name=.')
      break
    }
    case 'html-i11':
      push(
        'fs',
        eachClosedTag(html, 'fieldset', (inner) => hasCompleteWithText(inner, 'legend')),
        'Add complete <fieldset> with <legend> text inside.',
      )
      break
    case 'html-i12':
      push(
        'rows',
        eachClosedTag(html, 'table', (inner) => (inner.match(/<tr\b/gi) ?? []).length >= 2),
        'Table needs at least 2 complete rows.',
      )
      push('td', eachClosedTag(html, 'table', (inner) => /<td\b/i.test(inner)), 'Include <td> cells inside the table.')
      break
    case 'html-i13':
      push(
        'thead',
        eachClosedTag(html, 'thead', (inner) => /<th\b/i.test(inner)),
        'Include complete <thead> with <th>.',
      )
      push(
        'tbody',
        eachClosedTag(html, 'tbody', (inner) => /<td\b/i.test(inner)),
        'Include complete <tbody> with <td>.',
      )
      break
    case 'html-i14':
      push(
        'video',
        /<video\b[^>]*\bcontrols\b[^>]*>[\s\S]*?<\/video>/i.test(html) ||
          /<video\b[^>]*\bcontrols\b[^>]*\/?>/i.test(html),
        'Add <video controls>…</video>.',
      )
      push(
        'audio',
        /<audio\b[^>]*\bcontrols\b[^>]*>[\s\S]*?<\/audio>/i.test(html) ||
          /<audio\b[^>]*\bcontrols\b[^>]*\/?>/i.test(html),
        'Add <audio controls>…</audio>.',
      )
      break
    case 'html-i15':
      push(
        'details',
        eachClosedTag(html, 'details', (inner) => hasCompleteWithText(inner, 'summary')),
        'Add complete <details> with <summary> text.',
      )
      break
    case 'html-i-boss':
      push('header', hasCompleteWithContent(html, 'header'), 'Include a complete header section.')
      push(
        'nav',
        eachClosedTag(html, 'nav', (inner) =>
          eachClosedTag(inner, 'a', (a) => textOnly(a).length > 0),
        ) && /<nav\b[\s\S]*?<a\b[^>]*href\s*=/i.test(html),
        'Include nav with a real link.',
      )
      push('main', hasCompleteWithContent(html, 'main'), 'Include a complete main section.')
      push('footer', hasCompleteWithContent(html, 'footer'), 'Include a complete footer.')
      push(
        'sec',
        hasCompleteWithContent(html, 'section') || hasCompleteWithContent(html, 'article'),
        'Include complete section or article with content.',
      )
      push(
        'label',
        eachClosedTag(html, 'form', (inner) => hasCompleteWithText(inner, 'label')),
        'Form with a complete label.',
      )
      push(
        'input',
        eachClosedTag(html, 'form', (inner) => hasVoidTag(inner, 'input')),
        'Form with a text input.',
      )
      push(
        'submit',
        /<button\b[^>]*type\s*=\s*(["'])submit\1[^>]*>[\s\S]*?<\/button>/i.test(html),
        'Submit button with type="submit".',
      )
      push(
        'extra',
        hasCompleteWithContent(html, 'table') || hasCompleteWithContent(html, 'figure'),
        'Include a complete table OR figure.',
      )
      break

    case 'html-e01':
      push('html', /<html\b[^>]*>[\s\S]*<\/html>/i.test(html), 'Include complete <html>…</html>.')
      push(
        'body',
        eachClosedTag(html, 'body', (inner) => hasChildElement(inner) || textOnly(inner).length > 0),
        'body needs at least one child/content.',
      )
      break
    case 'html-e02':
      push('head', /<head\b[^>]*>[\s\S]*<\/head>/i.test(html), 'Include complete <head>…</head>.')
      push('title', hasCompleteWithText(html, 'title'), 'Include complete <title> text in head.')
      break
    case 'html-e03':
      push('lang', /<html\b[^>]*\blang\s*=\s*["'][^"']+["']/i.test(html), 'Set lang on <html> (e.g. lang="en").')
      break
    case 'html-e04':
      push(
        'desc',
        /<meta\b[^>]*name\s*=\s*(["'])description\1[^>]*content\s*=\s*(["'])[^"']+\2/i.test(html) ||
          /<meta\b[^>]*content\s*=\s*(["'])[^"']+\1[^>]*name\s*=\s*(["'])description\2/i.test(html),
        'Add meta name="description" with a content value.',
      )
      break
    case 'html-e05': {
      const tag = html.match(/<meta\b[^>]*name\s*=\s*(["'])viewport\1[^>]*>/i)?.[0] ?? ''
      push('vp', /width\s*=\s*device-width/i.test(tag), 'viewport meta must include width=device-width.')
      break
    }
    case 'html-e06':
      push(
        'charset',
        /<meta\b[^>]*charset\s*=\s*(["']?)utf-8\1/i.test(html),
        'Add <meta charset="UTF-8">.',
      )
      break
    case 'html-e07': {
      const labels = [...doc.querySelectorAll('label[for]')]
      const ok = labels.some((l) => {
        const id = l.getAttribute('for')
        return Boolean(id && doc.getElementById(id) && textOnly(l.textContent ?? '').length > 0)
      })
      push('forid', ok && /<label\b[^>]*for\s*=/i.test(html), 'label for= must match an input id=, with label text.')
      break
    }
    case 'html-e08':
      push('req', hasVoidTag(html, 'input', /\brequired\b/i), 'Add input with required.')
      push('ph', hasVoidTag(html, 'input', /\bplaceholder\s*=/i), 'Add input with placeholder.')
      break
    case 'html-e09':
      push('aria', /<[A-Za-z][^>]*\baria-label\s*=\s*["'][^"']+["']/i.test(html), 'Add an element with aria-label="...".')
      break
    case 'html-e10':
      push('role', /<[A-Za-z][^>]*\brole\s*=\s*["'][^"']+["']/i.test(html), 'Add an element with role="...".')
      break
    case 'html-e11':
      push(
        'source',
        eachClosedTag(html, 'picture', (inner) => /<source\b/i.test(inner)),
        'picture needs a <source>.',
      )
      push(
        'img',
        eachClosedTag(html, 'picture', (inner) => hasVoidTag(inner, 'img', /\balt\s*=/i)),
        'picture needs fallback <img> with alt.',
      )
      break
    case 'html-e12':
      push(
        'time',
        eachClosedTag(html, 'time', (inner) => textOnly(inner).length > 0) &&
          /<time\b[^>]*\bdatetime\s*=/i.test(html),
        'Add complete <time datetime="...">text</time>.',
      )
      push('addr', hasCompleteWithContent(html, 'address'), 'Add complete <address>…</address>.')
      break
    case 'html-e13':
      push('progress', /<progress\b[^>]*>/i.test(html), 'Add a <progress> element.')
      push('meter', /<meter\b[^>]*>/i.test(html), 'Add a <meter> element.')
      break
    case 'html-e14': {
      const list = doc.querySelector('input[list]')
      const listId = list?.getAttribute('list')
      const dl = listId ? doc.getElementById(listId) : null
      push(
        'dl',
        Boolean(list && dl && dl.tagName.toLowerCase() === 'datalist') &&
          /<input\b[^>]*\blist\s*=/i.test(html) &&
          /<datalist\b[^>]*\bid\s*=/i.test(html),
        'Connect input list= to a datalist id=.',
      )
      push(
        'opts',
        eachClosedTag(html, 'datalist', (inner) => /<option\b/i.test(inner)),
        'datalist needs options.',
      )
      break
    }
    case 'html-e15':
      push(
        'ogt',
        /<meta\b[^>]*property\s*=\s*(["'])og:title\1[^>]*content\s*=\s*(["'])[^"']+\2/i.test(html) ||
          /<meta\b[^>]*content\s*=\s*(["'])[^"']+\1[^>]*property\s*=\s*(["'])og:title\2/i.test(html),
        'Add og:title meta with content.',
      )
      push(
        'ogd',
        /<meta\b[^>]*property\s*=\s*(["'])og:description\1[^>]*content\s*=\s*(["'])[^"']+\2/i.test(html) ||
          /<meta\b[^>]*content\s*=\s*(["'])[^"']+\1[^>]*property\s*=\s*(["'])og:description\2/i.test(html),
        'Add og:description meta with content.',
      )
      break
    case 'html-village-boss': {
      push('html', /<html\b[^>]*>[\s\S]*<\/html>/i.test(html), 'Include complete html document root.')
      push('lang', /<html\b[^>]*\blang\s*=\s*["'][^"']+["']/i.test(html), 'html needs lang="...".')
      push('head', /<head\b[^>]*>[\s\S]*<\/head>/i.test(html), 'Include complete head.')
      push('body', /<body\b[^>]*>[\s\S]*<\/body>/i.test(html), 'Include complete body.')
      push('charset', /<meta\b[^>]*charset\s*=\s*(["']?)utf-8\1/i.test(html), 'Include charset meta.')
      {
        const tag = html.match(/<meta\b[^>]*name\s*=\s*(["'])viewport\1[^>]*>/i)?.[0] ?? ''
        push('vp', /width\s*=\s*device-width/i.test(tag), 'Include viewport meta.')
      }
      push('title', hasCompleteWithText(html, 'title'), 'Include title text.')
      push(
        'desc',
        /name\s*=\s*(["'])description\1[^>]*content\s*=\s*(["'])[^"']+\2/i.test(html) ||
          /content\s*=\s*(["'])[^"']+\1[^>]*name\s*=\s*(["'])description\2/i.test(html),
        'Include meta description with content.',
      )
      push('header', hasCompleteWithContent(html, 'header'), 'Include a complete header section.')
      push(
        'nav',
        eachClosedTag(html, 'nav', (inner) => eachClosedTag(inner, 'a', (a) => textOnly(a).length > 0)),
        'Include nav with link text.',
      )
      push('main', hasCompleteWithContent(html, 'main'), 'Include a complete main section.')
      push('footer', hasCompleteWithContent(html, 'footer'), 'Include a complete footer.')
      {
        const labels = [...doc.querySelectorAll('label[for]')]
        const ok = labels.some((l) => {
          const id = l.getAttribute('for')
          return Boolean(id && doc.getElementById(id))
        })
        push('a11y', ok, 'Accessible label for/id pair.')
      }
      push('input', hasVoidTag(html, 'input'), 'Include an input.')
      push('submit', /<button\b[^>]*type\s*=\s*(["'])submit\1/i.test(html), 'Include submit button.')
      push(
        'media',
        hasVoidTag(html, 'img', /\balt\s*=/i) || hasCompleteWithContent(html, 'figure'),
        'Include img[alt] or figure.',
      )
      push(
        'adv',
        /<(time|progress|details|picture)\b/i.test(html),
        'Include time, progress, details, OR picture.',
      )
      break
    }

    case 'css-forest-1': {
      const sheet = css ?? ''
      checks.push({
        id: 'body-bg',
        passed: /body\s*\{[^}]*background(-color)?\s*:/i.test(sheet),
        message: 'Set background on body { }',
      })
      checks.push({
        id: 'h1-color',
        passed: /h1\s*\{[^}]*color\s*:/i.test(sheet),
        message: 'Set color on h1 { }',
      })
      break
    }
    case 'css-forest-boss': {
      const sheet = css ?? ''
      checks.push({
        id: 'flex',
        passed: /\.grove\s*\{[^}]*display\s*:\s*flex/i.test(sheet),
        message: 'Use display: flex on .grove',
      })
      checks.push({
        id: 'spacing',
        passed: /\.grove\s*\{[^>]*(gap|margin)/i.test(sheet) || /\.stone\s*\{[^}]*margin/i.test(sheet),
        message: 'Add gap or margin for spacing.',
      })
      break
    }
    default:
      checks.push({ id: 'unknown', passed: false, message: 'Quest not found — refresh the page.' })
  }

  return {
    passed: checks.length > 0 && checks.every((c) => c.passed),
    results: checks,
  }
}

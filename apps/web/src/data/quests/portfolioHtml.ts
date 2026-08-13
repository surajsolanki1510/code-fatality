/** Portfolio HTML grows each chapter — user styles it with CSS. */

export const P_EMPTY = `<!-- This HTML file IS your portfolio website. Build it here. -->
`

export const P_SHELL = `<div class="portfolio">
  <header class="hero">
    <h1 class="name">{{NAME}}</h1>
    <p class="tagline">{{TAGLINE}}</p>
  </header>
</div>`

export const P_HERO_PHOTO = `<div class="portfolio">
  <header class="hero">
    <img class="avatar" src="{{PHOTO}}" alt="Profile photo" />
    <h1 class="name">{{NAME}}</h1>
    <p class="tagline">{{TAGLINE}}</p>
  </header>
</div>`

export const P_WITH_ABOUT = `<div class="portfolio">
  <header class="hero">
    <img class="avatar" src="{{PHOTO}}" alt="Profile photo" />
    <h1 class="name">{{NAME}}</h1>
    <p class="tagline">{{TAGLINE}}</p>
  </header>
  <section class="about">
    <h2>About</h2>
    <p class="bio">{{ABOUT}}</p>
  </section>
</div>`

export const P_WITH_SKILLS = `<div class="portfolio">
  <header class="hero">
    <img class="avatar" src="{{PHOTO}}" alt="Profile photo" />
    <h1 class="name">{{NAME}}</h1>
    <p class="tagline">{{TAGLINE}}</p>
  </header>
  <section class="about">
    <h2>About</h2>
    <p class="bio">{{ABOUT}}</p>
  </section>
  <section class="skills">
    <h2>Skills</h2>
    <div class="skill-row">
      <span class="skill">HTML</span>
      <span class="skill">CSS</span>
      <span class="skill">JavaScript</span>
    </div>
  </section>
</div>`

export const P_WITH_PROJECTS = `<div class="portfolio">
  <header class="hero">
    <img class="avatar" src="{{PHOTO}}" alt="Profile photo" />
    <h1 class="name">{{NAME}}</h1>
    <p class="tagline">{{TAGLINE}}</p>
  </header>
  <section class="about">
    <h2>About</h2>
    <p class="bio">{{ABOUT}}</p>
  </section>
  <section class="skills">
    <h2>Skills</h2>
    <div class="skill-row">
      <span class="skill">HTML</span>
      <span class="skill">CSS</span>
      <span class="skill">JavaScript</span>
    </div>
  </section>
  <section class="projects">
    <h2>Projects</h2>
    <div class="project-grid">
      <article class="project-card"><h3>Project One</h3><p>My first build</p></article>
      <article class="project-card"><h3>Project Two</h3><p>Team app</p></article>
      <article class="project-card"><h3>Project Three</h3><p>Design system</p></article>
    </div>
  </section>
</div>`

export const P_FULL = `<div class="portfolio">
  <header class="hero">
    <img class="avatar" src="{{PHOTO}}" alt="Profile photo" />
    <h1 class="name">{{NAME}}</h1>
    <p class="tagline">{{TAGLINE}}</p>
  </header>
  <section class="about">
    <h2>About</h2>
    <p class="bio">{{ABOUT}}</p>
  </section>
  <section class="skills">
    <h2>Skills</h2>
    <div class="skill-row">
      <span class="skill">HTML</span>
      <span class="skill">CSS</span>
      <span class="skill">JavaScript</span>
    </div>
  </section>
  <section class="projects">
    <h2>Projects</h2>
    <div class="project-grid">
      <article class="project-card"><h3>Project One</h3><p>My first build</p></article>
      <article class="project-card"><h3>Project Two</h3><p>Team app</p></article>
      <article class="project-card"><h3>Project Three</h3><p>Design system</p></article>
    </div>
  </section>
  <footer class="contact">
    <p>Let's build together</p>
    <a class="contact-link" href="mailto:hello@you.dev">hello@you.dev</a>
  </footer>
</div>`

export const PORTFOLIO_SECTIONS = ['Hero', 'About', 'Skills', 'Projects', 'Contact'] as const

export function sectionsUnlocked(chapter: number): string[] {
  if (chapter >= 36) return [...PORTFOLIO_SECTIONS]
  if (chapter >= 29) return ['Hero', 'About', 'Skills', 'Projects', 'Contact']
  if (chapter >= 14) return ['Hero', 'About', 'Skills', 'Projects']
  if (chapter >= 10) return ['Hero', 'About', 'Skills']
  if (chapter >= 7) return ['Hero', 'About']
  if (chapter >= 2) return ['Hero']
  return ['Shell']
}

function hasClass(html: string, className: string) {
  return new RegExp(`class=["'][^"']*\\b${className}\\b`, 'i').test(html)
}

function extractBlock(html: string, tag: string, className: string): string | null {
  const re = new RegExp(
    `<${tag}\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/${tag}>`,
    'i',
  )
  return html.match(re)?.[0] ?? null
}

function insertBeforePortfolioClose(html: string, snippet: string): string {
  const close = html.lastIndexOf('</div>')
  if (close === -1) return `${html.trim()}\n${snippet}\n`
  return `${html.slice(0, close)}  ${snippet}\n${html.slice(close)}`
}

function isBlankPortfolio(html: string) {
  const stripped = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<p>\s*My portfolio\s*<\/p>/gi, '').trim()
  return stripped.length === 0
}

/** Keep the player's own HTML/CSS. Only add new sections the next level needs to style. */
export function continuePortfolioFiles(
  savedHtml: string,
  savedCss: string,
  starterHtml: string,
  starterCss: string,
): { html: string; css: string } {
  const html = !isBlankPortfolio(savedHtml) ? mergeMissingSections(savedHtml, starterHtml) : starterHtml
  const cssBody = savedCss.replace(/\/\*[\s\S]*?\*\//g, '').trim()
  const css = cssBody.length > 0 ? savedCss : starterCss
  return { html, css }
}

function mergeMissingSections(userHtml: string, starterHtml: string): string {
  let out = userHtml
  for (const name of ['about', 'skills', 'projects'] as const) {
    if (hasClass(out, name)) continue
    const snippet = extractBlock(starterHtml, 'section', name)
    if (snippet) out = insertBeforePortfolioClose(out, snippet)
  }
  if (!hasClass(out, 'contact')) {
    const footer = extractBlock(starterHtml, 'footer', 'contact')
    if (footer) out = insertBeforePortfolioClose(out, footer)
  }
  if (hasClass(starterHtml, 'avatar') && !hasClass(out, 'avatar') && hasClass(out, 'hero')) {
    out = out.replace(
      /(<header\b[^>]*class=["'][^"']*\bhero\b[^>]*>)/i,
      `$1\n    <img class="avatar" src="{{PHOTO}}" alt="Profile photo" />`,
    )
  }
  return out
}

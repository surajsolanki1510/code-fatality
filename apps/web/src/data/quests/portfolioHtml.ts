/** Portfolio HTML grows each chapter — user styles it with CSS. */

export const P_EMPTY = `<!-- Your portfolio starts here -->
<p>My portfolio</p>`

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

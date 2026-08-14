import { injectPortfolioHtml, type PortfolioProfile } from '../store/portfolioStore'

/** Build a single hire-ready HTML file from the player's portfolio. */
export function buildPortfolioDownload(html: string, css: string, profile: PortfolioProfile): string {
  const body = injectPortfolioHtml(html, profile)
  const title = profile.name && profile.name !== 'Your Name' ? `${profile.name} · Portfolio` : 'My Portfolio'
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <style>
/* Built with Code Fatality · Portfolio Forge */
*, *::before, *::after { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, Segoe UI, sans-serif; }
${css}
  </style>
</head>
<body>
${body}
</body>
</html>
`
}

export function downloadTextFile(filename: string, content: string, mime = 'text/html') {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadPortfolioFiles(html: string, css: string, profile: PortfolioProfile) {
  const slug = (profile.name || 'portfolio')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'portfolio'
  downloadTextFile(`${slug}.html`, buildPortfolioDownload(html, css, profile))
  downloadTextFile('styles.css', `/* ${profile.name} portfolio stylesheet */\n${css}\n`, 'text/css')
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export const GITHUB_PAGES_STEPS = [
  'Create a free GitHub account at github.com',
  'New repository named yourname.github.io (or any name)',
  'Upload your downloaded .html (rename to index.html) and styles.css',
  'Repo Settings → Pages → Deploy from branch → main → / (root)',
  'Wait ~1 minute — your live URL appears on the Pages settings screen',
]

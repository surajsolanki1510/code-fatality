import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type PortfolioProfile = {
  name: string
  tagline: string
  about: string
  photoDataUrl: string | null
  siteHtml: string
  siteCss: string
}

export const DEFAULT_AVATAR =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect fill="#e8ddd4" width="120" height="120"/><circle cx="60" cy="48" r="22" fill="#c4b5bc"/><ellipse cx="60" cy="98" rx="34" ry="26" fill="#c4b5bc"/></svg>`,
  )

const DEFAULT: PortfolioProfile = {
  name: 'Your Name',
  tagline: 'Future developer · CSS learner',
  about: 'I build beautiful things on the web. This portfolio is proof.',
  photoDataUrl: null,
  siteHtml: '',
  siteCss: '',
}

type PortfolioState = PortfolioProfile & {
  setName: (name: string) => void
  setTagline: (tagline: string) => void
  setAbout: (about: string) => void
  setPhoto: (dataUrl: string | null) => void
  saveSite: (html: string, css: string) => void
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      ...DEFAULT,
      setName: (name) => set({ name: name.trim() || DEFAULT.name }),
      setTagline: (tagline) => set({ tagline: tagline.trim() || DEFAULT.tagline }),
      setAbout: (about) => set({ about: about.trim() || DEFAULT.about }),
      setPhoto: (photoDataUrl) => set({ photoDataUrl }),
      saveSite: (siteHtml, siteCss) => set({ siteHtml, siteCss }),
    }),
    { name: 'code-fatality-portfolio' },
  ),
)

/** Replace profile placeholders in portfolio HTML before preview. */
export function injectPortfolioHtml(html: string, profile: PortfolioProfile): string {
  const photo = profile.photoDataUrl || DEFAULT_AVATAR
  return html
    .replace(/\{\{PHOTO\}\}/g, photo)
    .replace(/\{\{NAME\}\}/g, profile.name)
    .replace(/\{\{TAGLINE\}\}/g, profile.tagline)
    .replace(/\{\{ABOUT\}\}/g, profile.about)
}

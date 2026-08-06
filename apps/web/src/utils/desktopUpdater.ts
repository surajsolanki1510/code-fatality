import { isNativeApp } from './platform'

const RELEASES_LATEST_URL = 'https://api.github.com/repos/surajsolanki1510/code-fatality/releases/latest'
const PROMPTED_BUILD_KEY = 'cf-update-prompted-build'

type LatestRelease = {
  tag_name?: string
  html_url?: string
}

function isTauriDesktop() {
  return isNativeApp() && (navigator.userAgent.includes('Tauri') || '__TAURI_INTERNALS__' in window)
}

function parseBuildNumber(tagName?: string) {
  if (!tagName) return null
  const match = /^build-(\d+)$/.exec(tagName.trim())
  if (!match) return null
  return Number(match[1])
}

export async function checkDesktopUpdate() {
  if (!isTauriDesktop()) return

  const currentBuildRaw = import.meta.env.VITE_DESKTOP_BUILD
  const currentBuild = Number(currentBuildRaw)
  if (!Number.isFinite(currentBuild) || currentBuild <= 0) return

  try {
    const response = await fetch(RELEASES_LATEST_URL, {
      headers: { Accept: 'application/vnd.github+json' },
    })
    if (!response.ok) return

    const latest = (await response.json()) as LatestRelease
    const latestBuild = parseBuildNumber(latest.tag_name)
    if (!latestBuild || latestBuild <= currentBuild) return

    const promptedBuild = Number(localStorage.getItem(PROMPTED_BUILD_KEY))
    if (Number.isFinite(promptedBuild) && promptedBuild >= latestBuild) return

    const shouldOpen = window.confirm(
      `New CODE FATALITY update available (build ${latestBuild}).\n\n` +
        `You are on build ${currentBuild}. Download and install now?`,
    )

    localStorage.setItem(PROMPTED_BUILD_KEY, String(latestBuild))

    if (shouldOpen && latest.html_url) {
      window.open(latest.html_url, '_blank', 'noopener,noreferrer')
    }
  } catch {
    // Silent failure keeps gameplay uninterrupted when offline or rate-limited.
  }
}

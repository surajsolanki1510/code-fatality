import { Capacitor } from '@capacitor/core'

export function isNativeApp() {
  if (typeof window === 'undefined') return false

  try {
    if (Capacitor.isNativePlatform()) return true
  } catch {
    // ignore if Capacitor bridge is unavailable
  }

  const win = window as Window & {
    __TAURI_INTERNALS__?: unknown
  }

  if (navigator.userAgent.includes('Tauri') || '__TAURI_INTERNALS__' in win) {
    return true
  }

  if (/Capacitor/i.test(navigator.userAgent)) {
    return true
  }

  return false
}

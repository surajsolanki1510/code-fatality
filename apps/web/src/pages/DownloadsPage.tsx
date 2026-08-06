import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const RELEASES = 'https://github.com/surajsolanki1510/code-fatality/releases'

export function DownloadsPage() {
  return (
    <div className="downloads-page">
      <Link to="/" className="downloads-page__back">
        ← Back
      </Link>
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        DOWNLOAD
      </motion.h1>
      <p className="downloads-page__sub">
        Free installs. No Play Store / App Store fee in this phase — grab the build from GitHub Releases.
      </p>

      <div className="downloads-grid">
        <a className="downloads-card" href={RELEASES} target="_blank" rel="noreferrer">
          <strong>Android APK</strong>
          <span>Install on phone (allow unknown apps)</span>
        </a>
        <a className="downloads-card" href={RELEASES} target="_blank" rel="noreferrer">
          <strong>Windows EXE</strong>
          <span>Desktop installer for PC</span>
        </a>
        <a className="downloads-card downloads-card--muted" href="https://code-fatality.vercel.app" target="_blank" rel="noreferrer">
          <strong>Play in Browser</strong>
          <span>Works now on any device</span>
        </a>
      </div>

      <p className="downloads-page__note">
        iOS App Store build needs a Mac + Apple Developer account — not free. Android + Windows downloads are free via Releases.
      </p>
    </div>
  )
}

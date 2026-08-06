import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const LATEST = 'https://github.com/surajsolanki1510/code-fatality/releases/latest/download'
const RELEASES = 'https://github.com/surajsolanki1510/code-fatality/releases/latest'

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
        Free installs for everyone. Download the latest Android or Windows build — no store account needed.
      </p>

      <div className="downloads-grid">
        <a
          className="downloads-card"
          href={`${LATEST}/CODE-FATALITY-android.apk`}
          target="_blank"
          rel="noreferrer"
        >
          <strong>Android APK</strong>
          <span>Tap to download · allow unknown apps</span>
        </a>
        <a
          className="downloads-card"
          href={`${LATEST}/CODE-FATALITY-windows-setup.exe`}
          target="_blank"
          rel="noreferrer"
        >
          <strong>Windows EXE</strong>
          <span>Desktop installer for PC</span>
        </a>
        <a
          className="downloads-card"
          href={`${LATEST}/CODE-FATALITY-windows.msi`}
          target="_blank"
          rel="noreferrer"
        >
          <strong>Windows MSI</strong>
          <span>Alternative Windows installer</span>
        </a>
        <a className="downloads-card downloads-card--muted" href="https://code-fatality.vercel.app/" rel="noreferrer">
          <strong>Play in Browser</strong>
          <span>Works now on any device</span>
        </a>
      </div>

      <p className="downloads-page__note">
        Having trouble? Open the{' '}
        <a href={RELEASES} target="_blank" rel="noreferrer">
          latest GitHub release
        </a>{' '}
        and download from Assets. iOS App Store builds need a paid Apple Developer account.
      </p>
    </div>
  )
}

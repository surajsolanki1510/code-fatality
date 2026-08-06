import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArenaButton, ArenaShell } from '../components/ArenaShell'
import { BRAND } from '../config/brand'
import { useProgressStore } from '../store/progressStore'

export function LandingPage() {
  const navigate = useNavigate()
  const completed = useProgressStore((s) => s.completedQuestIds.length)
  const user = useProgressStore((s) => s.user)
  const isRegistered = Boolean(user && !user.isGuest)

  useEffect(() => {
    document.documentElement.classList.add('landing-lock')
    return () => document.documentElement.classList.remove('landing-lock')
  }, [])

  return (
    <ArenaShell cinematic bgImage="/art/landing-arena.jpg">
      <div className="landing-hero">
        <motion.div
          className="landing-combat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          aria-hidden
        >
          <motion.div
            className="landing-fighter landing-fighter--you"
            initial={{ x: -48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.45 }}
          >
            <img src="/warrior-left-cut.png" alt="" />
          </motion.div>

          <div className="landing-gutter" />

          <motion.div
            className="landing-fighter landing-fighter--fear"
            initial={{ x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.45 }}
          >
            <img src="/warrior-right-cut.png" alt="" />
          </motion.div>
        </motion.div>

        <div className="landing-copy">
          <motion.h1
            className="landing-title"
            initial={{ scale: 1.12, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 130, damping: 16, delay: 0.12 }}
          >
            <span>CODE</span>
            <span>FATALITY</span>
          </motion.h1>

          <motion.p
            className="landing-tagline"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            FACE YOUR FEAR. WRITE CODE. DOMINATE.
          </motion.p>

          <motion.div
            className="landing-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <ArenaButton
              variant="gold"
              className="arena-btn--pulse landing-cta"
              onClick={() => navigate('/map')}
            >
              {completed > 0 ? 'CONTINUE' : BRAND.pressStart}
            </ArenaButton>
            <ArenaButton variant="ghost" className="landing-cta landing-cta--auth" onClick={() => navigate('/auth')}>
              {isRegistered ? 'PROFILE' : 'LOGIN'}
            </ArenaButton>
            <ArenaButton variant="ghost" className="landing-cta landing-cta--auth" onClick={() => navigate('/download')}>
              GET APP
            </ArenaButton>
          </motion.div>
        </div>
      </div>
    </ArenaShell>
  )
}

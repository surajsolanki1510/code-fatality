import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthPage } from './pages/AuthPage'
import { DownloadsPage } from './pages/DownloadsPage'
import { LandingPage } from './pages/LandingPage'
import { NotebookPage } from './pages/NotebookPage'
import { QuestPage } from './pages/QuestPage'
import { WorldDetailPage } from './pages/WorldDetailPage'
import { WorldMapPage } from './pages/WorldMapPage'
import { useProgressStore } from './store/progressStore'
import { checkDesktopUpdate } from './utils/desktopUpdater'
import './styles/arena.css'
import './styles/learn.css'
import './styles/fatality.css'
import './styles/auth.css'
import './styles/downloads.css'

export default function App() {
  const bootProgress = useProgressStore((s) => s.bootProgress)

  useEffect(() => {
    void bootProgress()
  }, [bootProgress])

  useEffect(() => {
    void checkDesktopUpdate()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/download" element={<DownloadsPage />} />
        <Route path="/map" element={<WorldMapPage />} />
        <Route path="/world/:worldId" element={<WorldDetailPage />} />
        <Route path="/notebook/:worldId" element={<NotebookPage />} />
        <Route path="/quest/:questId" element={<QuestPage />} />
      </Routes>
    </BrowserRouter>
  )
}

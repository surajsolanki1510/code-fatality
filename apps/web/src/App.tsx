import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthPage } from './pages/AuthPage'
import { LandingPage } from './pages/LandingPage'
import { QuestPage } from './pages/QuestPage'
import { WorldDetailPage } from './pages/WorldDetailPage'
import { WorldMapPage } from './pages/WorldMapPage'
import { useProgressStore } from './store/progressStore'
import './styles/arena.css'
import './styles/learn.css'
import './styles/fatality.css'
import './styles/auth.css'

export default function App() {
  const bootProgress = useProgressStore((s) => s.bootProgress)

  useEffect(() => {
    void bootProgress()
  }, [bootProgress])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/map" element={<WorldMapPage />} />
        <Route path="/world/:worldId" element={<WorldDetailPage />} />
        <Route path="/quest/:questId" element={<QuestPage />} />
      </Routes>
    </BrowserRouter>
  )
}

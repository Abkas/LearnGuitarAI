import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Homepage'
import AnalyzerPage from './pages/Analyzer'
import PracticePage from './pages/Practice'
import ProgressPage from './pages/Progress'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/analyzer" element={<AnalyzerPage />} />
      <Route path="/practice" element={<PracticePage />} />
      <Route path="/progress" element={<ProgressPage />} />
    </Routes>
  )
}

export default App
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Homepage'
import AnalyzerPage from './pages/Analyzer'
import PracticePage from './pages/Practice'
import ProgressPage from './pages/Progress'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import Profile from './pages/Profile'
import AnalyzerResult from './pages/AnalyzerResult'
import './App.css'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyzer" element={<AnalyzerPage />} />
        <Route path="/analyzer-result" element={<AnalyzerResult/>} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
          },
          }}/>
    </>
  )
}

export default App
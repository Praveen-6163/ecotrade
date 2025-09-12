import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { AIAssistant } from './components/AIAssistant'
import { IntroAnimation } from './components/IntroAnimation'
import { Landing } from './pages/Landing'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Leaderboard } from './pages/Leaderboard'
import { useAuth } from './hooks/useAuth'
import { MessageCircle } from 'lucide-react'

function App() {
  const { loading } = useAuth()
  const [showIntroAnimation, setShowIntroAnimation] = useState(false)
  const [showAssistant, setShowAssistant] = useState(false)

  useEffect(() => {
    // Check if user has seen intro animation before
    const hasSeenIntro = localStorage.getItem('hasSeenIntroAnimation')
    if (!hasSeenIntro) {
      setShowIntroAnimation(true)
      localStorage.setItem('hasSeenIntroAnimation', 'true')
    }
  }, [])

  const handleIntroComplete = () => {
    setShowIntroAnimation(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
          
          {/* AI Assistant Toggle Button */}
          {!showAssistant && (
            <button
              onClick={() => setShowAssistant(true)}
              className="fixed bottom-4 right-4 bg-gradient-to-r from-saffron to-orange-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-40 animate-pulse-glow"
              aria-label="Open AI Assistant"
            >
              <MessageCircle className="h-6 w-6" />
            </button>
          )}
          
          {/* AI Assistant */}
          <AIAssistant 
            isVisible={showAssistant} 
            onToggle={() => setShowAssistant(!showAssistant)} 
          />
        </div>
      </div>
    )
  }

  return (
    <>
      {showIntroAnimation && (
        <IntroAnimation onComplete={handleIntroComplete} />
      )}
      
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
    </>
  )
}

export default App
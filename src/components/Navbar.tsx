import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, User, LogOut } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-soft border-b border-saffron/20 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-saffron-gradient p-3 rounded-xl group-hover:scale-110 transition-all duration-300 shadow-glow-saffron">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-gradient-saffron">
              EcoTrade
            </span>
          </Link>

          <div className="flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-saffron px-5 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:bg-saffron/10 hover:shadow-soft"
                >
                  Dashboard
                </Link>
                <Link
                  to="/leaderboard"
                  className="text-gray-700 hover:text-teal px-5 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:bg-teal/10 hover:shadow-soft"
                >
                  Leaderboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 px-5 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:bg-red-50 hover:shadow-soft"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-teal px-5 py-3 rounded-xl text-base font-semibold transition-all duration-300 hover:bg-teal/10 hover:shadow-soft"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-saffron-gradient text-white px-8 py-3 rounded-xl text-base font-bold transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-medium hover:shadow-strong btn-hover"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
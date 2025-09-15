import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Trigger fade-in animation on component mount
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
    
    setLoading(false)
  }

  const handleGoogleSignIn = () => {
    // Placeholder for Google Sign-In implementation
    console.log('Google Sign-In clicked')
    setError('Google Sign-In will be implemented soon!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600 flex items-center justify-center py-8 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-teal-300/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-10 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-float"></div>
        
        {/* Smaller decorative elements */}
        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-white/40 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-emerald-200/60 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-teal-200/50 rounded-full animate-ping delay-2000"></div>
        
        {/* Sparkle effects */}
        <div className="absolute top-32 right-1/3">
          <Sparkles className="h-6 w-6 text-white/30 animate-pulse" />
        </div>
        <div className="absolute bottom-40 left-1/5">
          <Sparkles className="h-4 w-4 text-emerald-200/40 animate-pulse delay-1500" />
        </div>
      </div>

      {/* Login Card */}
      <div className={`w-full max-w-md relative z-10 transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
      }`}>
        {/* Glassmorphism Card */}
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]">
          {/* Header Section */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-600 p-4 rounded-2xl shadow-lg animate-pulse-glow">
                <Leaf className="h-10 w-10 text-white" />
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                EcoTrade
              </span>
            </div>
            
            {/* Welcome Message */}
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              Welcome Back to EcoTrade 
              <span className="text-2xl">🌱</span>
            </h1>
            <p className="text-emerald-100 text-lg">Continue your sustainable journey</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-white/90">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-6 w-6 text-emerald-300 group-focus-within:text-emerald-200 transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl focus:ring-4 focus:ring-emerald-400/30 focus:border-emerald-300 outline-none transition-all duration-300 text-white placeholder-white/60 text-lg hover:bg-white/15 focus:bg-white/15"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-white/90">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-6 w-6 text-emerald-300 group-focus-within:text-emerald-200 transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-16 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl focus:ring-4 focus:ring-emerald-400/30 focus:border-emerald-300 outline-none transition-all duration-300 text-white placeholder-white/60 text-lg hover:bg-white/15 focus:bg-white/15"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-emerald-300 hover:text-emerald-200 transition-colors duration-300 hover:scale-110"
                >
                  {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                to="/forgot-password" 
                className="text-emerald-200 hover:text-white font-medium hover:underline transition-all duration-300 text-sm hover:scale-105 inline-block"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border-2 border-red-400/30 text-red-100 px-4 py-3 rounded-2xl text-center animate-shake">
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white py-4 rounded-2xl font-bold text-lg hover:from-emerald-600 hover:via-teal-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:shadow-2xl flex items-center justify-center space-x-3 shadow-xl hover:-translate-y-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to EcoTrade</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-6 bg-gradient-to-r from-transparent via-white/10 to-transparent text-white/80 font-medium backdrop-blur-sm rounded-full">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full bg-white/90 backdrop-blur-sm border-2 border-white/50 text-gray-700 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:border-white transition-all duration-300 flex items-center justify-center space-x-3 hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-1 shadow-lg"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </form>

          {/* Create Account Link */}
          <div className="mt-8 text-center">
            <p className="text-white/80 text-lg">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-emerald-200 font-bold hover:text-white hover:underline transition-all duration-300 hover:scale-105 inline-block"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <p className="text-sm text-white/80 font-medium">
              Secured with 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, TrendingUp, BarChart3, UserCheck, ShoppingCart, Activity } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-blue-50 pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Trade Carbon Credits.
              <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Reduce Emissions.
              </span>
              <span className="block text-green-600">
                Build a Greener Future.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Carbon credits are tradeable certificates that represent the removal of one metric ton 
              of CO₂ from the atmosphere. Join our marketplace to buy verified carbon offsets from 
              renewable energy, reforestation, and clean technology projects worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Get Started Today
              </Link>
              <Link
                to="/login"
                className="bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-200 shadow-lg"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Cards */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg animate-float">
            <div className="text-2xl font-bold text-green-600">1.2M+</div>
            <div className="text-sm text-gray-600">Tons CO₂ Offset</div>
          </div>
          <div className="absolute bottom-1/3 left-1/4 bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-lg animate-float-delayed">
            <div className="text-2xl font-bold text-blue-600">25,000+</div>
            <div className="text-sm text-gray-600">Active Traders</div>
          </div>
        </div>
      </section>

      {/* Why EcoTrade Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EcoTrade?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The most trusted platform for carbon credit trading with transparency, 
              security, and real environmental impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-600 leading-relaxed">
                Every carbon credit is verified and tracked on our secure platform. 
                View detailed project information, impact metrics, and certification details.
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Smart Trading</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced trading tools with real-time market data, price analytics, 
                and automated matching for optimal buying and selling opportunities.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Real Impact</h3>
              <p className="text-gray-600 leading-relaxed">
                Track your environmental impact with detailed analytics, progress reports, 
                and gamified achievements that showcase your contribution to the planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start trading carbon credits in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-0.5 bg-green-200 -translate-y-1/2 z-0"></div>
            
            <div className="relative z-10 text-center">
              <div className="bg-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <UserCheck className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">1. Register</h3>
              <p className="text-gray-600 leading-relaxed">
                Create your account in minutes with secure verification. 
                Complete your profile and verify your identity to start trading.
              </p>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="bg-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ShoppingCart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">2. Buy & Sell</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse verified carbon offset projects from renewable energy, 
                forestry, and clean technology initiatives. Trade with confidence.
              </p>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="bg-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Activity className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">3. Track Impact</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor your environmental impact with detailed analytics, 
                earn achievements, and compete on our global leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of environmentally conscious traders making a real impact 
            on climate change through carbon offset trading.
          </p>
          <Link
            to="/register"
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Trading Today
          </Link>
        </div>
      </section>
    </div>
  )
}
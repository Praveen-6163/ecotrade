import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, TrendingUp, BarChart3, UserCheck, ShoppingCart, Activity, Star, Users, Award, CheckCircle } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section with Indian-inspired design */}
      <section className="relative bg-gradient-to-br from-cream via-orange-50 to-saffron-50 pt-20 pb-32 overflow-hidden">
        {/* Decorative elements inspired by Indian patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border-4 border-saffron rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border-4 border-teal rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 border-4 border-royal-blue rounded-full animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Trust badges */}
            <div className="flex justify-center items-center space-x-6 mb-8">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Verified Platform</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <Shield className="h-5 w-5 text-teal" />
                <span className="text-sm font-medium text-gray-700">Secure Trading</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <Users className="h-5 w-5 text-royal-blue" />
                <span className="text-sm font-medium text-gray-700">25,000+ Users</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Trade Carbon Credits.
              <span className="block bg-gradient-to-r from-saffron via-orange-500 to-red-500 bg-clip-text text-transparent">
                Reduce Emissions.
              </span>
              <span className="block text-teal">
                Build a Greener Bharat.
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
              Carbon credits are tradeable certificates representing the removal of one metric ton 
              of CO₂ from the atmosphere. Join India's premier marketplace for verified carbon offsets 
              from renewable energy, reforestation, and clean technology projects.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                to="/register"
                className="group bg-gradient-to-r from-saffron to-orange-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-orange-500 hover:to-red-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Get Started Today</span>
                  <Activity className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </Link>
              <Link
                to="/login"
                className="group bg-white text-teal border-3 border-teal px-10 py-5 rounded-2xl font-bold text-xl hover:bg-teal hover:text-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>Login</span>
                  <TrendingUp className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </Link>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl font-bold text-saffron mb-2">12L+</div>
                <div className="text-gray-600 font-medium">Tons CO₂ Offset</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl font-bold text-teal mb-2">₹50Cr+</div>
                <div className="text-gray-600 font-medium">Credits Traded</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl font-bold text-royal-blue mb-2">500+</div>
                <div className="text-gray-600 font-medium">Green Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why EcoTrade Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose EcoTrade?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              India's most trusted platform for carbon credit trading with transparency, 
              security, and real environmental impact for a sustainable future.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group bg-gradient-to-br from-saffron-50 to-orange-50 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-saffron/20">
              <div className="bg-gradient-to-br from-saffron to-orange-500 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Every carbon credit is verified and tracked on our secure platform. 
                View detailed project information, impact metrics, and certification details 
                with complete transparency.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-teal/20">
              <div className="bg-gradient-to-br from-teal to-cyan-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Trading</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Advanced trading tools with real-time market data, price analytics in ₹, 
                and automated matching for optimal buying and selling opportunities 
                in the Indian market.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-royal-blue/20">
              <div className="bg-gradient-to-br from-royal-blue to-indigo-600 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real Impact</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Track your environmental impact with detailed analytics, progress reports, 
                and gamified achievements that showcase your contribution to India's 
                green revolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Start trading carbon credits in three simple steps and contribute to India's green future
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-1 bg-gradient-to-r from-saffron via-teal to-royal-blue -translate-y-1/2 z-0 rounded-full"></div>
            
            <div className="relative z-10 text-center">
              <div className="bg-gradient-to-br from-saffron to-orange-500 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-2xl hover:scale-110 transition-transform duration-300">
                <UserCheck className="h-12 w-12 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Register</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Create your account in minutes with secure verification. 
                  Complete your profile and verify your identity to start trading 
                  in India's carbon credit marketplace.
                </p>
              </div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="bg-gradient-to-br from-teal to-cyan-600 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-2xl hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="h-12 w-12 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Buy & Sell</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Browse verified carbon offset projects from renewable energy, 
                  forestry, and clean technology initiatives across India. 
                  Trade with confidence using ₹.
                </p>
              </div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="bg-gradient-to-br from-royal-blue to-indigo-600 rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-2xl hover:scale-110 transition-transform duration-300">
                <Activity className="h-12 w-12 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Track Impact</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Monitor your environmental impact with detailed analytics, 
                  earn achievements, and compete on our India leaderboard 
                  while contributing to a greener nation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Indian Businesses
            </h2>
            <p className="text-xl text-gray-600">
              Join leading companies making a difference in India's sustainability journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-saffron-50 to-orange-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-saffron/20">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-saffron fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                "EcoTrade has revolutionized how we approach carbon offsetting. 
                The platform is transparent, secure, and perfectly suited for Indian businesses."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-saffron to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  R
                </div>
                <div className="ml-4">
                  <div className="font-bold text-gray-900">Rajesh Kumar</div>
                  <div className="text-gray-600">CEO, GreenTech Solutions</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-teal/20">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-teal fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                "The user experience is exceptional, and the impact tracking features 
                help us demonstrate our commitment to sustainability to our stakeholders."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-teal to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  P
                </div>
                <div className="ml-4">
                  <div className="font-bold text-gray-900">Priya Sharma</div>
                  <div className="text-gray-600">Sustainability Director, EcoIndia</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-royal-blue/20">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-royal-blue fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                "EcoTrade's marketplace has made carbon credit trading accessible and 
                profitable. It's the perfect platform for India's green transition."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-royal-blue to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div className="ml-4">
                  <div className="font-bold text-gray-900">Arjun Patel</div>
                  <div className="text-gray-600">Founder, CleanEnergy Ventures</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-saffron via-orange-500 to-red-500 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 border-4 border-white rounded-full animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl md:text-2xl text-orange-100 mb-10 leading-relaxed">
            Join thousands of environmentally conscious traders making a real impact 
            on climate change through carbon offset trading. Be part of India's green revolution.
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center space-x-3 bg-white text-saffron px-12 py-6 rounded-2xl font-bold text-xl hover:bg-cream hover:scale-105 transition-all duration-300 transform hover:-translate-y-2 shadow-2xl"
          >
            <span>Start Trading Today</span>
            <Award className="h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
          </Link>
        </div>
      </section>
    </div>
  )
}
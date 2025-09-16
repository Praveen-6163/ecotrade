import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, TrendingUp, BarChart3, UserCheck, ShoppingCart, Activity, Star, Users, Award, CheckCircle, Leaf, Globe, Zap } from 'lucide-react'

export function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section with Indian-inspired design */}
      <section className="relative bg-gradient-to-br from-cream via-saffron-50 to-orange-50 pt-20 pb-32 overflow-hidden">
        {/* Decorative elements inspired by Indian patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 border-4 border-saffron rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border-4 border-teal rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 border-4 border-royal-blue rounded-full animate-pulse delay-2000"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 border-2 border-saffron/30 rounded-full animate-float"></div>
          <div className="absolute bottom-1/3 right-10 w-12 h-12 border-2 border-teal/30 rounded-full animate-float-delayed"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            {/* Trust badges with Indian context */}
            <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
              <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Government Verified</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Shield className="h-5 w-5 text-teal" />
                <span className="text-sm font-medium text-gray-700">Secure Trading</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Users className="h-5 w-5 text-royal-blue" />
                <span className="text-sm font-medium text-gray-700">50,000+ Indians</span>
              </div>
            </div>

            {/* Hero headline with Indian context */}
            <h1 className="hero-title text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Trade Carbon Credits.
              <span className="block text-gradient-saffron">
                Reduce Emissions.
              </span>
              <span className="block text-teal">
                Build a Greener Bharat.
              </span>
            </h1>
            
            <p className="hero-subtitle text-xl md:text-2xl text-gray-700 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
              Carbon credits are tradeable certificates representing the removal of one metric ton 
              of CO₂ from the atmosphere. Join India's premier marketplace for verified carbon offsets 
              from renewable energy, reforestation, and clean technology projects across Bharat.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                to="/register"
                className="group bg-saffron-gradient text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 btn-hover"
              >
                <span className="flex items-center justify-center space-x-3">
                  <span>Get Started Today</span>
                  <Activity className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </Link>
              <Link
                to="/login"
                className="group bg-white text-teal border-3 border-teal px-10 py-5 rounded-2xl font-bold text-xl hover:bg-teal hover:text-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 btn-hover"
              >
                <span className="flex items-center justify-center space-x-3">
                  <span>Login</span>
                  <TrendingUp className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </Link>
            </div>

            {/* Enhanced stats section with Indian context */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 card-hover border border-saffron/10">
                <div className="text-4xl font-bold text-saffron mb-2">25L+</div>
                <div className="text-gray-600 font-medium">Tons CO₂ Offset</div>
                <div className="text-xs text-gray-500 mt-1">Across India</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 card-hover border border-teal/10">
                <div className="text-4xl font-bold text-teal mb-2">₹100Cr+</div>
                <div className="text-gray-600 font-medium">Credits Traded</div>
                <div className="text-xs text-gray-500 mt-1">In Indian Markets</div>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-3 card-hover border border-royal-blue/10">
                <div className="text-4xl font-bold text-royal-blue mb-2">1000+</div>
                <div className="text-gray-600 font-medium">Green Projects</div>
                <div className="text-xs text-gray-500 mt-1">Pan-India Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why EcoTrade Section with enhanced design */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose EcoTrade?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              India's most trusted platform for carbon credit trading with transparency, 
              security, and real environmental impact for a sustainable Bharat.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Enhanced feature cards */}
            <div className="group bg-gradient-to-br from-saffron-50 to-orange-50 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-saffron/20 card-hover">
              <div className="bg-saffron-gradient rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 animate-pulse-glow">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete Transparency</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Every carbon credit is verified by Indian regulatory bodies and tracked on our secure platform. 
                View detailed project information, impact metrics, and certification details 
                with complete transparency across all Indian states.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-teal-50 to-cyan-50 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-teal/20 card-hover">
              <div className="bg-teal-gradient rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Trading Platform</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Advanced trading tools with real-time market data in ₹, price analytics, 
                and automated matching for optimal buying and selling opportunities 
                tailored specifically for the Indian carbon market.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-royal-blue/20 card-hover">
              <div className="bg-royal-gradient rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Measurable Impact</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                Track your environmental impact with detailed analytics, progress reports, 
                and gamified achievements that showcase your contribution to India's 
                Net Zero 2070 commitment and green revolution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section with Indian context */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 mandala-bg">
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
            {/* Enhanced connecting lines */}
            <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-2 bg-gradient-to-r from-saffron via-teal to-royal-blue -translate-y-1/2 z-0 rounded-full opacity-30"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 text-center">
              <div className="bg-saffron-gradient rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-2xl hover:scale-110 transition-transform duration-300 animate-float">
                <UserCheck className="h-12 w-12 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 card-hover border border-saffron/10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Register & Verify</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Create your account in minutes with Aadhaar verification. 
                  Complete your profile with Indian banking details and verify your identity 
                  to start trading in India's largest carbon credit marketplace.
                </p>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative z-10 text-center">
              <div className="bg-teal-gradient rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-2xl hover:scale-110 transition-transform duration-300 animate-float-delayed">
                <ShoppingCart className="h-12 w-12 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 card-hover border border-teal/10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Buy & Sell Credits</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Browse verified carbon offset projects from renewable energy, 
                  forestry, and clean technology initiatives across India. 
                  Trade with confidence using ₹ and UPI payments.
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative z-10 text-center">
              <div className="bg-royal-gradient rounded-3xl w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-2xl hover:scale-110 transition-transform duration-300 animate-float">
                <Activity className="h-12 w-12 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 card-hover border border-royal-blue/10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Track Your Impact</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Monitor your environmental impact with detailed analytics, 
                  earn achievements, and compete on our India leaderboard 
                  while contributing to a greener, more sustainable Bharat.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Leading Indian Businesses
            </h2>
            <p className="text-xl text-gray-600">
              Join top companies making a difference in India's sustainability journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Enhanced testimonial cards */}
            <div className="bg-gradient-to-br from-saffron-50 to-orange-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-saffron/20 card-hover">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-saffron fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                "EcoTrade has revolutionized how we approach carbon offsetting in India. 
                The platform is transparent, secure, and perfectly suited for Indian businesses 
                looking to meet ESG goals."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-saffron-gradient rounded-full flex items-center justify-center text-white font-bold text-lg">
                  R
                </div>
                <div className="ml-4">
                  <div className="font-bold text-gray-900">Rajesh Kumar</div>
                  <div className="text-gray-600">CEO, GreenTech Solutions Mumbai</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-teal/20 card-hover">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-teal fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                "The user experience is exceptional, and the impact tracking features 
                help us demonstrate our commitment to sustainability to stakeholders 
                and comply with Indian environmental regulations."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-teal-gradient rounded-full flex items-center justify-center text-white font-bold text-lg">
                  P
                </div>
                <div className="ml-4">
                  <div className="font-bold text-gray-900">Priya Sharma</div>
                  <div className="text-gray-600">Sustainability Director, EcoIndia Bangalore</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-royal-blue/20 card-hover">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-royal-blue fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                "EcoTrade's marketplace has made carbon credit trading accessible and 
                profitable for Indian SMEs. It's the perfect platform for India's 
                transition to a green economy."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-royal-gradient rounded-full flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div className="ml-4">
                  <div className="font-bold text-gray-900">Arjun Patel</div>
                  <div className="text-gray-600">Founder, CleanEnergy Ventures Delhi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-saffron-gradient relative overflow-hidden">
        {/* Enhanced decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border-4 border-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 border-4 border-white rounded-full animate-pulse delay-2000"></div>
          <div className="absolute top-20 right-1/4 w-24 h-24 border-2 border-white/50 rounded-full animate-float"></div>
          <div className="absolute bottom-20 left-1/3 w-16 h-16 border-2 border-white/50 rounded-full animate-float-delayed"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to Build a Greener Bharat?
          </h2>
          <p className="text-xl md:text-2xl text-orange-100 mb-10 leading-relaxed">
            Join thousands of environmentally conscious Indians making a real impact 
            on climate change through carbon offset trading. Be part of India's journey 
            towards Net Zero 2070.
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center space-x-3 bg-white text-saffron px-12 py-6 rounded-2xl font-bold text-xl hover:bg-cream hover:scale-105 transition-all duration-300 transform hover:-translate-y-2 shadow-2xl btn-hover"
          >
            <span>Start Trading Today</span>
            <Award className="h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
          </Link>
          
          {/* Additional trust indicators */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/80">
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5" />
              <span className="text-sm">Carbon Neutral Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span className="text-sm">UN SDG Aligned</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span className="text-sm">Instant Settlements</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
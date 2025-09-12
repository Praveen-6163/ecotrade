import React, { useEffect, useState } from 'react'
import { Leaf, Globe, TrendingUp, Users, Award, Zap, Heart, Star } from 'lucide-react'

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const steps = [
    {
      icon: Leaf,
      title: "Welcome to EcoTrade",
      subtitle: "India's Premier Carbon Credit Marketplace",
      description: "Building a Greener Bharat Together",
      color: "from-green-400 to-emerald-600"
    },
    {
      icon: Globe,
      title: "Trade Carbon Credits",
      subtitle: "Verified Environmental Projects",
      description: "Support renewable energy, reforestation & clean technology",
      color: "from-blue-400 to-cyan-600"
    },
    {
      icon: TrendingUp,
      title: "Track Your Impact",
      subtitle: "Real-time Analytics & Progress",
      description: "Monitor your contribution to India's Net Zero 2070 goal",
      color: "from-saffron to-orange-500"
    },
    {
      icon: Users,
      title: "Join 50,000+ Indians",
      subtitle: "Climate Champions Community",
      description: "Compete on leaderboards & earn achievement badges",
      color: "from-purple-400 to-indigo-600"
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        // Final step - fade out and complete
        setIsVisible(false)
        setTimeout(onComplete, 800)
      }
    }, 2500) // 2.5 seconds per step

    return () => clearTimeout(timer)
  }, [currentStep, onComplete])

  const skipAnimation = () => {
    setIsVisible(false)
    setTimeout(onComplete, 300)
  }

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-saffron via-orange-400 to-red-400 flex items-center justify-center z-50 opacity-0 transition-opacity duration-800" />
    )
  }

  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-saffron via-orange-400 to-red-400 flex items-center justify-center z-50 overflow-hidden">
      {/* Skip Button */}
      <button
        onClick={skipAnimation}
        className="absolute top-6 right-6 text-white/80 hover:text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/20"
        aria-label="Skip introduction"
      >
        Skip Intro
      </button>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Icons */}
        <div className="absolute top-20 left-20 opacity-20 animate-float">
          <Leaf className="h-16 w-16 text-white" />
        </div>
        <div className="absolute top-32 right-32 opacity-15 animate-float delay-1000">
          <Globe className="h-20 w-20 text-white" />
        </div>
        <div className="absolute bottom-32 left-32 opacity-20 animate-float delay-2000">
          <TrendingUp className="h-14 w-14 text-white" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-15 animate-float delay-500">
          <Users className="h-18 w-18 text-white" />
        </div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-4 border-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border-4 border-white/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 border-4 border-white/25 rounded-full animate-pulse delay-2000"></div>
        
        {/* Sparkle Effects */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-60"
                style={{
                  transform: `rotate(${i * 30}deg) translateY(-100px)`,
                  animation: `twinkle 2s ease-in-out infinite ${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="text-center relative z-10 max-w-4xl mx-auto px-8">
        {/* Icon Container */}
        <div className="mb-8 animate-fade-scale">
          <div className={`bg-gradient-to-br ${currentStepData.color} rounded-full p-8 mx-auto w-32 h-32 flex items-center justify-center shadow-2xl animate-pulse-glow`}>
            <Icon className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Text Content */}
        <div className="animate-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            {currentStepData.title}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-yellow-200 mb-6">
            {currentStepData.subtitle}
          </h2>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
            {currentStepData.description}
          </p>
        </div>

        {/* Feature Highlights for Final Step */}
        {currentStep === steps.length - 1 && (
          <div className="mt-12 animate-fade-scale delay-500">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Award className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Earn Badges</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Zap className="h-8 w-8 text-green-300 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Instant Trading</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Heart className="h-8 w-8 text-red-300 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Make Impact</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <Star className="h-8 w-8 text-purple-300 mx-auto mb-2" />
                <p className="text-white text-sm font-medium">Top Rankings</p>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-3">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-500 ${
                  index === currentStep 
                    ? 'bg-white scale-125 shadow-lg' 
                    : index < currentStep 
                      ? 'bg-white/70' 
                      : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <p className="text-white/80 text-sm mt-3 font-medium">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>

      {/* Reduced Motion Fallback */}
      <div className="motion-reduce:block hidden fixed inset-0 bg-gradient-to-br from-saffron via-orange-400 to-red-400 flex items-center justify-center z-50">
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 max-w-2xl mx-8">
          <Leaf className="h-20 w-20 text-white mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to EcoTrade</h1>
          <p className="text-xl text-white/90 mb-8">India's Premier Carbon Credit Marketplace</p>
          <button
            onClick={onComplete}
            className="bg-white text-saffron px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/90 transition-colors duration-300"
          >
            Enter Platform
          </button>
        </div>
      </div>
    </div>
  )
}
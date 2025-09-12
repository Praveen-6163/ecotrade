import React, { useEffect, useState } from 'react'
import { Leaf, Sparkles, Heart, Award } from 'lucide-react'

interface WelcomeAnimationProps {
  userName: string
  onComplete: () => void
}

export function WelcomeAnimation({ userName, onComplete }: WelcomeAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1)
      } else {
        setIsVisible(false)
        setTimeout(onComplete, 500)
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [currentStep, onComplete])

  const skipAnimation = () => {
    setIsVisible(false)
    setTimeout(onComplete, 300)
  }

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-saffron via-orange-400 to-red-400 flex items-center justify-center z-50 opacity-0 transition-opacity duration-500" />
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-saffron via-orange-400 to-red-400 flex items-center justify-center z-50 animate-fade-scale">
      {/* Skip Button */}
      <button
        onClick={skipAnimation}
        className="absolute top-6 right-6 text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
        aria-label="Skip animation"
      >
        Skip
      </button>

      {/* Reduced Motion Alternative */}
      <div className="motion-reduce:hidden">
        <div className="text-center relative">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-16 w-16 h-16 border-4 border-white/30 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-20 w-12 h-12 border-4 border-white/25 rounded-full animate-pulse delay-2000"></div>
            <div className="absolute bottom-16 right-12 w-24 h-24 border-4 border-white/15 rounded-full animate-pulse delay-500"></div>
          </div>

          {/* Step 1: Logo Animation */}
          {currentStep >= 0 && (
            <div className={`transition-all duration-800 ${currentStep >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl animate-float">
                <Leaf className="h-24 w-24 text-white mx-auto animate-pulse" />
              </div>
            </div>
          )}

          {/* Step 2: Welcome Text */}
          {currentStep >= 1 && (
            <div className={`transition-all duration-800 delay-200 ${currentStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-slide-up">
                Welcome back,
              </h1>
              <h2 className="text-4xl md:text-5xl font-bold text-yellow-200 mb-6 animate-slide-up delay-300">
                {userName}! 🎉
              </h2>
            </div>
          )}

          {/* Step 3: Motivational Message */}
          {currentStep >= 2 && (
            <div className={`transition-all duration-800 delay-400 ${currentStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl">
                <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                  Ready to make a difference for our planet? 🌍
                </p>
                <p className="text-lg text-white/80 mt-2">
                  Let's continue building a greener Bharat together!
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Action Icons */}
          {currentStep >= 3 && (
            <div className={`transition-all duration-800 delay-600 ${currentStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
              <div className="flex justify-center space-x-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg animate-bounce">
                  <Sparkles className="h-8 w-8 text-yellow-200" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg animate-bounce delay-200">
                  <Heart className="h-8 w-8 text-red-200" />
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-lg animate-bounce delay-400">
                  <Award className="h-8 w-8 text-green-200" />
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              {[0, 1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentStep >= step ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reduced Motion Fallback */}
      <div className="motion-reduce:block hidden text-center">
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
          <Leaf className="h-16 w-16 text-white mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-white mb-4">Welcome back, {userName}!</h1>
          <p className="text-xl text-white/90 mb-6">Ready to make a difference for our planet?</p>
          <button
            onClick={onComplete}
            className="bg-white text-saffron px-8 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors duration-300"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
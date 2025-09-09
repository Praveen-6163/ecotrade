import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-teal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-saffron to-orange-500 p-2 rounded-xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-saffron to-orange-400 bg-clip-text text-transparent">
                EcoTrade
              </span>
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed max-w-md">
              Leading India's future of carbon offset trading. Join thousands of users 
              making a positive impact on our planet through verified carbon credits 
              and sustainable practices.
            </p>
            <div className="flex space-x-4">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-saffron font-bold">₹50Cr+</span>
                <span className="text-gray-300 ml-2">Traded</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-teal font-bold">25K+</span>
                <span className="text-gray-300 ml-2">Users</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 text-saffron">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-300 hover:text-saffron transition-all duration-300 hover:translate-x-2 inline-block">About Us</Link></li>
              <li><Link to="/projects" className="text-gray-300 hover:text-saffron transition-all duration-300 hover:translate-x-2 inline-block">Projects</Link></li>
              <li><Link to="/leaderboard" className="text-gray-300 hover:text-saffron transition-all duration-300 hover:translate-x-2 inline-block">Leaderboard</Link></li>
              <li><Link to="/calculator" className="text-gray-300 hover:text-saffron transition-all duration-300 hover:translate-x-2 inline-block">Impact Calculator</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 text-teal">Legal & Support</h3>
            <ul className="space-y-3">
              <li><Link to="/terms" className="text-gray-300 hover:text-teal transition-all duration-300 hover:translate-x-2 inline-block">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-teal transition-all duration-300 hover:translate-x-2 inline-block">Privacy Policy</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-teal transition-all duration-300 hover:translate-x-2 inline-block">Contact Support</Link></li>
              <li><Link to="/help" className="text-gray-300 hover:text-teal transition-all duration-300 hover:translate-x-2 inline-block">Help Center</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-lg">
              © 2025 EcoTrade India. All rights reserved. Building a sustainable Bharat together.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400">Made with</span>
              <span className="text-red-500 text-xl">♥</span>
              <span className="text-gray-400">in India</span>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              Supporting India's commitment to net-zero emissions by 2070
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
          </p>
        </div>
      </div>
    </footer>
  )
}
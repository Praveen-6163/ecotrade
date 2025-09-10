import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-saffron-gradient p-2 rounded-xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-gradient-saffron">
                EcoTrade
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              India's premier carbon credit marketplace, empowering businesses and individuals 
              to contribute to a sustainable future while building a greener Bharat.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-saffron transition-colors duration-300 hover:scale-110 transform">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-saffron transition-colors duration-300 hover:scale-110 transform">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-saffron transition-colors duration-300 hover:scale-110 transform">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-saffron transition-colors duration-300 hover:scale-110 transform">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-saffron transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-saffron transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-gray-300 hover:text-saffron transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  Leaderboard
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-saffron transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-saffron transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-teal transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  Carbon Credit Trading
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  Environmental Projects
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  Impact Analytics
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  Corporate Solutions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal transition-colors duration-300 hover:translate-x-1 transform inline-block">
                  Verification Services
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-saffron mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>EcoTrade India Pvt. Ltd.</p>
                  <p>Green Tower, Sector 18</p>
                  <p>Gurugram, Haryana 122015</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-teal flex-shrink-0" />
                <a href="tel:+911234567890" className="text-gray-300 hover:text-teal transition-colors duration-300">
                  +91 12345 67890
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-royal-blue flex-shrink-0" />
                <a href="mailto:support@ecotrade.in" className="text-gray-300 hover:text-royal-blue transition-colors duration-300">
                  support@ecotrade.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 EcoTrade India Pvt. Ltd. All rights reserved. | Building a Greener Bharat
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-saffron transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-saffron transition-colors duration-300">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-saffron transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-saffron via-teal to-royal-blue"></div>
    </footer>
  )
}
import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, Mic, MicOff, Volume2, VolumeX, X, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface AIAssistantProps {
  isVisible: boolean
  onToggle: () => void
}

export function AIAssistant({ isVisible, onToggle }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your EcoTrade assistant. I can help you with information about carbon credits, trading, and our platform. You can type or use voice commands. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        handleSendMessage(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speak = (text: string) => {
    if (synthRef.current && !isSpeaking) {
      synthRef.current.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      synthRef.current.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
  }

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    // Website creator question
    if (message.includes('who built') || message.includes('who created') || message.includes('who made') || message.includes('developer') || message.includes('creator')) {
      return "This website was built by Medida Sri Venkata Praveen. He created this comprehensive carbon trading platform to help individuals and businesses contribute to environmental sustainability."
    }
    
    // Carbon credits information
    if (message.includes('carbon credit') || message.includes('what are carbon credits')) {
      return "Carbon credits are tradeable certificates representing the removal of one metric ton of CO₂ from the atmosphere. Each credit you purchase supports verified environmental projects like renewable energy, reforestation, and clean technology initiatives across India."
    }
    
    // How to buy credits
    if (message.includes('how to buy') || message.includes('purchase') || message.includes('buying credits')) {
      return "To buy carbon credits: 1) Go to your Dashboard, 2) Click the 'Buy Credits' tab, 3) Select a verified project, 4) Choose your quantity, 5) Complete the purchase. Each credit represents 1 ton of CO₂ offset and helps fund environmental projects."
    }
    
    // How to sell credits
    if (message.includes('how to sell') || message.includes('selling credits')) {
      return "To sell carbon credits: 1) Go to your Dashboard, 2) Click the 'Sell Credits' tab, 3) Select which project credits to sell, 4) Set your quantity and price, 5) List them on our marketplace. Other users can then purchase your credits."
    }
    
    // Leaderboard information
    if (message.includes('leaderboard') || message.includes('ranking') || message.includes('top users')) {
      return "Our Global Leaderboard showcases India's top climate champions based on CO₂ offset achievements. You can view rankings, search for users, and see your own position. It's a great way to stay motivated and compete with other environmentally conscious users!"
    }
    
    // Platform features
    if (message.includes('features') || message.includes('what can i do')) {
      return "EcoTrade offers: ✅ Buy/Sell carbon credits ✅ Real-time marketplace ✅ Impact tracking & analytics ✅ Achievement badges ✅ Global leaderboard ✅ Verified Indian projects ✅ Secure transactions ✅ Environmental impact reports. Everything you need for carbon offset trading!"
    }
    
    // Registration/Getting started
    if (message.includes('how to start') || message.includes('register') || message.includes('sign up') || message.includes('getting started')) {
      return "Getting started is easy! 1) Click 'Register' to create your account, 2) Verify your email, 3) Complete your profile, 4) Start buying carbon credits from verified projects, 5) Track your environmental impact. Join thousands of Indians building a greener Bharat!"
    }
    
    // Pricing information
    if (message.includes('price') || message.includes('cost') || message.includes('how much')) {
      return "Carbon credit prices vary by project type and verification level. Prices typically range from ₹500-₹2000 per credit. You can see current prices in the 'Buy Credits' section or marketplace. Each credit represents 1 ton of CO₂ offset."
    }
    
    // Environmental impact
    if (message.includes('impact') || message.includes('environment') || message.includes('co2') || message.includes('offset')) {
      return "Every carbon credit you purchase removes 1 ton of CO₂ from the atmosphere! This is equivalent to planting 2.5 trees, offsetting 2,600 miles of driving, or generating 1,200 kWh of clean energy. Track your total impact in the Dashboard's Impact section."
    }
    
    // Projects information
    if (message.includes('projects') || message.includes('what projects')) {
      return "We feature verified environmental projects across India including: 🌱 Reforestation initiatives 🌞 Solar energy farms 💨 Wind power projects 🏭 Clean technology solutions 🌊 Water conservation projects. All projects are government-verified and contribute to India's Net Zero 2070 goal."
    }
    
    // Security and trust
    if (message.includes('secure') || message.includes('safe') || message.includes('trust') || message.includes('verified')) {
      return "EcoTrade is completely secure! We use: 🔒 Bank-level encryption 🏛️ Government verification 🛡️ Secure payment processing 📋 Transparent project tracking 🔍 Third-party audits. All projects are verified by Indian regulatory bodies."
    }
    
    // Badges and achievements
    if (message.includes('badge') || message.includes('achievement') || message.includes('reward')) {
      return "Earn badges based on your CO₂ offset achievements: 🌿 Eco Starter (100+ tons), 🌱 Green Hero (500+ tons), ⚡ Carbon Warrior (1000+ tons), 🌍 Planet Protector (5000+ tons), 🏆 Climate Champion. Check your Dashboard to see your progress!"
    }
    
    // Marketplace
    if (message.includes('marketplace') || message.includes('trading')) {
      return "Our marketplace allows peer-to-peer carbon credit trading. Users can list their credits for sale at custom prices, and others can purchase them instantly. It's a dynamic market that helps optimize pricing and liquidity for carbon credits."
    }
    
    // Help and support
    if (message.includes('help') || message.includes('support') || message.includes('contact')) {
      return "I'm here to help! You can ask me about carbon credits, trading, platform features, or anything else. For additional support, contact us at support@ecotrade.in or call +91 12345 67890. Our team is ready to assist you!"
    }
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Welcome to EcoTrade, India's premier carbon credit marketplace! I'm here to help you understand carbon trading, navigate our platform, and make a positive environmental impact. What would you like to know?"
    }
    
    // Thank you responses
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! I'm glad I could help. Remember, every carbon credit you trade brings us closer to a greener, more sustainable Bharat. Feel free to ask me anything else about EcoTrade!"
    }
    
    // Default response
    return "I'd be happy to help you with that! I can provide information about carbon credits, how to buy/sell them, our platform features, environmental impact, verified projects, and much more. Could you please be more specific about what you'd like to know? You can also try asking about 'features', 'how to buy credits', or 'environmental impact'."
  }

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputText.trim()
    if (!text) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(text)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
      
      // Auto-speak response if not already speaking
      if (!isSpeaking) {
        speak(response)
      }
    }, 1000 + Math.random() * 1000) // 1-2 second delay
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-saffron to-orange-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">EcoTrade Assistant</h3>
              <p className="text-xs text-orange-100">AI-powered support</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`p-2 rounded-full ${
                      message.isUser ? 'bg-saffron text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {message.isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      message.isUser 
                        ? 'bg-saffron text-white rounded-br-sm' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-orange-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="p-2 rounded-full bg-gray-100 text-gray-600">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Voice Controls */}
            <div className="px-4 py-2 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={!recognitionRef.current}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                
                <button
                  onClick={isSpeaking ? stopSpeaking : () => speak(messages[messages.length - 1]?.text || '')}
                  disabled={!synthRef.current}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isSpeaking 
                      ? 'bg-blue-500 text-white animate-pulse' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={isSpeaking ? 'Stop speaking' : 'Read last message'}
                >
                  {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                
                <div className="text-xs text-gray-500">
                  {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Voice ready'}
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message or use voice..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-saffron focus:border-saffron outline-none transition-colors"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  className="bg-saffron text-white p-2 rounded-full hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
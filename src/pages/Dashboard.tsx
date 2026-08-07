import React, { useState, useEffect } from 'react'
import { User, CreditCard, TrendingUp, Award, Calculator, ShoppingCart, DollarSign, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts/es6/index.js'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface Profile {
  id: string
  name: string
  email: string
  credits_owned: number
  total_co2_offset: number
  badges: string[]
}

interface Project {
  id: string
  name: string
  type: string
  price_per_credit: number
  description: string
  image_url: string
}

interface Transaction {
  id: string
  user_id: string
  project_id: string
  type: 'buy' | 'sell'
  quantity: number
  total_cost: number
  created_at: string
  projects?: Project
}

interface SaleOrder {
  id: string
  seller_id: string
  project_id: string
  quantity: number
  price_per_credit: number
  total_value: number
  status: 'active' | 'completed' | 'cancelled'
  created_at: string
  projects?: Project
  profiles?: { name: string }
}

export function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [saleOrders, setSaleOrders] = useState<SaleOrder[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedProject, setSelectedProject] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [sellQuantity, setSellQuantity] = useState(1)
  const [sellPrice, setSellPrice] = useState(0)
  const [selectedSellProject, setSelectedSellProject] = useState('')
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null)

  useEffect(() => {
    if (user) {
      loadProfile()
      loadProjects()
      loadTransactions()
      loadSaleOrders()
    }
  }, [user])

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const loadProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single()
    
    setProfile(data)
  }

  const loadProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    
    setProjects(data || [])
  }

  const loadTransactions = async () => {
    const { data } = await supabase
      .from('transactions')
      .select(`
        *,
        projects (*)
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    
    setTransactions(data || [])
  }

  const loadSaleOrders = async () => {
    // Load all active sale orders for marketplace view
    const { data } = await supabase
      .from('sale_orders')
      .select(`
        *,
        projects (*),
        profiles (name)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    setSaleOrders(data || [])
  }

  const handleBuyCredits = async () => {
    if (!selectedProject || quantity <= 0) {
      showNotification('error', 'Please select a project and enter a valid quantity')
      return
    }
    
    setLoading(true)
    const project = projects.find(p => p.id === selectedProject)
    if (!project) return

    const totalCost = project.price_per_credit * quantity
    
    try {
      // Insert transaction
      const { error: transactionError } = await supabase.from('transactions').insert({
        user_id: user?.id,
        project_id: selectedProject,
        type: 'buy',
        quantity,
        total_cost: totalCost
      })

      if (transactionError) throw transactionError

      // Update profile
      if (profile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            credits_owned: profile.credits_owned + quantity,
            total_co2_offset: profile.total_co2_offset + quantity
          })
          .eq('id', user?.id)

        if (profileError) throw profileError
      }

      setQuantity(1)
      setSelectedProject('')
      await loadProfile()
      await loadTransactions()
      showNotification('success', `Successfully purchased ${quantity} carbon credits!`)
    } catch (error) {
      showNotification('error', 'Failed to purchase credits. Please try again.')
    }
    
    setLoading(false)
  }

  const handleSellCredits = async () => {
    if (!selectedSellProject || sellQuantity <= 0 || sellPrice <= 0) {
      showNotification('error', 'Please fill in all required fields')
      return
    }

    if (!profile || profile.credits_owned < sellQuantity) {
      showNotification('error', 'Insufficient credits to sell')
      return
    }
    
    setLoading(true)
    
    try {
      // Create sale order
      const { error: saleError } = await supabase.from('sale_orders').insert({
        seller_id: user?.id,
        project_id: selectedSellProject,
        quantity: sellQuantity,
        price_per_credit: sellPrice,
        total_value: sellPrice * sellQuantity,
        status: 'active'
      })

      if (saleError) throw saleError

      // Update profile to reduce available credits
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          credits_owned: profile.credits_owned - sellQuantity
        })
        .eq('id', user?.id)

      if (profileError) throw profileError

      // Record the sell transaction
      const { error: transactionError } = await supabase.from('transactions').insert({
        user_id: user?.id,
        project_id: selectedSellProject,
        type: 'sell',
        quantity: sellQuantity,
        total_cost: sellPrice * sellQuantity
      })

      if (transactionError) throw transactionError

      setSellQuantity(1)
      setSellPrice(0)
      setSelectedSellProject('')
      await loadProfile()
      await loadTransactions()
      await loadSaleOrders()
      showNotification('success', `Successfully listed ${sellQuantity} credits for sale!`)
    } catch (error) {
      showNotification('error', 'Failed to list credits for sale. Please try again.')
    }
    
    setLoading(false)
  }

  const handleBuyFromMarketplace = async (saleOrder: SaleOrder) => {
    if (!profile) return
    
    setLoading(true)
    
    try {
      // Update sale order status
      const { error: saleError } = await supabase
        .from('sale_orders')
        .update({ status: 'completed' })
        .eq('id', saleOrder.id)

      if (saleError) throw saleError

      // Update buyer's profile
      const { error: buyerError } = await supabase
        .from('profiles')
        .update({
          credits_owned: profile.credits_owned + saleOrder.quantity,
          total_co2_offset: profile.total_co2_offset + saleOrder.quantity
        })
        .eq('id', user?.id)

      if (buyerError) throw buyerError

      // Record buyer's transaction
      const { error: transactionError } = await supabase.from('transactions').insert({
        user_id: user?.id,
        project_id: saleOrder.project_id,
        type: 'buy',
        quantity: saleOrder.quantity,
        total_cost: saleOrder.total_value
      })

      if (transactionError) throw transactionError

      await loadProfile()
      await loadTransactions()
      await loadSaleOrders()
      showNotification('success', `Successfully purchased ${saleOrder.quantity} credits from marketplace!`)
    } catch (error) {
      showNotification('error', 'Failed to complete purchase. Please try again.')
    }
    
    setLoading(false)
  }

  // Get user's credits by project for selling
  const getUserCreditsByProject = () => {
    const creditsByProject: { [key: string]: { project: Project, quantity: number } } = {}
    
    transactions.forEach(transaction => {
      if (transaction.projects) {
        const projectId = transaction.project_id
        if (!creditsByProject[projectId]) {
          creditsByProject[projectId] = {
            project: transaction.projects,
            quantity: 0
          }
        }
        
        if (transaction.type === 'buy') {
          creditsByProject[projectId].quantity += transaction.quantity
        } else {
          creditsByProject[projectId].quantity -= transaction.quantity
        }
      }
    })
    
    return Object.values(creditsByProject).filter(item => item.quantity > 0)
  }

  const chartData = transactions.slice(0, 6).map((t, i) => ({
    name: new Date(t.created_at).toLocaleDateString(),
    offset: t.type === 'buy' ? t.quantity : -t.quantity,
    cumulative: transactions.slice(0, i + 1).reduce((sum, tx) => sum + (tx.type === 'buy' ? tx.quantity : -tx.quantity), 0)
  })).reverse()

  const transactionTypeData = [
    { name: 'Purchases', value: transactions.filter(t => t.type === 'buy').length, color: '#FF9933' },
    { name: 'Sales', value: transactions.filter(t => t.type === 'sell').length, color: '#006666' }
  ]

  const badges = [
    { name: 'Green Hero', icon: '🌱', condition: (profile?.total_co2_offset || 0) >= 100 },
    { name: 'Carbon Warrior', icon: '⚡', condition: (profile?.total_co2_offset || 0) >= 500 },
    { name: 'Planet Protector', icon: '🌍', condition: (profile?.total_co2_offset || 0) >= 1000 },
    { name: 'Climate Champion', icon: '🏆', condition: (profile?.total_co2_offset || 0) >= 5000 }
  ]

  const userCredits = getUserCreditsByProject()

  return (
    <div className="min-h-screen bg-cream-50 py-10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, <span className="text-gradient-saffron">{profile?.name}</span>!
            </h1>
            <p className="text-gray-600 mt-2 font-medium">Manage your carbon credits and track your environmental impact across Bharat</p>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-8 p-5 rounded-2xl border-l-4 shadow-soft animate-slide-up ${
            notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
            notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
            'bg-blue-50 border-blue-500 text-blue-800'
          }`}>
            <div className="flex items-center font-semibold">
              {notification.type === 'success' && <CheckCircle className="h-6 w-6 mr-3 text-green-500" />}
              {notification.type === 'error' && <AlertCircle className="h-6 w-6 mr-3 text-red-500" />}
              {notification.type === 'info' && <Info className="h-6 w-6 mr-3 text-blue-500" />}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-soft border border-saffron/10 hover:border-saffron/30 hover:shadow-strong transition-all duration-300 card-hover">
            <div className="flex items-center space-x-4">
              <div className="bg-saffron/10 rounded-xl p-3 shadow-glow-saffron">
                <CreditCard className="h-7 w-7 text-saffron animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Credits Owned</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{profile?.credits_owned || 0} credits</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-soft border border-teal/10 hover:border-teal/30 hover:shadow-strong transition-all duration-300 card-hover">
            <div className="flex items-center space-x-4">
              <div className="bg-teal/10 rounded-xl p-3 shadow-glow-teal">
                <TrendingUp className="h-7 w-7 text-teal" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">CO₂ Offset (tons)</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{profile?.total_co2_offset || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-soft border border-royal-blue/10 hover:border-royal-blue/30 hover:shadow-strong transition-all duration-300 card-hover">
            <div className="flex items-center space-x-4">
              <div className="bg-royal-blue/10 rounded-xl p-3 shadow-glow-royal">
                <Award className="h-7 w-7 text-royal-blue" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Badges Earned</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{badges.filter(b => b.condition).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-soft border border-saffron/10 hover:border-saffron/30 hover:shadow-strong transition-all duration-300 card-hover">
            <div className="flex items-center space-x-4">
              <div className="bg-saffron-50 rounded-xl p-3">
                <Calculator className="h-7 w-7 text-saffron-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Transactions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{transactions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-strong border border-saffron/10 mb-10 overflow-hidden animate-fade-scale">
          <div className="border-b border-gray-100 bg-gray-50/50">
            <nav className="flex flex-wrap gap-2 md:gap-6 px-6 py-2">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'buy', label: 'Buy Credits', icon: ShoppingCart },
                { id: 'sell', label: 'Sell Credits', icon: DollarSign },
                { id: 'marketplace', label: 'Marketplace', icon: CreditCard },
                { id: 'transactions', label: 'Transactions', icon: Calculator },
                { id: 'impact', label: 'Impact', icon: Award }
              ].map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3.5 px-4 my-1.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center space-x-2.5 ${
                      isActive
                        ? 'bg-saffron-gradient text-white shadow-glow-saffron'
                        : 'text-gray-600 hover:text-saffron hover:bg-saffron/5'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-scale">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                      <span className="w-2.5 h-6 bg-saffron rounded-full inline-block"></span>
                      <span>CO₂ Offset Progress (Cumulative)</span>
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #FF9933', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                        <Line type="monotone" dataKey="cumulative" stroke="url(#saffronGradient)" strokeWidth={4} activeDot={{ r: 8 }} dot={{ strokeWidth: 2, r: 4 }} />
                        <defs>
                          <linearGradient id="saffronGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#FF9933" />
                            <stop offset="100%" stopColor="#FF6B35" />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                      <span className="w-2.5 h-6 bg-teal rounded-full inline-block"></span>
                      <span>Transaction Distribution</span>
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={transactionTypeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {transactionTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E0FFFC', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <span className="w-2.5 h-6 bg-royal-blue rounded-full inline-block"></span>
                    <span>Your Achievements & Badges</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {badges.map((badge, index) => {
                      const colors = [
                        { active: 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 text-green-900 shadow-glow-teal', inactive: 'border-gray-100 bg-gray-50/50 opacity-40' },
                        { active: 'border-saffron-200 bg-gradient-to-br from-saffron-50 to-orange-50 text-saffron-900 shadow-glow-saffron', inactive: 'border-gray-100 bg-gray-50/50 opacity-40' },
                        { active: 'border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-900 shadow-glow-teal', inactive: 'border-gray-100 bg-gray-50/50 opacity-40' },
                        { active: 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-royal-blue-50 text-royal-blue-900 shadow-glow-royal', inactive: 'border-gray-100 bg-gray-50/50 opacity-40' }
                      ]
                      const currentTheme = colors[index % colors.length]
                      return (
                        <div
                          key={index}
                          className={`p-6 rounded-2xl border-2 text-center transition-all duration-500 card-hover ${
                            badge.condition ? currentTheme.active + ' transform hover:-translate-y-2' : currentTheme.inactive
                          }`}
                        >
                          <div className="text-4xl mb-3 animate-float-delayed">{badge.icon}</div>
                          <div className="font-extrabold text-base tracking-tight">{badge.name}</div>
                          {badge.condition ? (
                            <div className="text-xs font-bold mt-2 uppercase tracking-wider text-green-600 bg-green-100/60 py-1 px-2.5 rounded-full inline-block">
                              Unlocked
                            </div>
                          ) : (
                            <div className="text-xs font-semibold mt-2 uppercase tracking-wider text-gray-400 bg-gray-100 py-1 px-2.5 rounded-full inline-block">
                              Locked
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'buy' && (
              <div className="space-y-8 animate-fade-scale">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-saffron/10 p-2.5 rounded-xl">
                    <ShoppingCart className="h-6 w-6 text-saffron" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Buy Carbon Credits</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-cream-50 to-orange-50/50 p-5 rounded-2xl border border-saffron/20 shadow-soft">
                      <div className="flex items-center space-x-2.5 mb-2.5">
                        <Info className="h-5 w-5 text-saffron-600" />
                        <h4 className="font-bold text-saffron-900">How it works</h4>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed font-medium">
                        Purchase verified carbon credits directly from certified environmental initiatives. Each carbon credit represents 1 metric ton of CO₂ offset from the atmosphere.
                      </p>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Select Project *
                        </label>
                        <select
                          value={selectedProject}
                          onChange={(e) => setSelectedProject(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus-ring outline-none transition-all duration-300 bg-white"
                        >
                          <option value="">Choose a project...</option>
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.name} - ₹{project.price_per_credit.toLocaleString('en-IN')}/credit
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Quantity (credits/tons) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus-ring outline-none transition-all duration-300"
                          placeholder="Enter quantity"
                        />
                      </div>
                      
                      {selectedProject && (
                        <div className="bg-saffron-50/80 backdrop-blur-sm p-5 rounded-2xl border border-saffron-200/60 shadow-soft">
                          <h4 className="font-bold text-saffron-900 mb-3 text-base">Purchase Summary</h4>
                          <div className="space-y-2 text-sm font-medium">
                            <div className="flex justify-between border-b border-saffron/10 pb-1.5">
                              <span className="text-gray-600">Project:</span>
                              <span className="text-gray-900 font-bold">
                                {projects.find(p => p.id === selectedProject)?.name}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-saffron/10 pb-1.5">
                              <span className="text-gray-600">Price per credit:</span>
                              <span className="text-saffron-700 font-bold">
                                ₹{projects.find(p => p.id === selectedProject)?.price_per_credit?.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-saffron/10 pb-1.5">
                              <span className="text-gray-600">CO₂ Offset equivalent:</span>
                              <span className="text-teal font-bold">
                                {quantity} tons of CO₂
                              </span>
                            </div>
                            <div className="flex justify-between pt-1">
                              <span className="text-gray-900 font-bold text-base">Total Cost:</span>
                              <span className="text-saffron font-extrabold text-xl">
                                ₹{((projects.find(p => p.id === selectedProject)?.price_per_credit || 0) * quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={handleBuyCredits}
                        disabled={!selectedProject || quantity <= 0 || loading}
                        className="w-full bg-saffron-gradient text-white py-4 px-6 rounded-xl font-bold shadow-medium hover:shadow-strong transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105 btn-hover"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Processing Transaction...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-5 w-5" />
                            <span>Purchase Credits Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-bold text-gray-900 text-lg flex items-center space-x-2">
                      <span className="w-2 h-4 bg-saffron rounded-full inline-block"></span>
                      <span>Available Projects</span>
                    </h4>
                    <div className="space-y-4 max-h-128 overflow-y-auto pr-2">
                      {projects.map((project) => (
                        <div key={project.id} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-soft hover:border-saffron/30 transition-all duration-300 card-hover">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-bold text-gray-900 text-base">{project.name}</h5>
                            <span className="bg-saffron/10 text-saffron-800 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                              {project.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed font-medium">{project.description}</p>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                            <span className="text-saffron font-extrabold text-lg">₹{project.price_per_credit.toLocaleString('en-IN')}/credit</span>
                            <button
                              onClick={() => setSelectedProject(project.id)}
                              className="bg-saffron/10 text-saffron hover:bg-saffron hover:text-white px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300"
                            >
                              Select
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sell' && (
              <div className="space-y-8 animate-fade-scale">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-teal/10 p-2.5 rounded-xl">
                    <DollarSign className="h-6 w-6 text-teal" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Sell Carbon Credits</h3>
                </div>

                {userCredits.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-soft">
                    <CreditCard className="h-20 w-20 text-gray-300 mx-auto mb-4 animate-float" />
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No Credits Available to Sell</h3>
                    <p className="text-gray-600 mb-6 font-medium max-w-md mx-auto">
                      You must purchase carbon credits from a certified project before listing them for trade in the marketplace.
                    </p>
                    <button
                      onClick={() => setActiveTab('buy')}
                      className="bg-saffron-gradient text-white px-8 py-3.5 rounded-xl font-bold shadow-medium hover:scale-105 transition-all duration-300 btn-hover"
                    >
                      Browse Carbon Projects
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-teal-50 to-cyan-50/50 p-5 rounded-2xl border border-teal/20 shadow-soft">
                        <div className="flex items-center space-x-2.5 mb-2.5">
                          <Info className="h-5 w-5 text-teal-700" />
                          <h4 className="font-bold text-teal-900">Selling Credits</h4>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed font-medium">
                          List your carbon credits in the global EcoTrade marketplace. Set your target price per credit and sell directly to other eco-conscious buyers.
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Select Project Credits *
                          </label>
                          <select
                            value={selectedSellProject}
                            onChange={(e) => {
                              setSelectedSellProject(e.target.value)
                              const selected = userCredits.find(c => c.project.id === e.target.value)
                              if (selected) {
                                setSellPrice(selected.project.price_per_credit)
                              }
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus-ring outline-none transition-all duration-300 bg-white"
                          >
                            <option value="">Choose credits to sell...</option>
                            {userCredits.map((credit) => (
                              <option key={credit.project.id} value={credit.project.id}>
                                {credit.project.name} ({credit.quantity} available)
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Quantity to Sell *
                          </label>
                          <input
                            type="number"
                            min="1"
                            max={userCredits.find(c => c.project.id === selectedSellProject)?.quantity || 0}
                            value={sellQuantity}
                            onChange={(e) => setSellQuantity(parseInt(e.target.value) || 1)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus-ring outline-none transition-all duration-300"
                            placeholder="Enter quantity"
                          />
                          {selectedSellProject && (
                            <p className="text-xs text-teal font-bold mt-2.5">
                              Available balance: {userCredits.find(c => c.project.id === selectedSellProject)?.quantity || 0} credits
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Price per Credit (₹) *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus-ring outline-none transition-all duration-300"
                            placeholder="Set your price"
                          />
                          {selectedSellProject && (
                            <p className="text-xs text-gray-500 mt-2.5 font-medium">
                              Original market price: ₹{userCredits.find(c => c.project.id === selectedSellProject)?.project.price_per_credit || 0}
                            </p>
                          )}
                        </div>
                        
                        {selectedSellProject && sellQuantity > 0 && sellPrice > 0 && (
                          <div className="bg-teal-50/60 backdrop-blur-sm p-5 rounded-2xl border border-teal-200/60 shadow-soft animate-slide-up">
                            <h4 className="font-bold text-teal-950 mb-3">Listing Summary</h4>
                            <div className="space-y-2 text-sm font-medium">
                              <div className="flex justify-between border-b border-teal/10 pb-1.5">
                                <span className="text-gray-600">Project:</span>
                                <span className="text-gray-900 font-bold">
                                  {userCredits.find(c => c.project.id === selectedSellProject)?.project.name}
                                </span>
                              </div>
                              <div className="flex justify-between border-b border-teal/10 pb-1.5">
                                <span className="text-gray-600">Quantity:</span>
                                <span className="text-teal-700 font-bold">
                                  {sellQuantity} credits
                                </span>
                              </div>
                              <div className="flex justify-between border-b border-teal/10 pb-1.5">
                                <span className="text-gray-600">Listing Price per credit:</span>
                                <span className="text-teal-700 font-bold">
                                  ₹{sellPrice.toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="flex justify-between pt-1">
                                <span className="text-gray-900 font-bold text-base">Total Value:</span>
                                <span className="text-teal font-extrabold text-lg">
                                  ₹{(sellPrice * sellQuantity).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <button
                          onClick={handleSellCredits}
                          disabled={!selectedSellProject || sellQuantity <= 0 || sellPrice <= 0 || loading}
                          className="w-full bg-teal-gradient text-white py-4 px-6 rounded-xl font-bold shadow-medium hover:shadow-strong transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105 btn-hover"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Listing on Market...</span>
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-5 w-5" />
                              <span>List Credits for Sale</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-900 text-lg flex items-center space-x-2">
                        <span className="w-2 h-4 bg-teal rounded-full inline-block"></span>
                        <span>Your Available Credits</span>
                      </h4>
                      <div className="space-y-4 max-h-128 overflow-y-auto pr-2">
                        {userCredits.map((credit) => (
                          <div key={credit.project.id} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-soft hover:border-teal/30 transition-all duration-300 card-hover">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-bold text-gray-900 text-base">{credit.project.name}</h5>
                              <span className="bg-teal/10 text-teal-800 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                                {credit.quantity} credits
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed font-medium">{credit.project.description}</p>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                              <span className="text-gray-500 text-sm font-semibold">
                                Market: ₹{credit.project.price_per_credit.toLocaleString('en-IN')}/credit
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedSellProject(credit.project.id)
                                  setSellPrice(credit.project.price_per_credit)
                                }}
                                className="bg-teal/10 text-teal hover:bg-teal hover:text-white px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300"
                              >
                                Select
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div className="space-y-8 animate-fade-scale">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-royal-blue/10 p-2.5 rounded-xl">
                    <CreditCard className="h-6 w-6 text-royal-blue" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Carbon Credit Marketplace</h3>
                </div>

                {saleOrders.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-soft">
                    <CreditCard className="h-20 w-20 text-gray-300 mx-auto mb-4 animate-float" />
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No Listings Right Now</h3>
                    <p className="text-gray-600 font-medium">
                      Be the first to list carbon credits for sale on the peer-to-peer marketplace!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {saleOrders.map((order) => (
                      <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-soft hover:shadow-strong transition-all duration-300 card-hover flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-gray-900 text-base">{order.projects?.name}</h4>
                              <p className="text-xs text-gray-500 font-semibold mt-0.5">Seller: {order.profiles?.name}</p>
                            </div>
                            <span className="bg-teal/10 text-teal-800 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                              {order.quantity} credits
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed font-medium">{order.projects?.description}</p>
                        </div>
                        
                        <div>
                          <div className="space-y-2 mb-5 pt-3 border-t border-gray-50">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="text-gray-500">Price per credit:</span>
                              <span className="font-bold text-gray-900">₹{order.price_per_credit.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium items-center">
                              <span className="text-gray-500">Total value:</span>
                              <span className="font-extrabold text-lg text-saffron">₹{order.total_value.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleBuyFromMarketplace(order)}
                            disabled={loading || order.seller_id === user?.id}
                            className="w-full bg-royal-gradient text-white py-3 px-4 rounded-xl font-bold shadow-medium hover:shadow-strong transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-103 btn-hover"
                          >
                            {order.seller_id === user?.id ? 'Your Listing' : 'Buy Now'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
             {activeTab === 'transactions' && (
              <div className="space-y-8 animate-fade-scale">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <span className="w-2.5 h-6 bg-saffron rounded-full inline-block"></span>
                  <span>Transaction History</span>
                </h3>
                
                {transactions.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-soft">
                    <Calculator className="h-20 w-20 text-gray-300 mx-auto mb-4 animate-float" />
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No Transactions Yet</h3>
                    <p className="text-gray-600 font-medium">
                      Your ledger is currently empty. Buy or list carbon credits to begin.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/70 text-gray-700">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                              Project
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                              Total Cost
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100 text-sm font-semibold text-gray-800">
                          {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-cream-50/40 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                                {transaction.projects?.name || 'Unknown Project'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${
                                  transaction.type === 'buy' 
                                    ? 'bg-saffron/10 text-saffron-800 border border-saffron/20' 
                                    : 'bg-teal/10 text-teal-800 border border-teal/20'
                                }`}>
                                  {transaction.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {transaction.quantity} credits
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-extrabold">
                                ₹{transaction.total_cost.toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'impact' && (
              <div className="space-y-8 animate-fade-scale">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                  <span className="w-2.5 h-6 bg-teal rounded-full inline-block"></span>
                  <span>Your Environmental Impact</span>
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft">
                    <h4 className="font-bold text-gray-900 mb-6 text-lg">Monthly Offsets (tons CO₂)</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                        <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                        <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #FF9933' }} />
                        <Bar dataKey="offset" fill="#FF9933" radius={[4, 4, 0, 0]} maxBarSize={45}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.offset >= 0 ? '#FF9933' : '#006666'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-6">
                    <h4 className="font-bold text-gray-900 text-lg flex items-center space-x-2">
                      <span>Equivalent Environmental Gains</span>
                    </h4>
                    <div className="space-y-4">
                      <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50 shadow-soft flex items-center justify-between card-hover">
                        <div>
                          <div className="text-3xl font-extrabold text-green-950">
                            {Math.round((profile?.total_co2_offset || 0) * 2.5).toLocaleString('en-IN')}
                          </div>
                          <div className="text-sm font-bold text-green-800 mt-1">Trees Planted & Grown</div>
                          <p className="text-xs text-green-600/80 mt-0.5">Equivalent lifetime CO₂ absorption of mature native trees</p>
                        </div>
                        <div className="text-4xl">🌳</div>
                      </div>
                      
                      <div className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-200/50 shadow-soft flex items-center justify-between card-hover">
                        <div>
                          <div className="text-3xl font-extrabold text-teal-950">
                            {Math.round((profile?.total_co2_offset || 0) * 2600).toLocaleString('en-IN')}
                          </div>
                          <div className="text-sm font-bold text-teal-800 mt-1">Passenger Vehicle Miles Saved</div>
                          <p className="text-xs text-teal-600/80 mt-0.5">Equivalent emissions of average petrol vehicles avoided</p>
                        </div>
                        <div className="text-4xl">🚗</div>
                      </div>
                      
                      <div className="p-5 bg-gradient-to-br from-indigo-50 to-royal-blue-50 rounded-2xl border border-indigo-200/50 shadow-soft flex items-center justify-between card-hover">
                        <div>
                          <div className="text-3xl font-extrabold text-royal-blue">
                            {Math.round((profile?.total_co2_offset || 0) * 1200).toLocaleString('en-IN')}
                          </div>
                          <div className="text-sm font-bold text-royal-blue-800 mt-1">Clean Energy Generated (kWh)</div>
                          <p className="text-xs text-royal-blue-600/80 mt-0.5">Equivalent solar or wind grid output for typical homes</p>
                        </div>
                        <div className="text-4xl">⚡</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
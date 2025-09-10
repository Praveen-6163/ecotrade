import React, { useState, useEffect } from 'react'
import { User, CreditCard, TrendingUp, Award, Calculator, ShoppingCart, DollarSign, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
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
    { name: 'Purchases', value: transactions.filter(t => t.type === 'buy').length, color: '#16a34a' },
    { name: 'Sales', value: transactions.filter(t => t.type === 'sell').length, color: '#2563eb' }
  ]

  const badges = [
    { name: 'Green Hero', icon: '🌱', condition: (profile?.total_co2_offset || 0) >= 100 },
    { name: 'Carbon Warrior', icon: '⚡', condition: (profile?.total_co2_offset || 0) >= 500 },
    { name: 'Planet Protector', icon: '🌍', condition: (profile?.total_co2_offset || 0) >= 1000 },
    { name: 'Climate Champion', icon: '🏆', condition: (profile?.total_co2_offset || 0) >= 5000 }
  ]

  const userCredits = getUserCreditsByProject()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.name}!</h1>
          <p className="text-gray-600">Manage your carbon credits and track your environmental impact</p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            notification.type === 'success' ? 'bg-green-50 border-green-400 text-green-700' :
            notification.type === 'error' ? 'bg-red-50 border-red-400 text-red-700' :
            'bg-blue-50 border-blue-400 text-blue-700'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' && <CheckCircle className="h-5 w-5 mr-2" />}
              {notification.type === 'error' && <AlertCircle className="h-5 w-5 mr-2" />}
              {notification.type === 'info' && <Info className="h-5 w-5 mr-2" />}
              {notification.message}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 rounded-lg p-2">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Credits Owned</p>
                <p className="text-2xl font-bold text-gray-900">{profile?.credits_owned || 0} credits</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="bg-teal/10 rounded-lg p-2">
                <TrendingUp className="h-6 w-6 text-teal" />
              </div>
              <div>
                <p className="text-sm text-gray-600">CO₂ Offset (tons)</p>
                <p className="text-2xl font-bold text-gray-900">{profile?.total_co2_offset || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="bg-royal-blue/10 rounded-lg p-2">
                <Award className="h-6 w-6 text-royal-blue" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Badges Earned</p>
                <p className="text-2xl font-bold text-gray-900">{badges.filter(b => b.condition).length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="bg-saffron/10 rounded-lg p-2">
                <Calculator className="h-6 w-6 text-saffron" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'buy', label: 'Buy Credits', icon: ShoppingCart },
                { id: 'sell', label: 'Sell Credits', icon: DollarSign },
                { id: 'marketplace', label: 'Marketplace', icon: CreditCard },
                { id: 'transactions', label: 'Transactions', icon: Calculator },
                { id: 'impact', label: 'Impact', icon: Award }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-colors flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-saffron text-saffron'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">CO₂ Offset Progress</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="cumulative" stroke="#FF9933" strokeWidth={3} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Transaction Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={transactionTypeData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {transactionTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Badges</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {badges.map((badge, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          badge.condition
                            ? 'border-green-200 bg-green-50 transform hover:scale-105'
                            : 'border-gray-200 bg-gray-50 opacity-50'
                        }`}
                      >
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <div className="font-medium text-sm">{badge.name}</div>
                        {badge.condition && (
                          <div className="text-xs text-green-600 mt-1">Earned!</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'buy' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <ShoppingCart className="h-6 w-6 text-green-600" />
                  <h3 className="text-lg font-semibold">Buy Carbon Credits</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Info className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium text-blue-900">How it works</h4>
                      </div>
                      <p className="text-sm text-blue-700">
                        Purchase verified carbon credits from environmental projects. Each credit represents 1 ton of CO₂ offset.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Project *
                        </label>
                        <select
                          value={selectedProject}
                          onChange={(e) => setSelectedProject(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        >
                          <option value="">Choose a project...</option>
                          {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                              {project.name} - ${project.price_per_credit}/credit
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity (credits) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                          placeholder="Enter quantity"
                        />
                      </div>
                      
                      {selectedProject && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-medium text-green-900 mb-2">Purchase Summary</h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-600">
                              Project: <span className="font-medium text-gray-900">
                                {projects.find(p => p.id === selectedProject)?.name}
                              </span>
                            </p>
                            <p className="text-gray-600">
                              Price per credit: <span className="font-medium text-saffron">
                                ₹{projects.find(p => p.id === selectedProject)?.price_per_credit?.toLocaleString('en-IN')}
                              </span>
                            </p>
                            <p className="text-gray-600">
                              Total Cost: <span className="font-bold text-saffron text-lg">
                                ₹{((projects.find(p => p.id === selectedProject)?.price_per_credit || 0) * quantity).toLocaleString('en-IN')}
                              </span>
                            </p>
                            <p className="text-gray-600">
                              CO₂ Offset: <span className="font-medium text-teal">
                                {quantity} tons
                              </span>
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={handleBuyCredits}
                        disabled={!selectedProject || quantity <= 0 || loading}
                        className="w-full bg-gradient-to-r from-saffron to-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-500 hover:to-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-5 w-5" />
                            <span>Purchase Credits</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Available Projects</h4>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {projects.map((project) => (
                        <div key={project.id} className="p-4 border rounded-lg hover:border-green-300 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-semibold text-gray-900">{project.name}</h5>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              {project.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-saffron font-bold text-lg">₹{project.price_per_credit.toLocaleString('en-IN')}/credit</span>
                            <button
                              onClick={() => setSelectedProject(project.id)}
                              className="text-saffron hover:text-orange-600 font-medium text-sm transition-colors duration-300"
                            >
                              Select Project
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
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold">Sell Carbon Credits</h3>
                </div>

                {userCredits.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Credits to Sell</h3>
                    <p className="text-gray-600 mb-4">
                      You need to purchase carbon credits before you can sell them.
                    </p>
                    <button
                      onClick={() => setActiveTab('buy')}
                      className="bg-gradient-to-r from-saffron to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:from-orange-500 hover:to-red-500 transition-all duration-300 transform hover:scale-105"
                    >
                      Buy Credits First
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Info className="h-5 w-5 text-blue-600" />
                          <h4 className="font-medium text-blue-900">Selling Credits</h4>
                        </div>
                        <p className="text-sm text-blue-700">
                          List your carbon credits for sale on our marketplace. Set your own price and let other users purchase them.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Project Credits *
                          </label>
                          <select
                            value={selectedSellProject}
                            onChange={(e) => setSelectedSellProject(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity to Sell *
                          </label>
                          <input
                            type="number"
                            min="1"
                            max={userCredits.find(c => c.project.id === selectedSellProject)?.quantity || 0}
                            value={sellQuantity}
                            onChange={(e) => setSellQuantity(parseInt(e.target.value) || 1)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter quantity"
                          />
                          {selectedSellProject && (
                            <p className="text-xs text-gray-500 mt-1">
                              Available: {userCredits.find(c => c.project.id === selectedSellProject)?.quantity || 0} credits
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price per Credit ($) *
                          </label>
                          <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Set your price"
                          />
                          {selectedSellProject && (
                            <p className="text-xs text-gray-500 mt-1">
                              Market price: ${userCredits.find(c => c.project.id === selectedSellProject)?.project.price_per_credit || 0}
                            </p>
                          )}
                        </div>
                        
                        {selectedSellProject && sellQuantity > 0 && sellPrice > 0 && (
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h4 className="font-medium text-blue-900 mb-2">Sale Summary</h4>
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-600">
                                Project: <span className="font-medium text-gray-900">
                                  {userCredits.find(c => c.project.id === selectedSellProject)?.project.name}
                                </span>
                              </p>
                              <p className="text-gray-600">
                                Quantity: <span className="font-medium text-blue-600">
                                  {sellQuantity} credits
                                </span>
                              </p>
                              <p className="text-gray-600">
                                Price per credit: <span className="font-medium text-blue-600">
                                  ₹{sellPrice.toLocaleString('en-IN')}
                                </span>
                              </p>
                              <p className="text-gray-600">
                                Total Value: <span className="font-bold text-blue-600 text-lg">
                                  ₹{(sellPrice * sellQuantity).toLocaleString('en-IN')}
                                </span>
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <button
                          onClick={handleSellCredits}
                          disabled={!selectedSellProject || sellQuantity <= 0 || sellPrice <= 0 || loading}
                          className="w-full bg-gradient-to-r from-teal to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transform hover:scale-105"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Listing...</span>
                            </>
                          ) : (
                            <>
                              <DollarSign className="h-5 w-5" />
                              <span>List for Sale</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Your Available Credits</h4>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {userCredits.map((credit) => (
                          <div key={credit.project.id} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <h5 className="font-semibold text-gray-900">{credit.project.name}</h5>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                {credit.quantity} credits
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{credit.project.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-500 text-sm">
                                Market: ₹{credit.project.price_per_credit.toLocaleString('en-IN')}/credit
                              </span>
                              <button
                                onClick={() => {
                                  setSelectedSellProject(credit.project.id)
                                  setSellPrice(credit.project.price_per_credit)
                                }}
                                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                              >
                                Select to Sell
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
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                  <h3 className="text-lg font-semibold">Credit Marketplace</h3>
                </div>

                {saleOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Credits for Sale</h3>
                    <p className="text-gray-600">
                      Be the first to list credits for sale on the marketplace!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {saleOrders.map((order) => (
                      <div key={order.id} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{order.projects?.name}</h4>
                            <p className="text-sm text-gray-500">by {order.profiles?.name}</p>
                          </div>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            {order.quantity} credits
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">{order.projects?.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Price per credit:</span>
                            <span className="font-medium">₹{order.price_per_credit.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Total value:</span>
                            <span className="font-bold text-lg text-saffron">₹{order.total_value.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleBuyFromMarketplace(order)}
                          disabled={loading || order.seller_id === user?.id}
                          className="w-full bg-gradient-to-r from-royal-blue to-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                        >
                          {order.seller_id === user?.id ? 'Your Listing' : 'Buy Now'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Transaction History</h3>
                
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
                    <p className="text-gray-600">
                      Start buying or selling carbon credits to see your transaction history.
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Project
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Cost
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(transaction.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {transaction.projects?.name || 'Unknown Project'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  transaction.type === 'buy' 
                                    ? 'bg-saffron/10 text-saffron' 
                                    : 'bg-teal/10 text-teal'
                                }`}>
                                  {transaction.type.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {transaction.quantity} credits
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Your Environmental Impact</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Monthly Activity</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="offset" fill="#FF9933" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Impact Equivalents</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-saffron/10 rounded-lg border border-saffron/20">
                        <div className="text-2xl font-bold text-saffron">
                          {Math.round((profile?.total_co2_offset || 0) * 2.5).toLocaleString('en-IN')}
                        </div>
                        <div className="text-sm text-gray-600">Trees planted equivalent</div>
                      </div>
                      
                      <div className="p-4 bg-teal/10 rounded-lg border border-teal/20">
                        <div className="text-2xl font-bold text-teal">
                          {Math.round((profile?.total_co2_offset || 0) * 2600).toLocaleString('en-IN')}
                        </div>
                        <div className="text-sm text-gray-600">Miles driven offset</div>
                      </div>
                      
                      <div className="p-4 bg-royal-blue/10 rounded-lg border border-royal-blue/20">
                        <div className="text-2xl font-bold text-royal-blue">
                          {Math.round((profile?.total_co2_offset || 0) * 1200).toLocaleString('en-IN')}
                        </div>
                        <div className="text-sm text-gray-600">kWh of clean energy</div>
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
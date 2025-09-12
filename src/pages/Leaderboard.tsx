import React, { useState, useEffect } from 'react'
import { Trophy, Medal, Award, TrendingUp, Users, Search, Filter, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface LeaderboardUser {
  id: string
  name: string
  total_co2_offset: number
  credits_owned: number
  badges: string[]
  created_at: string
}

export function Leaderboard() {
  const { user } = useAuth()
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'co2_offset' | 'credits' | 'badges'>('co2_offset')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  useEffect(() => {
    filterAndSortUsers()
  }, [users, searchTerm, sortBy])

  const loadLeaderboard = async () => {
    try {
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('id, name, total_co2_offset, credits_owned, badges, created_at')
        .order('total_co2_offset', { ascending: false })
        .limit(100)
      
      if (fetchError) throw fetchError
      
      setUsers(data || [])
    } catch (err) {
      setError('Failed to load leaderboard data. Please try again.')
      console.error('Leaderboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshLeaderboard = async () => {
    setRefreshing(true)
    await loadLeaderboard()
    setRefreshing(false)
  }

  const filterAndSortUsers = () => {
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'credits':
          return b.credits_owned - a.credits_owned
        case 'badges':
          return b.badges.length - a.badges.length
        default:
          return b.total_co2_offset - a.total_co2_offset
      }
    })

    setFilteredUsers(filtered)
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return (
          <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center text-sm font-bold text-green-700 shadow-sm">
            {rank}
          </div>
        )
    }
  }

  const getBadgeIcon = (offset: number) => {
    if (offset >= 5000) return '🏆'
    if (offset >= 1000) return '🌍'
    if (offset >= 500) return '⚡'
    if (offset >= 100) return '🌱'
    return '🌿'
  }

  const getBadgeTitle = (offset: number) => {
    if (offset >= 5000) return 'Climate Champion'
    if (offset >= 1000) return 'Planet Protector'
    if (offset >= 500) return 'Carbon Warrior'
    if (offset >= 100) return 'Green Hero'
    return 'Eco Starter'
  }

  const getCurrentUserRank = () => {
    if (!user) return null
    const userIndex = filteredUsers.findIndex(u => u.id === user.id)
    return userIndex >= 0 ? userIndex + 1 : null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-saffron-50 to-orange-50 flex items-center justify-center">
        <div className="text-center animate-fade-scale">
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <TrendingUp className="h-16 w-16 text-saffron mx-auto mb-4 animate-pulse" />
            <p className="text-xl font-semibold text-gray-700">Loading Global Leaderboard...</p>
            <p className="text-gray-500 mt-2">Fetching climate champions data</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-saffron-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadLeaderboard}
              className="bg-saffron-gradient text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-saffron-50 to-orange-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-saffron-gradient p-3 rounded-xl shadow-lg">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-saffron">Global Leaderboard</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover India's top climate champions making a real difference in carbon offset trading
          </p>
          
          {/* User's Current Rank */}
          {user && getCurrentUserRank() && (
            <div className="mt-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg inline-block">
              <p className="text-gray-600">Your current rank:</p>
              <div className="flex items-center justify-center space-x-2 mt-1">
                {getRankIcon(getCurrentUserRank()!)}
                <span className="text-2xl font-bold text-saffron">#{getCurrentUserRank()}</span>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Controls */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8 animate-fade-scale">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search climate champions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-saffron transition-all duration-300"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-saffron focus:border-saffron transition-all duration-300"
                >
                  <option value="co2_offset">CO₂ Offset</option>
                  <option value="credits">Credits Owned</option>
                  <option value="badges">Badges Earned</option>
                </select>
              </div>
              
              <button
                onClick={refreshLeaderboard}
                disabled={refreshing}
                className="flex items-center space-x-2 bg-teal text-white px-4 py-2 rounded-xl hover:bg-teal-600 transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredUsers.length} of {users.length} climate champions</span>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Total CO₂ Offset: {users.reduce((sum, user) => sum + user.total_co2_offset, 0).toLocaleString()} tons</span>
            </div>
          </div>
        </div>

        {/* Enhanced Top 3 Podium */}
        {filteredUsers.length >= 3 && (
          <div className="mb-12 animate-fade-scale">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">🏆 Top Climate Champions 🏆</h2>
            <div className="flex justify-center items-end space-x-4 flex-wrap">
              {/* 2nd Place */}
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center w-64 transform hover:scale-105 transition-all duration-300 card-hover">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Medal className="h-10 w-10 text-gray-500" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{filteredUsers[1].name}</h3>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-600">{filteredUsers[1].total_co2_offset.toLocaleString()} tons</p>
                  <p className="text-sm text-gray-500">{filteredUsers[1].credits_owned} credits • {filteredUsers[1].badges.length} badges</p>
                  <div className="text-4xl mt-3">{getBadgeIcon(filteredUsers[1].total_co2_offset)}</div>
                  <p className="text-xs font-medium text-gray-600">{getBadgeTitle(filteredUsers[1].total_co2_offset)}</p>
                </div>
              </div>

              {/* 1st Place */}
              <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-2xl p-8 shadow-2xl text-center w-72 transform scale-110 hover:scale-115 transition-all duration-300 animate-pulse-glow">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
                <h3 className="font-bold text-2xl text-white mb-3">{filteredUsers[0].name}</h3>
                <div className="space-y-3">
                  <p className="text-4xl font-bold text-white">{filteredUsers[0].total_co2_offset.toLocaleString()} tons</p>
                  <p className="text-sm text-yellow-100">{filteredUsers[0].credits_owned} credits • {filteredUsers[0].badges.length} badges</p>
                  <div className="text-5xl mt-4">{getBadgeIcon(filteredUsers[0].total_co2_offset)}</div>
                  <p className="text-sm font-medium text-yellow-100">{getBadgeTitle(filteredUsers[0].total_co2_offset)}</p>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center w-64 transform hover:scale-105 transition-all duration-300 card-hover">
                <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award className="h-10 w-10 text-amber-600" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{filteredUsers[2].name}</h3>
                <div className="space-y-2">
                  <p className="text-3xl font-bold text-gray-600">{filteredUsers[2].total_co2_offset.toLocaleString()} tons</p>
                  <p className="text-sm text-gray-500">{filteredUsers[2].credits_owned} credits • {filteredUsers[2].badges.length} badges</p>
                  <div className="text-4xl mt-3">{getBadgeIcon(filteredUsers[2].total_co2_offset)}</div>
                  <p className="text-xs font-medium text-gray-600">{getBadgeTitle(filteredUsers[2].total_co2_offset)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Full Leaderboard */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden animate-slide-up">
          <div className="bg-saffron-gradient p-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
              <Trophy className="h-6 w-6" />
              <span>Complete Rankings</span>
            </h2>
            <p className="text-orange-100 mt-2">India's most dedicated climate champions</p>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredUsers.map((user, index) => (
                <div
                  key={user.id}
                  className={`p-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-saffron-50 hover:to-orange-50 transition-all duration-300 transform hover:scale-[1.02] ${
                    index < 3 ? 'bg-gradient-to-r from-green-50 to-teal-50 border-l-4 border-saffron' : ''
                  } ${user.id === user?.id ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500' : ''}`}
                >
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0 relative">
                      {getRankIcon(index + 1)}
                      {index < 3 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-saffron rounded-full animate-pulse"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-xl text-gray-900">{user.name}</h3>
                        {user.id === user?.id && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            You
                          </span>
                        )}
                        <span className="text-2xl">{getBadgeIcon(user.total_co2_offset)}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          <span>{user.credits_owned.toLocaleString()} credits</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          <span>{user.badges.length} badges</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                          <span>Since {new Date(user.created_at).getFullYear()}</span>
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-medium">{getBadgeTitle(user.total_co2_offset)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="text-3xl font-bold text-saffron">
                          {user.total_co2_offset.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">tons CO₂ offset</div>
                      </div>
                      {index < 3 && (
                        <div className="text-4xl animate-bounce">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enhanced Stats Footer */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-scale">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center card-hover">
            <div className="text-3xl mb-2">🌍</div>
            <div className="text-2xl font-bold text-saffron">{users.reduce((sum, user) => sum + user.total_co2_offset, 0).toLocaleString()}</div>
            <div className="text-gray-600">Total CO₂ Offset (tons)</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center card-hover">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-teal">{users.length.toLocaleString()}</div>
            <div className="text-gray-600">Active Climate Champions</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center card-hover">
            <div className="text-3xl mb-2">💳</div>
            <div className="text-2xl font-bold text-royal-blue">{users.reduce((sum, user) => sum + user.credits_owned, 0).toLocaleString()}</div>
            <div className="text-gray-600">Total Credits Owned</div>
          </div>
        </div>
      </div>
    </div>
  )
}
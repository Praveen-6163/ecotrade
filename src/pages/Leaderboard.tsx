import React, { useState, useEffect } from 'react'
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface LeaderboardUser {
  id: string
  name: string
  total_co2_offset: number
  credits_owned: number
  badges: string[]
}

export function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, name, total_co2_offset, credits_owned, badges')
      .order('total_co2_offset', { ascending: false })
      .limit(50)
    
    setUsers(data || [])
    setLoading(false)
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
        return <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-600">{rank}</div>
    }
  }

  const getBadgeIcon = (offset: number) => {
    if (offset >= 5000) return '🏆'
    if (offset >= 1000) return '🌍'
    if (offset >= 500) return '⚡'
    if (offset >= 100) return '🌱'
    return '🌿'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Global Leaderboard</h1>
          <p className="text-xl text-gray-600">
            See how you rank among our community of climate champions
          </p>
        </div>

        {/* Top 3 Podium */}
        {users.length >= 3 && (
          <div className="mb-12">
            <div className="flex justify-center items-end space-x-4">
              {/* 2nd Place */}
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center w-48">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Medal className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">{users[1].name}</h3>
                <p className="text-2xl font-bold text-gray-600">{users[1].total_co2_offset} tons</p>
                <div className="text-3xl mt-2">{getBadgeIcon(users[1].total_co2_offset)}</div>
              </div>

              {/* 1st Place */}
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-6 shadow-xl text-center w-56 transform scale-110">
                <div className="bg-white/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
                <h3 className="font-bold text-xl text-white">{users[0].name}</h3>
                <p className="text-3xl font-bold text-white">{users[0].total_co2_offset} tons</p>
                <div className="text-4xl mt-2">{getBadgeIcon(users[0].total_co2_offset)}</div>
              </div>

              {/* 3rd Place */}
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center w-48">
                <div className="bg-amber-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">{users[2].name}</h3>
                <p className="text-2xl font-bold text-gray-600">{users[2].total_co2_offset} tons</p>
                <div className="text-3xl mt-2">{getBadgeIcon(users[2].total_co2_offset)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
            <h2 className="text-2xl font-bold text-white">Complete Rankings</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {users.map((user, index) => (
              <div
                key={user.id}
                className={`p-6 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                  index < 3 ? 'bg-green-50' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getRankIcon(index + 1)}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">
                      {user.credits_owned} credits owned • {user.badges.length} badges earned
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl">{getBadgeIcon(user.total_co2_offset)}</span>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {user.total_co2_offset}
                      </div>
                      <div className="text-sm text-gray-500">tons CO₂</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No rankings yet</h3>
            <p className="text-gray-600">
              Be the first to start trading and make it to the leaderboard!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
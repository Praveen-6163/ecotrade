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
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold animate-pulse">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 py-12 transition-all duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4 flex items-center justify-center space-x-3">
            <span className="bg-saffron-gradient p-2 rounded-xl text-white shadow-glow-saffron inline-block">
              <Trophy className="h-7 w-7" />
            </span>
            <span className="text-gradient-saffron">Global Leaderboard</span>
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            See how you rank among our pan-India community of climate champions
          </p>
        </div>

        {/* Top 3 Podium */}
        {users.length >= 3 && (
          <div className="mb-14 animate-fade-scale">
            <div className="flex flex-col md:flex-row justify-center items-center md:items-end gap-6 md:gap-4">
              {/* 2nd Place */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-soft text-center w-52 border border-gray-200/50 card-hover order-2 md:order-1">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-200">
                  <Medal className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="font-extrabold text-lg text-gray-900 tracking-tight">{users[1].name}</h3>
                <p className="text-2xl font-black text-gray-500 mt-1">{users[1].total_co2_offset} tons</p>
                <div className="text-3xl mt-2 animate-float-delayed">{getBadgeIcon(users[1].total_co2_offset)}</div>
              </div>

              {/* 1st Place */}
              <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-3xl p-8 text-center w-56 transform md:scale-110 shadow-strong hover:shadow-2xl border border-yellow-300/40 relative card-hover order-1 md:order-2 text-white">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-300 text-yellow-950 font-black text-xs uppercase px-3 py-1 rounded-full tracking-wider shadow">
                  Champion
                </div>
                <div className="bg-white/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Trophy className="h-12 w-12 text-yellow-100 animate-pulse" />
                </div>
                <h3 className="font-black text-xl tracking-tight text-white">{users[0].name}</h3>
                <p className="text-3xl font-black text-white mt-1">{users[0].total_co2_offset} tons</p>
                <div className="text-4xl mt-2 animate-float">{getBadgeIcon(users[0].total_co2_offset)}</div>
              </div>

              {/* 3rd Place */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-soft text-center w-52 border border-amber-200/40 card-hover order-3">
                <div className="bg-amber-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-sm border border-amber-200/50">
                  <Award className="h-10 w-10 text-amber-600 animate-pulse" />
                </div>
                <h3 className="font-extrabold text-lg text-gray-900 tracking-tight">{users[2].name}</h3>
                <p className="text-2xl font-black text-amber-800/80 mt-1">{users[2].total_co2_offset} tons</p>
                <div className="text-3xl mt-2 animate-float-delayed">{getBadgeIcon(users[2].total_co2_offset)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-strong overflow-hidden border border-saffron/10 animate-fade-scale">
          <div className="bg-gradient-to-r from-teal to-royal-blue p-6 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-white">Complete Rankings</h2>
            <span className="text-xs font-bold text-teal-100 uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full">Pan-India</span>
          </div>
          
          <div className="divide-y divide-gray-100">
            {users.map((user, index) => {
              const isTop3 = index < 3
              return (
                <div
                  key={user.id}
                  className={`p-6 flex items-center justify-between hover:bg-cream-50/40 transition-colors ${
                    isTop3 ? 'bg-gradient-to-r from-cream-50/70 to-cream-100/20' : ''
                  }`}
                >
                  <div className="flex items-center space-x-5">
                    <div className="flex-shrink-0">
                      {getRankIcon(index + 1)}
                    </div>
                    
                    <div>
                      <h3 className="font-extrabold text-lg text-gray-900 tracking-tight">{user.name}</h3>
                      <p className="text-sm font-semibold text-gray-500 mt-0.5">
                        {user.credits_owned} credits owned • {user.badges.length} badges earned
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl animate-float-delayed">{getBadgeIcon(user.total_co2_offset)}</span>
                      <div>
                        <div className="text-2xl font-black text-teal">
                          {user.total_co2_offset}
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-400">tons CO₂</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {users.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-soft">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">No rankings yet</h3>
            <p className="text-gray-600 font-medium">
              Be the first to start trading and claim the top spot on the leaderboard!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
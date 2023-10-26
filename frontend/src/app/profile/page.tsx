'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { IMoviesListItem } from '@/types'
import { getUserFeedback } from '@/services/feedback'
import { useAuth } from '@/hooks/useAuth'

import { MoviesGrid, Footer } from '@/components'

export default function ProfilePage() {
  const { user } = useAuth()

  const [watchlist, setWatchlist] = useState<IMoviesListItem[]>([])

  const router = useRouter()

  const fetchWatchlist = async () => {
    if (!user) {
      return router.back()
    }

    try {
      const data = await getUserFeedback(user.id)

      if (data) {
        setWatchlist(data?.watchlist?.reverse())
      }
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  useEffect(() => {
    if (!user) {
      router.back()
    }

    fetchWatchlist()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="w-[90%] mx-auto sm:w-full sm:px-12 pt-32">
      {/* User Info */}
      <div className="flex flex-col items-center justify-center gap-4 mb-12">
        <div className="w-24 h-24 flex justify-center items-center rounded-full bg-violet-950 border border-stone-700/60 text-3xl font-bold uppercase">
          {user?.email?.[0]}
        </div>
        <div>
          <p className="text-center text-white/90 text-lg font-bold mb-1">{user?.email}</p>
          <p className="text-center text-white/50">Welcome!</p>
        </div>
      </div>

      {/* User Watchlist */}
      <section className="w-full mb-12">
        <h2 className="font-bold text-white/90 mb-4">My Watchlist</h2>
        <MoviesGrid movies={watchlist} />
      </section>

      <Footer />
    </main>
  )
}

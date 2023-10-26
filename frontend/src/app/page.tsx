'use client'

import { useState, useEffect } from 'react'

import { IMoviesListItem, RecommenderTypes } from '@/types.d'

import { getRecommendedMovies, getPopularMovies, getLatestMovies } from '@/services/movies'
import { useAuth } from '@/hooks/useAuth'

import { GenresSlider, MoviesSlider, Footer } from '@/components'

export default function HomePage() {
  const [recommendedMovies, setRecommendedMovies] = useState<IMoviesListItem[]>([])
  const [popularMovies, setPopularMovies] = useState<IMoviesListItem[]>([])
  const [latestMovies, setLatestMovies] = useState<IMoviesListItem[]>([])

  const { user } = useAuth()

  const fetchRecommendedMovies = async (userId: string) => {
    try {
      const data = await getRecommendedMovies(userId, RecommenderTypes.ItemBased, 18)
      setRecommendedMovies(data)
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  const fetchPopularMovies = async () => {
    try {
      const data = await getPopularMovies(18)
      setPopularMovies(data)
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  const fetchLatestMovies = async () => {
    try {
      const data = await getLatestMovies(18)
      setLatestMovies(data)
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchRecommendedMovies(user.id)
    }
    fetchPopularMovies()
    fetchLatestMovies()
  }, [user])

  return (
    <main className="w-[90%] mx-auto sm:w-full sm:px-12 pt-32">
      <section className="mb-12">
        <h2 className="font-bold text-white/90 mb-4">Browse by Genre</h2>
        <GenresSlider />
      </section>

      <MoviesSlider
        title="Recommended for You"
        movies={recommendedMovies}
        className="my-12"
      />
      <MoviesSlider
        title="Popular Movies"
        movies={popularMovies}
        className="mb-12"
      />
      <MoviesSlider
        title="Latest Movies"
        movies={latestMovies}
        className="mb-12"
      />

      <Footer />
    </main>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { IMoviesListItem, RecommenderTypes } from '@/types.d'
import { prettifyGenre } from '@/utils/movies'
import { getLatestMovies, getPopularMovies, getRecommendedMovies } from '@/services/movies'
import { useAuth } from '@/hooks/useAuth'

import { MoviesSlider, Footer } from '@/components'

export default function GenrePage({ params }: { params: { id: string } }) {
  const [recommendedMovies, setRecommendedMovies] = useState<IMoviesListItem[]>([])
  const [popularMovies, setPopularMovies] = useState<IMoviesListItem[]>([])
  const [latestMovies, setLatestMovies] = useState<IMoviesListItem[]>([])

  const searchParams = useSearchParams()

  const genreId = params.id
  const genreName = searchParams.get('name')

  const { user } = useAuth()

  const fetchRecommendedMovies = async (userId: string) => {
    try {
      const data = await getRecommendedMovies(userId, RecommenderTypes.ItemBased, 18, genreId)
      setRecommendedMovies(data)
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  const fetchPopularMovies = async () => {
    try {
      const data = await getPopularMovies(18, genreId)
      setPopularMovies(data)
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  const fetchLatestMovies = async () => {
    try {
      const data = await getLatestMovies(18, genreId)
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
  }, [genreId, user]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="w-[90%] mx-auto sm:w-full sm:px-12 pt-[4.2em]">
      <h1 className="text-lg font-bold text-white/50 text-center mb-16">{prettifyGenre(genreName || genreId)}</h1>

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

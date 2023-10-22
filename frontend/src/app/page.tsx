'use client'

import { useState, useEffect } from 'react'

import { ENV } from '@/config'
import { IMoviesListItem } from '@/types'

import { useAuth } from '@/hooks/useAuth'

import { GenresSlider, MoviesSlider, Footer } from '@/components'

export default function HomePage() {
  const [recommendedMovies, setRecommendedMovies] = useState<IMoviesListItem[]>([])
  const [popularMovies, setPopularMovies] = useState<IMoviesListItem[]>([])
  const [latestMovies, setLatestMovies] = useState<IMoviesListItem[]>([])

  const { user } = useAuth()

  const getRecommendedMovies = async (userId: string) => {
    const url = ENV.SERVER_API_URL + `/recommend/${userId}/item_based?n=18`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    setRecommendedMovies(data as IMoviesListItem[])
  }

  const getPopularMovies = async () => {
    const url = ENV.SERVER_API_URL + '/movies/popular?n=18'

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    setPopularMovies(data as IMoviesListItem[])
  }

  const getLatestMovies = async () => {
    const url = ENV.SERVER_API_URL + '/movies/latest?n=18'
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    setLatestMovies(data as IMoviesListItem[])
  }

  useEffect(() => {
    if (user) {
      getRecommendedMovies(user.id)
    }
    getPopularMovies()
    getLatestMovies()
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

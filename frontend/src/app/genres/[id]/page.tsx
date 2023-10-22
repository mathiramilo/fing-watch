'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { ENV } from '@/config'
import { IMoviesListItem } from '@/types'
import { prettifyGenre } from '@/utils/movies'

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

  const getRecommendedMovies = async (userId: string) => {
    const url = ENV.SERVER_API_URL + `/recommend/${userId}/item_based/${genreId}?n=18`

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
    const url = ENV.SERVER_API_URL + `/movies/popular/${genreId}?n=18`

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
    const url = ENV.SERVER_API_URL + `/movies/latest/${genreId}?n=18`
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

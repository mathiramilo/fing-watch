'use client'

import { useState, useEffect } from 'react'

import { ENV } from '@/config'
import { IMoviesListItem } from '@/types'

import { GenresSlider, MoviesSlider, Footer } from '@/components'

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<IMoviesListItem[]>([])
  const [popularMovies, setPopularMovies] = useState<IMoviesListItem[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<IMoviesListItem[]>([])

  const getTrendingMovies = async () => {
    const url = ENV.SERVER_API_URL + '/movies/neighbors/346698?n=18'

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    setTrendingMovies(data as IMoviesListItem[])
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

  const getTopRatedMovies = async () => {
    const url = ENV.SERVER_API_URL + '/movies/neighbors/385687?n=18'
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    setTopRatedMovies(data as IMoviesListItem[])
  }

  useEffect(() => {
    getTrendingMovies()
    getPopularMovies()
    getTopRatedMovies()
  }, [])

  return (
    <main className="w-[90%] mx-auto sm:w-full sm:px-12 pt-32">
      <section className="mb-12">
        <h2 className="font-bold text-white/90 mb-4">Browse by Genre</h2>
        <GenresSlider />
      </section>
      <MoviesSlider
        title="Recommended for You"
        movies={trendingMovies}
        className="my-12"
      />
      <MoviesSlider
        title="Popular Movies"
        movies={popularMovies}
        className="mb-12"
      />
      <MoviesSlider
        title="Top Rated Movies"
        movies={topRatedMovies}
        className="mb-12"
      />

      <Footer />
    </main>
  )
}

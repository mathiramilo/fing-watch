'use client'

import { useState, useEffect } from 'react'

import { ENV } from '@/config'
import { MoviesListItem } from '@/types'

import { GenresSlider, MoviesSlider, Footer } from '@/components'

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState<MoviesListItem[]>([])
  const [popularMovies, setPopularMovies] = useState<MoviesListItem[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<MoviesListItem[]>([])

  const getTrendingMovies = async () => {
    const url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US'

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ENV.TMDB_API_KEY}`
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    setTrendingMovies(data.results as MoviesListItem[])
  }

  const getPopularMovies = async () => {
    const url = 'https://api.themoviedb.org/3/movie/popular'

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ENV.TMDB_API_KEY}`
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    setPopularMovies(data.results as MoviesListItem[])
  }

  const getTopRatedMovies = async () => {
    const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1'
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ENV.TMDB_API_KEY}`
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    setTopRatedMovies(data.results as MoviesListItem[])
  }

  useEffect(() => {
    getTrendingMovies()
    getPopularMovies()
    getTopRatedMovies()
  }, [])

  return (
    <main className="w-[90%] mx-auto sm:w-full sm:px-12 pt-32">
      <GenresSlider />
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

'use client'

import { useState, useEffect } from 'react'

import { SERVER_API_URL } from '@/config'
import { IMoviesListItem } from '@/types'
import { prettifyGenre } from '@/utils/movies'

import { MoviesSlider, Footer } from '@/components'

export default function GenrePage({ params }: { params: { slug: string } }) {
  const [trendingMovies, setTrendingMovies] = useState<IMoviesListItem[]>([])
  const [popularMovies, setPopularMovies] = useState<IMoviesListItem[]>([])
  const [topRatedMovies, setTopRatedMovies] = useState<IMoviesListItem[]>([])

  const genre = params.slug

  const getTrendingMovies = async () => {
    const url = SERVER_API_URL + `/movies/latest/${genre}?n=18`

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
    const url = SERVER_API_URL + `/movies/popular/${genre}?n=18`

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
    const url = SERVER_API_URL + `/movies/neighbors/575264/${genre}?n=18`
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
  }, [genre]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="w-[90%] mx-auto sm:w-full sm:px-12 pt-[4.2em]">
      <h1 className="text-lg font-bold text-white/50 text-center mb-16">{prettifyGenre(genre)}</h1>
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

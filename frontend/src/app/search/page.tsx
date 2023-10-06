'use client'

import { useEffect, useState } from 'react'

import { ENV } from '@/config'
import { MoviesListItem } from '@/types'

import { Footer, GenresSlider, MoviesGrid, SearchBar } from '@/components'

export default function SearchPage() {
  const [search, setSearch] = useState('')
  const [trendingSearches, setTrendingSearches] = useState<MoviesListItem[]>([])

  const getTrendingSearches = async () => {
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

    setTrendingSearches(data.results as MoviesListItem[])
  }

  useEffect(() => {
    getTrendingSearches()
  }, [])

  return (
    <main className="w-[90%] mx-auto sm:w-full sm:px-12 pt-32">
      {/* Search Bar & Recommended Searches */}
      <div className="mb-12">
        <SearchBar
          value={search}
          setValue={setSearch}
        />
      </div>

      {/* Browse by Genre */}
      <section className="mb-12">
        <h2 className="font-bold text-white/90 mb-4">Browse by Genre</h2>
        <GenresSlider />
      </section>

      {/* Popular Searches */}
      <section className="mb-12">
        <h2 className="font-bold text-white/90 mb-4">Trending Searches</h2>
        <MoviesGrid movies={trendingSearches} />
      </section>

      <Footer />
    </main>
  )
}

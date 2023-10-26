'use client'

import { useEffect, useState } from 'react'

import { IMoviesListItem } from '@/types'

import { Footer, GenresSlider, MoviesGrid, SearchBar } from '@/components'
import { getPopularMovies, searchMovies } from '@/services/movies'

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<IMoviesListItem[] | null>(null)
  const [trendingSearches, setTrendingSearches] = useState<IMoviesListItem[]>([])

  const handleSearch = (value: string) => {
    if (value !== '') {
      fetchSearchResults(value)
    } else {
      setSearchResults(null)
    }
  }

  const fetchSearchResults = async (inputValue: string) => {
    try {
      const data = await searchMovies(inputValue, 18)
      setSearchResults(data)
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  const fetchTrendingSearches = async () => {
    try {
      const data = await getPopularMovies(18)
      setTrendingSearches(data)
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTrendingSearches()
  }, [])

  return (
    <main className="w-[90%] mx-auto sm:w-full sm:px-12 pt-32">
      {/* Search Bar */}
      <div className="mb-12">
        <SearchBar action={handleSearch} />
      </div>

      {searchResults ? (
        // Search Results
        <section className="mb-12">
          <h2 className="font-bold text-white/90 mb-4">Search Results</h2>
          <MoviesGrid movies={searchResults} />
        </section>
      ) : (
        <>
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
        </>
      )}

      <Footer />
    </main>
  )
}

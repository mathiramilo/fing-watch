'use client'

import { useEffect, useState } from 'react'

import { ENV } from '@/config'
import { IMoviesListItem, ISearchResults } from '@/types'

import { Footer, GenresSlider, MoviesGrid, SearchBar } from '@/components'

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
      const url = ENV.SERVER_API_URL + '/movies?per_page=18&q=' + inputValue

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
      }

      const res = await fetch(url, options)
      const data: ISearchResults = await res.json()

      const hits: IMoviesListItem[] = data.hits.map((hit) => hit.document)

      setSearchResults(hits)
    } catch (error) {
      console.log(error)
    }
  }

  const getTrendingSearches = async () => {
    const url = ENV.SERVER_API_URL + '/movies/popular?n=18'

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    setTrendingSearches(data as IMoviesListItem[])
  }

  useEffect(() => {
    getTrendingSearches()
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

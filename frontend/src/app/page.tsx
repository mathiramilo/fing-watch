'use client'

import { useState, useEffect } from 'react'

import { IMoviesListItem, RecommenderTypes, TRecommendedBecause } from '@/types.d'

import { getRecommendedMovies, getPopularMovies, getLatestMovies, getSimilarMovies } from '@/services/movies'
import { useAuth } from '@/hooks/useAuth'

import { GenresSlider, MoviesSlider, Footer } from '@/components'
import { getUserFeedback } from '@/services/feedback'

export default function HomePage() {
  const [recommendedMoviesContent, setRecommendedMoviesContent] = useState<IMoviesListItem[]>([])
  const [recommendedMoviesCollaborative, setRecommendedMoviesCollaborative] = useState<IMoviesListItem[]>([])
  const [popularMovies, setPopularMovies] = useState<IMoviesListItem[]>([])
  const [latestMovies, setLatestMovies] = useState<IMoviesListItem[]>([])
  const [recommendedBecauseLiked, setRecommendedBecauseLiked] = useState<TRecommendedBecause>([])
  const [recommendedBecauseWatchlist, setRecommendedBecauseWatchlist] = useState<TRecommendedBecause>([])

  const { user } = useAuth()

  const fetchRecommendedMovies = async (userId: string) => {
    try {
      const itemBasedData = await getRecommendedMovies(userId, RecommenderTypes.ItemBased, 18)
      const collaborativeData = await getRecommendedMovies(userId, RecommenderTypes.UserBased, 18)

      setRecommendedMoviesContent(itemBasedData)
      setRecommendedMoviesCollaborative(collaborativeData)
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

  const fetchRecommendedBecause = async (userId: string) => {
    try {
      const data = await getUserFeedback(userId)

      const likedMovies = data.like as Array<IMoviesListItem>
      const randomLikedMovies = likedMovies
        .sort(() => Math.random() - Math.random())
        .slice(0, 3) as Array<IMoviesListItem>

      const watchlistMovies = data.watchlist as Array<IMoviesListItem>
      const randomWatchlistMovies = watchlistMovies
        .sort(() => Math.random() - Math.random())
        .slice(0, 3) as Array<IMoviesListItem>

      const recommendedBecauseLiked = randomLikedMovies.map(async (movie) => {
        const data = await getSimilarMovies(movie.id, 18)
        return {
          key: movie.title,
          movies: data
        }
      })
      const recommendedBecauseWatchlist = randomWatchlistMovies.map(async (movie) => {
        const data = await getSimilarMovies(movie.id, 18)
        return {
          key: movie.title,
          movies: data
        }
      })

      const recommendedBecauseLikedMovies = await Promise.all(recommendedBecauseLiked)
      const recommendedBecauseWatchlistMovies = await Promise.all(recommendedBecauseWatchlist)

      const rblmKeys = recommendedBecauseLikedMovies.map((item) => item.key)

      setRecommendedBecauseLiked(recommendedBecauseLikedMovies)
      setRecommendedBecauseWatchlist(recommendedBecauseWatchlistMovies.filter((item) => !rblmKeys.includes(item.key)))
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchRecommendedMovies(user.id)
      fetchRecommendedBecause(user.id)
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
        title="Just For You"
        movies={recommendedMoviesContent}
        className="my-12"
      />
      <MoviesSlider
        title="Other Users Also Liked"
        movies={recommendedMoviesCollaborative}
        className="my-12"
      />
      <MoviesSlider
        title="Trending Now"
        movies={popularMovies}
        className="mb-12"
      />
      <MoviesSlider
        title="Our Newest Additions"
        movies={latestMovies}
        className="mb-12"
      />

      {recommendedBecauseLiked.map((item, idx) => (
        <MoviesSlider
          key={idx}
          title={`Because You Liked ${item.key}`}
          movies={item.movies}
          className="mb-12"
        />
      ))}

      {recommendedBecauseWatchlist.map((item, idx) => (
        <MoviesSlider
          key={idx}
          title={`Because You Added to Watchlist ${item.key}`}
          movies={item.movies}
          className="mb-12"
        />
      ))}

      <Footer />
    </main>
  )
}

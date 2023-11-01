'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { AiFillHeart, AiOutlineHeart, AiFillLike, AiOutlineLike, AiFillDislike, AiOutlineDislike } from 'react-icons/ai'

import { IMovieDetails, IMovieProviders, FeedbackTypes } from '@/types.d'
import { getMovieAge, getMovieDuration, getMovieYear, getMovieImageUrl } from '@/utils/movies'

import { addFeedback, removeFeedback, getMovieFeedback } from '@/services/feedback'
import { getMovieDetails, getSimilarMovies } from '@/services/movies'

import { useAuth } from '@/hooks/useAuth'

import { CustomRating, IconButton, MoviesSlider, Footer } from '@/components'

export default function MoviePage({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<IMovieDetails>()
  const [providers, setProviders] = useState<IMovieProviders>()
  const [similar, setSimilar] = useState<IMovieDetails[]>()

  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  const { user } = useAuth()

  const router = useRouter()

  const fetchMovieDetails = async () => {
    try {
      const data = await getMovieDetails(params.id)
      setMovie(data as IMovieDetails)
      setProviders(data?.watch_providers)
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  const fetchSimilarMovies = async () => {
    try {
      const data = await getSimilarMovies(params.id, 18)
      setSimilar(data)
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  const handleAddFeedback = async (e: React.MouseEvent, type: FeedbackTypes) => {
    e.preventDefault()

    if (!user) {
      return router.push('/sign-in')
    }

    try {
      const data = await addFeedback(user.id, params.id, type)

      if (data?.RowAffected === 1) {
        switch (type) {
          case FeedbackTypes.Watchlist:
            setIsInWatchlist(true)
            break
          case FeedbackTypes.Like:
            setIsLiked(true)
            break
          case FeedbackTypes.Dislike:
            setIsDisliked(true)
            break
        }
      }
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  const handleRemoveFeedback = async (e: React.MouseEvent, type: FeedbackTypes) => {
    e.preventDefault()

    if (!user) {
      return router.push('/sign-in')
    }

    try {
      const data = await removeFeedback(user.id, params.id, type)

      if (data?.RowAffected === 1) {
        switch (type) {
          case FeedbackTypes.Watchlist:
            setIsInWatchlist(false)
            break
          case FeedbackTypes.Like:
            setIsLiked(false)
            break
          case FeedbackTypes.Dislike:
            setIsDisliked(false)
            break
        }
      }
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  const fetchInitialState = async () => {
    if (!user) {
      return
    }

    try {
      const data = await getMovieFeedback(user.id, params.id)

      if (data) {
        setIsInWatchlist(data.includes(FeedbackTypes.Watchlist))
        setIsLiked(data.includes(FeedbackTypes.Like))
        setIsDisliked(data.includes(FeedbackTypes.Dislike))
      }
    } catch (error) {
      // Error handling
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMovieDetails()
    fetchSimilarMovies()
    fetchInitialState()
  }, [params.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="">
      <section
        className={`relative z-0 flex flex-end min-h-[100vh] sm:min-h-[80vh] overflow-hidden ${
          similar?.length === 0 && 'min-h-[99vh]'
        }`}
      >
        {/* Top Shadow */}
        <div className="absolute z-10 w-full h-12 top-0 left-0 bg-black/60 shadow-[0_10px_60px_50px_rgba(0,0,0,0.61)]"></div>

        {/* Bottom Shadow */}
        <div className="absolute z-10 w-full h-64 sm:h-32 bottom-0 left-0 bg-black shadow-[0_-10px_120px_120px_rgba(0,0,0)]"></div>

        {/* Movie Backdrop Banner */}
        <Image
          src={getMovieImageUrl(movie?.backdrop_path!)}
          alt={movie?.title!}
          width={1600}
          height={1600}
          className="w-full h-full absolute top-0 left-0 z-0 object-cover object-top"
        />

        {/* Movie Details */}
        <div className="absolute z-10 left-0 bottom-0 w-full px-5 sm:px-12 py-4">
          <h1 className="uppercase text-3xl text-white/90 font-bold tracking-widest mb-3">{movie?.title}</h1>

          <CustomRating
            rating={movie?.vote_average!}
            className="mb-3"
          />

          {/* Metadata */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-xs font-light text-white/60">{getMovieDuration(movie?.runtime!)}</span>
            <span className="text-xs font-light text-white/60">{getMovieAge(movie?.adult!)}</span>
            <span className="text-xs font-light text-white/60">{getMovieYear(movie?.release_date!)}</span>
            <span className="text-xs font-light text-white/60 uppercase">{movie?.original_language}</span>
          </div>

          {/* Providers */}
          {providers?.UY && (
            <div className="flex items-center gap-3 mb-6">
              {providers?.UY?.flatrate?.map((provider, index) => (
                <Image
                  key={index}
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  alt={provider.provider_name}
                  width={45}
                  height={45}
                  className="rounded-md"
                />
              ))}
              {providers?.UY?.buy?.map((provider, index) => (
                <Image
                  key={index}
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  alt={provider.provider_name}
                  width={45}
                  height={45}
                  className="rounded-md"
                />
              ))}
            </div>
          )}

          {/* Watchlist */}
          <div className="flex items-center gap-8 mb-8">
            <IconButton
              Icon={isInWatchlist ? AiFillHeart : AiOutlineHeart}
              text={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              iconSize={22}
              textSize="sm"
              onClick={
                isInWatchlist
                  ? (e) => handleRemoveFeedback(e, FeedbackTypes.Watchlist)
                  : (e) => handleAddFeedback(e, FeedbackTypes.Watchlist)
              }
            />

            {/* Like/Dislike */}
            <div className="flex items-center">
              <p className="text-sm text-white/60 mr-4">How would you rate this movie?</p>
              <IconButton
                Icon={isLiked ? AiFillLike : AiOutlineLike}
                text=""
                iconSize={20}
                textSize="sm"
                onClick={
                  isLiked
                    ? (e) => handleRemoveFeedback(e, FeedbackTypes.Like)
                    : (e) => handleAddFeedback(e, FeedbackTypes.Like)
                }
              />
              <IconButton
                Icon={isDisliked ? AiFillDislike : AiOutlineDislike}
                text=""
                iconSize={20}
                textSize="sm"
                onClick={
                  isDisliked
                    ? (e) => handleRemoveFeedback(e, FeedbackTypes.Dislike)
                    : (e) => handleAddFeedback(e, FeedbackTypes.Dislike)
                }
              />
            </div>
          </div>

          {/* Overview */}
          <p className="text-sm text-white/60 max-w-5xl">{movie?.overview}</p>

          {/* Genres */}
          <div className="flex items-center gap-4 mt-5">
            {movie?.genres?.map(({ id, name }) => (
              <span
                key={id}
                className="text-xs text-white/80 font-bold"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* More Like This */}
      <section className="bg-black px-5 sm:px-12">
        {similar?.length! > 0 && (
          <MoviesSlider
            movies={similar!}
            title="More Like This"
            className="py-12"
          />
        )}

        <Footer />
      </section>
    </main>
  )
}

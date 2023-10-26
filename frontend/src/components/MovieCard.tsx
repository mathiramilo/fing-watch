'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { AiOutlineHeart, AiFillHeart, AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike } from 'react-icons/ai'

import { FeedbackTypes, IMovieDetails, IMoviesListItem } from '@/types.d'
import { getMovieImageUrl, getMovieYear } from '@/utils/movies'
import { addFeedback, getMovieFeedback, removeFeedback } from '@/services/feedback'
import { useAuth } from '@/hooks/useAuth'

import CustomRating from './CustomRating'
import IconButton from './IconButton'

interface MovieCardProps {
  movie: IMoviesListItem | IMovieDetails
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  const { user } = useAuth()

  const router = useRouter()

  const handleAddFeedback = async (e: React.MouseEvent, type: FeedbackTypes) => {
    e.preventDefault()

    if (!user) {
      return router.push('/sign-in')
    }

    try {
      const data = await addFeedback(user.id, movie.id, type)

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
      const data = await removeFeedback(user.id, movie.id, type)

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

  const loadInitialState = async () => {
    if (!user) {
      return
    }

    try {
      const data = await getMovieFeedback(user.id, movie.id)

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
    loadInitialState()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="block group aspect-[2/3] bg-neutral-800 rounded-sm relative overflow-hidden"
    >
      {/* Movie Poster */}
      <Image
        src={getMovieImageUrl(movie.poster_path)}
        alt={movie.title}
        width={768}
        height={1024}
        className="rounded-sm sm:group-hover:scale-105 transition-transform duration-500"
      />

      {/* Movie Overlay (On Hover) */}
      <div className="absolute top-0 left-0 w-full h-full p-5 rounded-sm bg-black/80 flex flex-col opacity-0 sm:hover:opacity-100 transition-opacity duration-200">
        <h3 className="font-bold mb-1 text-white/90">{movie.title}</h3>
        <span className="text-white/60 text-sm mb-4">{getMovieYear(movie.release_date)}</span>
        <p className="font-normal text-sm text-white/50 mb-5 line-clamp-5">{movie.overview}</p>

        {/* Watchlist */}
        <IconButton
          Icon={isInWatchlist ? AiFillHeart : AiOutlineHeart}
          text={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          iconSize={22}
          textSize="sm"
          className="mb-5"
          onClick={
            isInWatchlist
              ? (e) => handleRemoveFeedback(e, FeedbackTypes.Watchlist)
              : (e) => handleAddFeedback(e, FeedbackTypes.Watchlist)
          }
        />

        {/* Like/Dislike */}
        <div className="flex flex-col gap-3">
          <p className="text-sm text-white/60">How would you rate this movie?</p>
          <div className="flex items-center gap-4">
            <IconButton
              Icon={isLiked ? AiFillLike : AiOutlineLike}
              text="Like"
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
              text="Dislike"
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

        {/* Rating */}
        <CustomRating
          rating={movie?.vote_average}
          className="absolute bottom-5 left-5"
        />
      </div>
    </Link>
  )
}

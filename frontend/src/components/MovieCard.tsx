'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { AiOutlineHeart, AiFillHeart, AiOutlineLike, AiFillLike, AiOutlineDislike, AiFillDislike } from 'react-icons/ai'

import { SERVER_API_URL } from '@/config'
import { IMovieDetails, IMoviesListItem } from '@/types'
import { getMovieImageUrl } from '@/utils/movies'

import { User } from '@/context/AuthContext'
import { useAuth } from '@/hooks/useAuth'

import CustomRating from '@/components/CustomRating'
import IconButton from '@/components/IconButton'

interface MovieCardProps {
  movie: IMoviesListItem | IMovieDetails
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  const { user, setUser } = useAuth()

  const handleAddToWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault()

    const url = SERVER_API_URL + `/users/${user?.id}/watchlist/${movie.id}`

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    if (data.result) {
      setUser({ ...user, watchlist: data?.watchlist } as User)
      setIsInWatchlist(true)
    }
  }

  const handleRemoveFromWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault()

    const url = SERVER_API_URL + `/users/${user?.id}/watchlist/${movie?.id}`

    const options = {
      method: 'DELETE',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    if (data?.result) {
      setUser({ ...user, watchlist: data?.watchlist } as User)
      setIsInWatchlist(false)
    }
  }

  const loadInitialState = async () => {
    if (user?.watchlist?.find((id) => id === movie.id.toString())) {
      setIsInWatchlist(true)
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
        className="rounded-sm group-hover:scale-105 transition-transform duration-500"
      />

      {/* Movie Overlay (On Hover) */}
      <div className="absolute top-0 left-0 w-full h-full p-5 rounded-sm bg-black/80 flex flex-col opacity-0 sm:hover:opacity-100 transition-opacity duration-200">
        <h3 className="font-bold mb-4 text-white/90">{movie.title}</h3>
        <p className="font-normal text-sm text-white/50 mb-5 line-clamp-6">{movie.overview}</p>

        {/* Add to Watchlist */}
        <IconButton
          Icon={isInWatchlist ? AiFillHeart : AiOutlineHeart}
          text={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          iconSize={22}
          textSize="sm"
          className="mb-5"
          onClick={isInWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}
        />

        {/* Like/Dislike */}
        <div className="flex flex-col gap-3">
          <p className="text-sm text-white/60">How would you rate this movie?</p>
          <div className="flex items-center gap-4">
            <IconButton
              Icon={AiOutlineLike}
              text="Like"
              iconSize={20}
              textSize="sm"
            />
            <IconButton
              Icon={AiOutlineDislike}
              text="Dislike"
              iconSize={20}
              textSize="sm"
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

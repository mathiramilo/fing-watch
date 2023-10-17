'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

import { AiFillHeart, AiOutlineHeart, AiFillLike, AiOutlineLike, AiFillDislike, AiOutlineDislike } from 'react-icons/ai'

import { SERVER_API_URL } from '@/config'
import { IMovieDetails, IMovieProviders } from '@/types'
import { getMovieAge, getMovieDuration, getMovieYear, getMovieImageUrl } from '@/utils/movies'

import { User } from '@/context/AuthContext'
import { useAuth } from '@/hooks/useAuth'

import { CustomRating, IconButton, MoviesSlider, Footer } from '@/components'

export default function MoviePage({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<IMovieDetails>()
  const [providers, setProviders] = useState<IMovieProviders>()
  const [similar, setSimilar] = useState<IMovieDetails[]>()

  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  const { user, setUser } = useAuth()

  const getMovieDetails = async () => {
    const url = SERVER_API_URL + `/movies/${params.id}`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    setMovie(data as IMovieDetails)
    setProviders(data?.watch_providers)
  }

  const getSimilarMovies = async () => {
    const url = SERVER_API_URL + `/movies/neighbors/${params.id}?n=18`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    setSimilar(data as IMovieDetails[])
  }

  const handleAddToWatchlist = async () => {
    const url = SERVER_API_URL + `/users/${user?.id}/watchlist/${movie?.id}`

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json'
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    if (data?.result) {
      setUser({ ...user, watchlist: data?.watchlist } as User)
      setIsInWatchlist(true)
    }
  }

  const handleRemoveFromWatchlist = async () => {
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
    if (user?.watchlist?.find((id) => id === params.id)) {
      setIsInWatchlist(true)
    }
  }

  useEffect(() => {
    getMovieDetails()
    getSimilarMovies()
    loadInitialState()
  }, [params.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="">
      <section
        className={`relative z-0 flex flex-end min-h-[75vh] overflow-hidden ${similar?.length === 0 && 'min-h-[98vh]'}`}
      >
        {/* Top Shadow */}
        <div className="absolute z-10 w-full h-12 top-0 left-0 bg-black/60 shadow-[0_10px_60px_50px_rgba(0,0,0,0.61)]"></div>

        {/* Bottom Shadow */}
        <div className="absolute z-10 w-full h-28 bottom-0 left-0 bg-black shadow-[0_-10px_120px_120px_rgba(0,0,0)]"></div>

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
            <div className="flex items-center gap-3 mb-5">
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

          <IconButton
            Icon={isInWatchlist ? AiFillHeart : AiOutlineHeart}
            text={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            iconSize={22}
            textSize="sm"
            className="mb-8"
            onClick={isInWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}
          />

          {/* Overview */}
          <p className="text-sm text-white/60 max-w-5xl">{movie?.overview}</p>
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

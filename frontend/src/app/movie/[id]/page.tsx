'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

import { AiOutlineHeart } from 'react-icons/ai'

import { ENV, SERVER_API_URL } from '@/config'
import { MovieDetails, MovieProviders } from '@/types'
import { getMovieAge, getMovieDuration, getMovieYear, getMovieImageUrl } from '@/utils/movies'

import { CustomRating, IconButton, MoviesSlider, Footer } from '@/components'

export default function MoviePage({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<MovieDetails>()
  const [providers, setProviders] = useState<MovieProviders>()
  const [similar, setSimilar] = useState<MovieDetails[]>()

  const getMovieDetails = async () => {
    const url = `https://api.themoviedb.org/3/movie/${params.id}?language=en-US`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ENV.TMDB_API_KEY}`
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    setMovie(data as MovieDetails)
  }

  const getMovieProviders = async () => {
    const url = `https://api.themoviedb.org/3/movie/${params.id}/watch/providers`

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${ENV.TMDB_API_KEY}`
      }
    }

    const res = await fetch(url, options)
    const data = await res.json()

    setProviders(data as MovieProviders)
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

    setSimilar(data as MovieDetails[])
  }

  useEffect(() => {
    getMovieDetails()
    getMovieProviders()
    getSimilarMovies()
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
          {providers?.results?.UY && (
            <div className="flex items-center gap-3 mb-5">
              {providers?.results?.UY?.flatrate?.map((provider, index) => (
                <Image
                  key={index}
                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  alt={provider.provider_name}
                  width={45}
                  height={45}
                  className="rounded-md"
                />
              ))}
              {providers?.results?.UY?.buy?.map((provider, index) => (
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
            Icon={AiOutlineHeart}
            text="Add to Watchlist"
            iconSize={22}
            textSize="sm"
            className="mb-8"
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

import Image from 'next/image'
import Link from 'next/link'

import { AiOutlineHeart, AiOutlineLike, AiOutlineDislike } from 'react-icons/ai'

import { getMovieImageUrl } from '@/utils/movies'
import { MovieDetails, MoviesListItem } from '@/types'

import CustomRating from '@/components/CustomRating'
import IconButton from '@/components/IconButton'

interface MovieCardProps {
  movie: MoviesListItem | MovieDetails
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="block group aspect-[2/3] rounded-sm relative overflow-hidden"
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

        {/* Add to my List */}
        <IconButton
          Icon={AiOutlineHeart}
          text="Agregar a mi Lista"
          iconSize={22}
          textSize="sm"
          className="mb-5"
        />

        {/* Like/Dislike */}
        <div className="flex flex-col gap-3">
          <p className="text-sm text-white/60">¿Cómo calificarias esta película?</p>
          <div className="flex items-center gap-4">
            <IconButton
              Icon={AiOutlineLike}
              text="Me Gusta"
              iconSize={20}
              textSize="sm"
            />
            <IconButton
              Icon={AiOutlineDislike}
              text="No Me Gusta"
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

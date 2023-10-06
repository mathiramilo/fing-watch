import { MovieDetails, MoviesListItem } from '@/types'

import MovieCard from '@/components/MovieCard'

interface MoviesGridProps {
  movies: MoviesListItem[] | MovieDetails[]
}

export default function MoviesGrid({ movies }: MoviesGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
      {movies?.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </div>
  )
}

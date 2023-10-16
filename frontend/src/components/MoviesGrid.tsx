import { IMovieDetails, IMoviesListItem } from '@/types'

import MovieCard from '@/components/MovieCard'

interface MoviesGridProps {
  movies: IMoviesListItem[] | IMovieDetails[]
}

export default function MoviesGrid({ movies }: MoviesGridProps) {
  return (
    <>
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {movies?.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
            />
          ))}
        </div>
      ) : (
        <div className="w-full min-h-[500px] flex justify-center items-center mb-32">
          <p className="text-white/60">😔 No hay resultados</p>
        </div>
      )}
    </>
  )
}

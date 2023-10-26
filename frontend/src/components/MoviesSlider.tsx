import { IMovieDetails, IMoviesListItem } from '@/types'

import CustomCarousel from './CustomCarousel'
import MovieCard from './MovieCard'

interface MoviesSliderProps {
  title: string
  movies: IMoviesListItem[] | IMovieDetails[]
  className?: string
}

export default function MoviesSlider({ title, movies = [], className }: MoviesSliderProps) {
  if (movies.length === 0) {
    return null
  }

  return (
    <section className={className}>
      <h2 className="font-bold text-white/90 mb-4">{title}</h2>

      <CustomCarousel responsive={responsive}>
        {movies?.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </CustomCarousel>
    </section>
  )
}

const responsive = {
  xxl: {
    breakpoint: { max: 3840, min: 1921 },
    items: 6,
    slidesToSlide: 6,
    partialVisibilityGutter: 16
  },
  xl: {
    breakpoint: { max: 1920, min: 1601 },
    items: 5,
    slidesToSlide: 5,
    partialVisibilityGutter: 16
  },
  lg: {
    breakpoint: { max: 1600, min: 1281 },
    items: 4,
    slidesToSlide: 4,
    partialVisibilityGutter: 16
  },
  md: {
    breakpoint: { max: 1280, min: 913 },
    items: 3,
    slidesToSlide: 3,
    partialVisibilityGutter: 12
  },
  sm: {
    breakpoint: { max: 912, min: 553 },
    items: 2,
    slidesToSlide: 2,
    partialVisibilityGutter: 10
  },
  xs: {
    breakpoint: { max: 552, min: 275 },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 32
  }
}

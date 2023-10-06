import CustomCarousel from './CustomCarousel'

export default function GenresSlider() {
  return (
    <CustomCarousel responsive={responsive}>
      {genres.map((genre) => (
        <button
          key={genre}
          className="h-48 aspect-square bg-white/10 border border-stone-700 rounded-md hover:bg-white/20 hover:text-white hover:border-stone-600 transition-colors"
        >
          <h3 className="font-bold text-lg text-white/80">{genre}</h3>
        </button>
      ))}
    </CustomCarousel>
  )
}

// Example genres
const genres = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Mystery',
  'Romance',
  'Thriller',
  'Sci-Fi',
  'Fantasy',
  'Animation',
  'Crime',
  'Adventure',
  'Family',
  'History',
  'War',
  'Music',
  'Documentary',
  'Western',
  'TV Movie'
]

const responsive = {
  xxxxl: {
    breakpoint: { max: 3440, min: 2093 },
    items: 8,
    slidesToSlide: 8,
    partialVisibilityGutter: 16
  },
  xxxl: {
    breakpoint: { max: 2092, min: 1921 },
    items: 7,
    slidesToSlide: 7,
    partialVisibilityGutter: 16
  },
  xxl: {
    breakpoint: { max: 1920, min: 1581 },
    items: 6,
    slidesToSlide: 6,
    partialVisibilityGutter: 16
  },
  xl: {
    breakpoint: { max: 1580, min: 1361 },
    items: 5,
    slidesToSlide: 5,
    partialVisibilityGutter: 16
  },
  lg: {
    breakpoint: { max: 1420, min: 1093 },
    items: 4,
    slidesToSlide: 4,
    partialVisibilityGutter: 16
  },
  md: {
    breakpoint: { max: 1092, min: 813 },
    items: 3,
    slidesToSlide: 3,
    partialVisibilityGutter: 12
  },
  sm: {
    breakpoint: { max: 812, min: 499 },
    items: 2,
    slidesToSlide: 2,
    partialVisibilityGutter: 10
  },
  xs: {
    breakpoint: { max: 498, min: 275 },
    items: 1,
    slidesToSlide: 1,
    partialVisibilityGutter: 120
  }
}

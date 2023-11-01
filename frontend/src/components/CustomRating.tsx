import { Rating } from '@mui/material'

interface CustomRatingProps {
  rating: number
  className?: string
}

export default function CustomRating({ rating, className }: CustomRatingProps) {
  if (rating === 0) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-white/70">{rating?.toFixed(1)}</span>
      <Rating
        readOnly
        value={rating / 2}
        size="small"
      />
    </div>
  )
}

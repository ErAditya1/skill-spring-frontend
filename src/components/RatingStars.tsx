'use client'

import { Star } from 'lucide-react'

interface RatingProps {
  rating: number
  totalReviews?: number
  size?: number
}

export default function RatingStars({
  rating,
  totalReviews,
  size = 16,
}: RatingProps) {

  const rounded = Math.round(rating * 2) / 2

  return (
    <div className="flex items-center gap-2">

      {/* Stars */}
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {

          const isFull = rounded >= star
          const isHalf = rounded === star - 0.5

          return (
            <div key={star} className="relative">
              <Star
                size={size}
                className={`${
                  isFull ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
                }`}
              />

              {isHalf && (
                <Star
                  size={size}
                  className="absolute top-0 left-0 fill-yellow-400 text-yellow-400 clip-half"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Rating Number */}
      <span className="text-sm font-semibold">
        {rating?.toFixed(1)}
      </span>

      {/* Review Count */}
      {totalReviews !== undefined && (
        <span className="text-sm text-muted-foreground">
          ({totalReviews} reviews)
        </span>
      )}
    </div>
  )
}

import { Star, Pizza } from "lucide-react"

interface RatingStarsProps {
  rating: number
  iconType?: "star" | "pizza"
  size?: number
  color?: string
}

export function RatingStars({ rating, iconType = "star", size = 20, color = "#ffc107" }: RatingStarsProps) {
  // Calculate full and partial stars
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  // Create array of 5 stars
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < fullStars) {
      return 100 // full
    } else if (i === fullStars && hasHalfStar) {
      return 50 // half
    } else {
      return 0 // empty
    }
  })

  // Choose icon based on type
  const IconComponent = iconType === "pizza" ? Pizza : Star

  return (
    <div className="flex">
      {stars.map((percentage, index) => (
        <div key={index} className="relative inline-block">
          {/* Background (empty) icon */}
          <IconComponent
            size={size}
            className="text-gray-300"
            fill="currentColor"
            strokeWidth={iconType === "pizza" ? 0 : 1}
          />

          {/* Foreground (filled) icon with clip-path */}
          {percentage > 0 && (
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${percentage}%` }}>
              <IconComponent
                size={size}
                className="text-yellow-400"
                fill={color}
                strokeWidth={iconType === "pizza" ? 0 : 1}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

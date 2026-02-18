import { Star } from "lucide-react"

export default function ReviewCard({ review }: any) {
  return (
    <div className="border rounded-lg p-4 mb-4">

      <div className="flex items-center gap-3 mb-2">
        <img
          src={review.user?.avatar?.url}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold">{review.user?.name}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < review.rating
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {review.description}
      </p>
    </div>
  )
}

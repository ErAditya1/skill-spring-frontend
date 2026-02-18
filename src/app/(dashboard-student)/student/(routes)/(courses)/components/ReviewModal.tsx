'use client'

import { useState } from "react"
import api from "@/api"
import { Star } from "lucide-react"
import { useParams } from "next/navigation"

export default function ReviewModal({ courseId, onClose }: any) {
  const [rating, setRating] = useState(5)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const {course_id}= useParams()

  const submitReview = async () => {
    try {
      setLoading(true)
      const res= await api.post(`/v1/courses/course/review/${course_id}`, {
        rating,
        description
      })
      console.log(res.data)
      onClose()
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-background rounded-xl p-6 w-full max-w-md">

        <h2 className="text-xl font-semibold mb-4">
          Leave a Review
        </h2>

        {/* Rating */}
        <div className="flex gap-2 mb-4">
          {[1,2,3,4,5].map(star => (
            <Star
              key={star}
              className={`cursor-pointer ${
                star <= rating
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-400"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        {/* Description */}
        <textarea
          className="w-full border rounded-lg p-2 mb-4"
          rows={4}
          placeholder="Write your review..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={submitReview}
            disabled={loading}
            className="bg-primary text-primary-foreground px-4 py-2 rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>

      </div>
    </div>
  )
}

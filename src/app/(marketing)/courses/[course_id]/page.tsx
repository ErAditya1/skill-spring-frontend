'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/api'
import Image from 'next/image'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { PlayCircle, Lock, Loader2, Star, Router } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import AvatarLayout from '@/components/AvatarLayout'

function ExploreCourse() {
  const { course_id } = useParams()
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState<any>(null)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const router = useRouter()

  /* ================= FETCH COURSE ================= */

  useEffect(() => {
    if (!course_id) return

    api
      .get(`/v1/courses/course/get-course-public-data/${course_id}`)
      .then(res => {
        const data = res.data.data
        setCourse(data)
        setSelectedVideo(data.chapters?.[0])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [course_id])

  /* ================= ENROLL ================= */

  const handleEnroll = async () => {
    console.log(course.sellingPrice)
    try {
      if(course.sellingPrice==0){
        await api.post(`/v1/payment/enroll-course/${course_id}`)
      toast({ title: 'Enrolled Successfully', variant: 'success' })
      setCourse({ ...course, isEnrolled: true })
      }else{
        router.push(`/payment?course=${course?._id}`)
      }
    } catch (err: any) {
      toast({
        title: 'Enrollment Failed',
        description: err?.response?.data?.message,
        variant: 'destructive',
      })
    }
  }

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    )
  }

  if (!course) return null

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* ================= HERO SECTION ================= */}

      <div className="grid lg:grid-cols-3 gap-10 mb-12">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            {course.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-500" />
              ))}
              <span className="text-muted-foreground ml-2">
                {course.rating || '4.8'}
              </span>
            </div>

            <span className="text-muted-foreground">
              {course.enrolledStudentCount} students
            </span>

            <span className="text-muted-foreground">
              {course.views} views
            </span>
          </div>

          <p className="text-muted-foreground">
            {course.description?.replace(/<[^>]*>?/gm, '')}
          </p>

          {/* Instructor Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-4">
                           
                 <AvatarLayout className="h-10 w-10 mr-1 text-xl" src={course.author?.avatar?.url} name={course.author?.name} username={course.author?.username} />

              
              <div>
                <h3 className="font-semibold text-lg">
                  {course.author?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {course.author?.bio || 'Professional Instructor'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>🎓 {course.author?.totalCourses || 12} Courses</div>
              <div>👨‍🎓 {course.author?.totalStudents || 5000}+ Students</div>
              <div>⭐ {course.author?.rating || 4.8} Rating</div>
              <div>🕒 5+ Years Experience</div>
            </div>
          </Card>

        </div>

        {/* RIGHT SIDE PRICING CARD */}
        <div>
          <Card className="p-6 sticky top-24 shadow-xl rounded-xl space-y-5">

            <Image
              src={course.thumbnail?.secure_url}
              alt={course.title}
              width={500}
              height={300}
              className="rounded-lg"
            />

            <div className="flex items-center gap-2">
              {course.discount > 0 && (
                <span className="line-through text-muted-foreground">
                  ₹{course.printPrice}
                </span>
              )}
              <span className="text-2xl font-bold">
                ₹{course.sellingPrice}
              </span>
              {course.discount > 0 && (
                <Badge className="bg-green-100 text-green-600">
                  {course.discount}% OFF
                </Badge>
              )}
            </div>

            {course.isEnrolled ? (
              <Button className="w-full" asChild>
                <Link href={`/learn/${course._id}`}>
                  Continue Learning
                </Link>
              </Button>
            ) : (
              <Button className="w-full" onClick={handleEnroll}>
                Enroll Now
              </Button>
            )}

            <Badge className="w-full justify-center bg-blue-100 text-blue-600">
              30-Day Money Back Guarantee
            </Badge>

            <p className="text-xs text-muted-foreground text-center">
              🔒 Secure Payment • Lifetime Access
            </p>

            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✔ Lifetime Access</li>
              <li>✔ Access on Mobile & Desktop</li>
              <li>✔ Certificate of Completion</li>
            </ul>

          </Card>
        </div>
      </div>

      {/* ================= VIDEO + CURRICULUM ================= */}

      <div className="grid lg:grid-cols-3 gap-8 mt-12">

        {/* VIDEO PLAYER */}
        <div className="lg:col-span-2">
          {selectedVideo && (
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              {(selectedVideo.isFree || course.isEnrolled) ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}`}
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-muted">
                  <Lock className="h-10 w-10 mb-3 text-muted-foreground" />
                  <p>Enroll to unlock this lesson</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CURRICULUM */}
        <div>
          <Card className="p-4 rounded-xl">
            <h3 className="font-semibold mb-4">Course Content</h3>

            <div className="divide-y">
              {course.chapters?.map((video: any, index: number) => (
                <div
                  key={video._id}
                  className="flex justify-between items-center p-3 hover:bg-muted/40 cursor-pointer transition"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="flex items-center gap-3">
                    {(video.isFree || course.isEnrolled) ? (
                      <PlayCircle className="h-5 w-5 text-primary" />
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {index + 1}. {video.title}
                      </p>
                      {video.duration && (
                        <p className="text-xs text-muted-foreground">
                          {video.duration}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {video.isFree && (
                      <Badge className="bg-green-100 text-green-600">
                        Free
                      </Badge>
                    )}
                    {video.hasQuiz && (
                      <Badge variant="outline">
                        Quiz
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ================= REVIEWS ================= */}

      <div className="mt-16">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Star className="text-yellow-500" />
          Student Reviews
        </h3>

        {course.comments?.length === 0 && (
          <p className="text-muted-foreground">
            No reviews yet.
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {course.comments?.map((comment: any) => (
            <Card key={comment._id} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Image
                  src={comment.user?.avatar?.secure_url}
                  alt={comment.user?.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">
                    {comment.user?.name}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {comment.text}
              </p>
            </Card>
          ))}
        </div>
      </div>

    </div>
  )
}

/* ================= SUSPENSE WRAPPER ================= */

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExploreCourse />
    </Suspense>
  )
}

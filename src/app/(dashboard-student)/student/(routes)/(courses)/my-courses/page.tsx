'use client'

import React, { useEffect, useState } from 'react'
import api from '@/api'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { PlayCircle, Award } from 'lucide-react'

interface EnrollmentType {
  _id: string
  progress: number
  isCompleted: boolean
  lastWatchedVideo?: string
  course_Id: {
    _id: string
    title: string
    thumbnail: { secure_url: string }
  }
}

export default function MyCoursesPage() {

  const [courses, setCourses] = useState<EnrollmentType[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchCourses = async (pageNumber = 1) => {
    const res = await api.get(`/v1/courses/my-courses/my-courses?page=${pageNumber}`)
    const data = res.data.data

    if (pageNumber === 1) {
      setCourses(data.courses)
    } else {
      setCourses(prev => [...prev, ...data.courses])
    }

    setHasMore(pageNumber < data.totalPages)
    setLoading(false)
  }

  useEffect(() => {
    fetchCourses(1)
  }, [])

  if (loading) return <MyCoursesSkeleton />

  const continueCourses = courses.filter(
    c => c.progress > 0 && c.progress < 100
  )

  const completedCourses = courses.filter(
    c => c.isCompleted
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

      {/* <h1 className="text-3xl font-bold">My Learning</h1> */}

      {/* ================= CONTINUE WATCHING ================= */}

      {continueCourses.length > 0 && (
        <Section title="Continue Learning">
          {continueCourses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </Section>
      )}

      {/* ================= COMPLETED ================= */}

      {completedCourses.length > 0 && (
        <Section title="Completed Courses">
          {completedCourses.map(course => (
            <CourseCard key={course._id} course={course} />
          ))}
        </Section>
      )}

      {/* ================= ALL COURSES GRID ================= */}

      <div>
        <h2 className="text-2xl font-semibold mb-6">
          All Enrolled Courses
        </h2>

        {courses.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {courses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <Button
                  onClick={() => {
                    const nextPage = page + 1
                    setPage(nextPage)
                    fetchCourses(nextPage)
                  }}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  )
}

/* ================= COURSE CARD ================= */

const CourseCard = ({ course }: { course: EnrollmentType }) => {

  const progress = course.progress || 0

  return (
    <Card className="overflow-hidden rounded-xl hover:shadow-lg transition group">

      {/* Thumbnail */}
      <div className="relative h-40 w-full">
        <Image
          src={course.course_Id.thumbnail?.secure_url}
          alt={course.course_Id.title}
          fill
          className="object-cover group-hover:scale-105 transition duration-300"
        />

        {course.isCompleted && (
          <Badge className="absolute top-3 right-3 bg-green-500">
            Completed
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-4">

        <h3 className="font-semibold line-clamp-2">
          {course.course_Id.title}
        </h3>

        {/* Progress Bar */}
        <div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {progress}% completed
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2">

          <Button
            asChild
            className="flex-1"
          >
            <Link href={`/student/courses/${course.course_Id._id}/`}>
              <PlayCircle className="w-4 h-4 mr-2" />
              Resume
            </Link>
          </Button>

          {course.isCompleted && (
            <Button
              variant="outline"
              asChild
            >
              <Link
                href={`/v1/courses/course/certificate/${course.course_Id._id}`}
                target="_blank"
              >
                <Award className="w-4 h-4 mr-2" />
                Certificate
              </Link>
            </Button>
          )}

        </div>

      </div>
    </Card>
  )
}

/* ================= SECTION (NETFLIX STYLE) ================= */

const Section = ({ title, children }: any) => (
  <div>
    <h2 className="text-2xl font-semibold mb-6">{title}</h2>
    <div className="flex gap-6 overflow-x-auto pb-4">
      {children}
    </div>
  </div>
)

/* ================= EMPTY STATE ================= */

const EmptyState = () => (
  <div className="text-center py-20 space-y-4">
    <h2 className="text-xl font-semibold">
      No Enrolled Courses
    </h2>
    <p className="text-muted-foreground">
      Start learning today and enroll in your first course.
    </p>
    <Button asChild>
      <Link href="/courses">Explore Courses</Link>
    </Button>
  </div>
)

/* ================= LOADING ================= */

const MyCoursesSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
    <Skeleton className="h-8 w-48" />
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-64 rounded-xl" />
      ))}
    </div>
  </div>
)

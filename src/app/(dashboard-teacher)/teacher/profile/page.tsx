'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/api'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Star, Users, BookOpen } from 'lucide-react'
import CourseCard from '@/app/(dashboard-student)/student/(routes)/(courses)/components/CourseCard'


interface TeacherType {
  _id: string
  name: string
  username: string
  bio: string
  avatar: { url: string }
  coverImage: { url: string }
  totalStudents: number
  totalCourses: number
  totalReviews: number
  rating: number
  followersCount: number
  courses: any[]
  expertise: string[]
}

export default function TeacherProfile() {
  const { username } = useParams()
  const [loading, setLoading] = useState(true)
  const [teacher, setTeacher] = useState<TeacherType | null>(null)

  useEffect(() => {
    if (!username) return

    api.get(`/v1/users/teacher-profile/${username}`)
      .then(res => {
        setTeacher(res.data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [username])

  if (loading) return <TeacherSkeleton />
  if (!teacher) return null

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* ================= HERO ================= */}

      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden">

        {teacher.coverImage?.url ? (
          <Image
            src={teacher.coverImage.url}
            alt="Cover"
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full h-full" />
        )}

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute bottom-6 left-6 flex items-center gap-6">

          <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg relative">
            {teacher.avatar?.url ? (
              <Image
                src={teacher.avatar.url}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="text-white space-y-2">
            <h1 className="text-3xl font-bold">{teacher.name}</h1>
            <p className="opacity-80">@{teacher.username}</p>

            <div className="flex items-center gap-4 text-sm">

              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="h-4 w-4 fill-yellow-400" />
                {teacher.rating || 4.8}
              </div>

              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {teacher.totalStudents}+ students
              </div>

              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {teacher.totalCourses} courses
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ================= ABOUT ================= */}

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>About Instructor</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {teacher.bio || 'Professional instructor with industry experience.'}
          </p>

          <div className="flex flex-wrap gap-2">
            {teacher.expertise?.map((skill, i) => (
              <Badge key={i} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

        <StatCard label="Followers" value={teacher.followersCount} />
        <StatCard label="Students" value={teacher.totalStudents} />
        <StatCard label="Courses" value={teacher.totalCourses} />
        <StatCard label="Reviews" value={teacher.totalReviews} />

      </div>

      {/* ================= COURSES ================= */}

      <div>
        <h2 className="text-2xl font-semibold mb-6">
          Courses by {teacher.name}
        </h2>

        {teacher.courses?.length === 0 ? (
          <p className="text-muted-foreground">
            No courses published yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {teacher.courses.map((course: any) => (
              <CourseCard key={course._id} _id={course._id} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

/* ================= REUSABLE ================= */

const StatCard = ({ label, value }: any) => (
  <Card className="p-5 text-center rounded-xl hover:shadow-md transition">
    <p className="text-xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </Card>
)

/* ================= LOADING ================= */

const TeacherSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
    <Skeleton className="h-64 rounded-2xl" />
    <Skeleton className="h-32 rounded-xl" />
    <Skeleton className="h-32 rounded-xl" />
  </div>
)

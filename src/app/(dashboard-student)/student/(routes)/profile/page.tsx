'use client'

import React, { useEffect, useState } from 'react'
import api from '@/api'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import ValidatedImage from '@/components/ValidatedImage'
import { FaUserCircle } from 'react-icons/fa'
import PostCard from '@/components/PostCard'
import { HoverEffect } from '@/components/ui/card-hover-effect'
import VideoCard from '../(courses)/components/VideoCard'
import CourseCard from '../(courses)/components/CourseCard'

/* ===================== TYPES ===================== */

interface ProfileType {
  _id: string
  name: string
  username: string
  bio: string
  coverImage: { url: string }
  avatar: { url: string }
  followersCount: number
  followingsCount: number
  postsCount: number
  likesCount: number
  watchedVideos: any[]
  watchedPosts: any[]
  watchedCourses: any[]
  likedVideos: any[]
  likedPosts: any[]
  likedCourses: any[]
  savedVideos: any[]
  savedPosts: any[]
  savedCourses: any[]
}

/* ===================== MAIN COMPONENT ===================== */

export default function UserProfile() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileType | null>(null)

  useEffect(() => {
    api.get('/v1/users/get-user-profile')
      .then(res => {
        setProfile(res.data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <ProfileSkeleton />
  if (!profile) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

      {/* ================= HERO ================= */}

      <div className="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden">

        {profile.coverImage?.url ? (
          <ValidatedImage
            src={profile.coverImage.url}
            alt="Cover"
            fill
            className="object-cover"
          />
        ) : (
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full h-full" />
        )}

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute bottom-6 left-6 flex items-center gap-6">

          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg relative">
            {profile.avatar?.url ? (
              <ValidatedImage
                src={profile.avatar.url}
                alt="Avatar"
                fill
                className="object-cover"
              />
            ) : (
              <FaUserCircle className="w-full h-full text-gray-400" />
            )}
          </div>

          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-bold">
              {profile.name}
            </h1>
            <p className="opacity-80">@{profile.username}</p>
            {profile.bio && (
              <p className="text-sm mt-1 max-w-md opacity-80">
                {profile.bio}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Followers" value={profile.followersCount} />
        <StatCard label="Following" value={profile.followingsCount} />
        <StatCard label="Posts" value={profile.postsCount} />
        <StatCard label="Likes" value={profile.likesCount} />
      </div>

      {/* ================= TABS ================= */}

      <Tabs defaultValue="history" className="w-full">

        <TabsList className="bg-muted rounded-xl p-1 w-full flex justify-start overflow-auto">
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="liked">Liked</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        {/* HISTORY */}
        <TabsContent value="history">
          <ContentSection
            title="Watched Videos"
            items={profile.watchedVideos}
            type="video"
          />
          {/* <ContentSection
            title="Watched Posts"
            items={profile.watchedPosts}
            type="post"
          /> */}
          <ContentSection
            title="Watched Courses"
            items={profile.watchedCourses}
            type="course"
          />
        </TabsContent>

        {/* LIKED */}
        <TabsContent value="liked">
          <ContentSection
            title="Liked Videos"
            items={profile.likedVideos}
            type="video"
          />
          <ContentSection
            title="Liked Posts"
            items={profile.likedPosts}
            type="post"
          />
          <ContentSection
            title="Liked Courses"
            items={profile.likedCourses}
            type="course"
          />
        </TabsContent>

        {/* SAVED */}
        <TabsContent value="saved">
          <ContentSection
            title="Saved Videos"
            items={profile.savedVideos}
            type="video"
          />
          <ContentSection
            title="Saved Posts"
            items={profile.savedPosts}
            type="post"
          />
          <ContentSection
            title="Saved Courses"
            items={profile.savedCourses}
            type="course"
          />
        </TabsContent>

      </Tabs>

    </div>
  )
}

/* ===================== REUSABLE COMPONENTS ===================== */

const StatCard = ({ label, value }: any) => (
  <Card className="p-4 text-center hover:shadow-md transition rounded-xl">
    <p className="text-xl font-bold">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </Card>
)

const ContentSection = ({
  title,
  items,
  type,
}: {
  title: string
  items: any[]
  type: 'video' | 'post' | 'course'
}) => {

  if (!items?.length) {
    return (
      <Card className="p-6 text-center my-6">
        <p className="text-muted-foreground">
          No {title.toLowerCase()} found.
        </p>
      </Card>
    )
  }

  return (
    <Card className="my-6 rounded-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item: any, index: number) => {
          const id =
            type === 'video'
              ? item.video_Id
              : type === 'post'
              ? item.post_Id
              : item.course_Id

          if (!id) return null

          return (
            <HoverEffect key={id} index={index}>
              {type === 'video' && <VideoCard
               _id={id} />}
              {type === 'post' && <PostCard _id={id} />}
              {type === 'course' && <CourseCard _id={id} />}
            </HoverEffect>
          )
        })}
      </CardContent>
    </Card>
  )
}

/* ===================== LOADING SKELETON ===================== */

const ProfileSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
    <Skeleton className="w-full h-56 rounded-2xl" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-20 rounded-xl" />
    </div>
    <Skeleton className="h-40 rounded-xl" />
  </div>
)

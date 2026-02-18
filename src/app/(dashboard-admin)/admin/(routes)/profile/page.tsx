'use client'

import React, { useEffect, useState } from 'react'
import api from '@/api'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Users,
  BookOpen,
  Video,
  MessageCircle,
  ShieldCheck,
  Activity,
} from 'lucide-react'

interface AdminType {
  _id: string
  name: string
  username: string
  email: string
  avatar: { url: string }
  role: string
  joinedAt: string

  totalUsers: number
  totalTeachers: number
  totalCourses: number
  totalVideos: number
  totalComments: number
  totalEnrollments: number
}

export default function AdminProfile() {
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState<AdminType | null>(null)

  useEffect(() => {
    api.get('/v1/admin/profile')
      .then(res => {
        setAdmin(res.data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <AdminSkeleton />
  if (!admin) return null

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* ================= ADMIN HERO ================= */}

      <Card className="rounded-2xl p-6 flex items-center gap-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">

        <div className="w-24 h-24 rounded-full overflow-hidden bg-white relative">
          {admin.avatar?.url && (
            <Image
              src={admin.avatar.url}
              alt="Admin"
              fill
              className="object-cover"
            />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">
            {admin.name}
          </h1>

          <p className="opacity-90">@{admin.username}</p>

          <Badge className="bg-white text-indigo-700">
            <ShieldCheck className="w-4 h-4 mr-1" />
            {admin.role}
          </Badge>

          <p className="text-sm opacity-80">
            Joined: {new Date(admin.joinedAt).toDateString()}
          </p>
        </div>
      </Card>

      {/* ================= PLATFORM STATS ================= */}

      <div>
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Platform Overview
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          <StatCard
            icon={<Users />}
            label="Total Users"
            value={admin.totalUsers}
          />

          <StatCard
            icon={<ShieldCheck />}
            label="Teachers"
            value={admin.totalTeachers}
          />

          <StatCard
            icon={<BookOpen />}
            label="Courses"
            value={admin.totalCourses}
          />

          <StatCard
            icon={<Video />}
            label="Videos"
            value={admin.totalVideos}
          />

          <StatCard
            icon={<MessageCircle />}
            label="Comments"
            value={admin.totalComments}
          />

          <StatCard
            icon={<BookOpen />}
            label="Enrollments"
            value={admin.totalEnrollments}
          />

        </div>
      </div>

      {/* ================= ACCOUNT INFO ================= */}

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-6 text-sm">

          <div>
            <p className="text-muted-foreground">Full Name</p>
            <p className="font-medium">{admin.name}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Username</p>
            <p className="font-medium">@{admin.username}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{admin.email}</p>
          </div>

          <div>
            <p className="text-muted-foreground">Role</p>
            <p className="font-medium">{admin.role}</p>
          </div>

        </CardContent>
      </Card>

    </div>
  )
}

/* ================= REUSABLE ================= */

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) => (
  <Card className="p-6 rounded-xl hover:shadow-md transition">
    <div className="flex items-center justify-between mb-4">
      <div className="text-muted-foreground">{icon}</div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
    <p className="text-sm text-muted-foreground">{label}</p>
  </Card>
)

/* ================= LOADING ================= */

const AdminSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">
    <Skeleton className="h-40 rounded-2xl" />
    <Skeleton className="h-40 rounded-xl" />
    <Skeleton className="h-40 rounded-xl" />
  </div>
)

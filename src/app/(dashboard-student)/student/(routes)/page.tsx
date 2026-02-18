'use client';

import React, { useEffect, useState } from 'react';
import { BookOpen, Award, Clock, BarChart3 } from 'lucide-react';
import api from '@/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import CourseCard from './(courses)/components/CourseCard';

interface DashboardStats {
  totalEnrolled: number;
  completedCourses: number;
  totalHours: number;
  certificates: number;
}

export default function StudentDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [continueCourses, setContinueCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await api.get('/v1/student/dashboard');

        setStats(res.data.data.stats);
        setEnrolledCourses(res.data.data.enrolledCourses);
        setContinueCourses(res.data.data.continueLearning);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Skeleton className="h-8 w-40" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome back 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Continue your learning journey
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card className="p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Enrolled Courses
            </p>
            <h2 className="text-2xl font-bold mt-1">
              {stats.totalEnrolled}
            </h2>
          </div>
          <BookOpen className="text-primary" size={28} />
        </Card>

        <Card className="p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Completed Courses
            </p>
            <h2 className="text-2xl font-bold mt-1">
              {stats.completedCourses}
            </h2>
          </div>
          <Award className="text-green-600" size={28} />
        </Card>

        <Card className="p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Learning Hours
            </p>
            <h2 className="text-2xl font-bold mt-1">
              {stats.totalHours}
            </h2>
          </div>
          <Clock className="text-yellow-500" size={28} />
        </Card>

        <Card className="p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Certificates
            </p>
            <h2 className="text-2xl font-bold mt-1">
              {stats.certificates}
            </h2>
          </div>
          <BarChart3 className="text-purple-600" size={28} />
        </Card>

      </div>

      {/* Continue Learning */}
      {continueCourses.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Continue Learning
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {continueCourses.map((course) => (
              <Card
                key={course._id}
                className="p-4 space-y-4 hover:shadow-lg transition"
              >
                <h3 className="font-semibold line-clamp-2">
                  {course.title}
                </h3>

                <Progress value={course.progress} />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{course.progress}% Completed</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      router.push(`/courses/${course._id}`)
                    }
                  >
                    Resume
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Enrolled Courses */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            My Courses
          </h2>

          <Button
            variant="outline"
            onClick={() => router.push('/courses')}
          >
            Browse More
          </Button>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-16 border rounded-lg">
            <p className="text-muted-foreground">
              You haven’t enrolled in any courses yet.
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push('/courses')}
            >
              Explore Courses
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard key={course._id} _id={course._id} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

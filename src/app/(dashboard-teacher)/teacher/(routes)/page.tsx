"use client";

import Link from "next/link";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Loader2,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/store/hooks";

interface Course {
  _id: string;
  title: string;
  status: "draft" | "pending" | "approved" | "rejected";
  students: number;
  revenue: number;
  rating?: number;
  updatedAt: string;
}

export default function InstructorDashboard() {
  const user = useAppSelector((state) => state.auth.user);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Courses ---------------- */

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/v1/courses/course/getTeacherCourses");
        setCourses(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /* ---------------- Calculations ---------------- */

  const totalStudents = courses.reduce(
    (sum, course) => sum + (course.students || 0),
    0
  );

  const totalRevenue = courses.reduce(
    (sum, course) => sum + (course.revenue || 0),
    0
  );

  const approvedCourses = courses.filter(
    (c) => c.status === "approved"
  ).length;

  /* ---------------- Loading UI ---------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your courses and track performance
          </p>
        </div>

        <Link href="/teacher/courses">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Course
          </Button>
        </Link>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Total Courses
            </span>
            <BookOpen size={18} />
          </div>
          <h3 className="text-2xl font-semibold mt-2">
            {courses.length}
          </h3>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Total Students
            </span>
            <Users size={18} />
          </div>
          <h3 className="text-2xl font-semibold mt-2">
            {totalStudents.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Total Revenue
            </span>
            <DollarSign size={18} />
          </div>
          <h3 className="text-2xl font-semibold mt-2">
            ₹{totalRevenue.toLocaleString()}
          </h3>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">
              Approved Courses
            </span>
            <TrendingUp size={18} />
          </div>
          <h3 className="text-2xl font-semibold mt-2">
            {approvedCourses}
          </h3>
        </div>
      </div>

      {/* COURSE LIST */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">
            Your Courses
          </h2>

          <Link href="/teacher/courses">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No courses created yet.
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border rounded-lg hover:bg-muted/40 transition"
              >
                <div className="flex-1">

                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">
                      {course.title}
                    </h3>

                    {/* STATUS BADGE */}
                    <Badge
                      className={`
                        ${course.status === "approved" && "bg-green-100 text-green-700 border-green-300"}
                        ${course.status === "pending" && "bg-yellow-100 text-yellow-700 border-yellow-300"}
                        ${course.status === "draft" && "bg-gray-100 text-gray-600 border-gray-300"}
                        ${course.status === "rejected" && "bg-red-100 text-red-700 border-red-300"}
                      `}
                    >
                      {course.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>
                      {course.students || 0} students
                    </span>

                    {course.status === "approved" && (
                      <>
                        <span>
                          ₹{course.revenue?.toLocaleString() || 0}
                        </span>
                        <span>
                          ⭐ {course.rating || "4.8"}
                        </span>
                      </>
                    )}

                    <span>
                      Updated {new Date(course.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">

                  {course.status === "approved" && (
                    <Link href={`/course/${course._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  )}

                  <Link href={`/teacher/courses/edit-course/${course._id}`}>
                    <Button size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

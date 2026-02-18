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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          "/v1/courses/teacher/getTeacherCourses"
        );
        setCourses(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /* ================= CALCULATIONS ================= */

  const totalStudents = courses.reduce(
    (sum, c) => sum + (c.students || 0),
    0
  );

  const totalRevenue = courses.reduce(
    (sum, c) => sum + (c.revenue || 0),
    0
  );

  const approvedCourses = courses.filter(
    (c) => c.status === "approved"
  ).length;

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
      <div className="flex justify-between items-center mb-8">
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

        <StatCard
          label="Total Courses"
          value={courses.length}
          icon={<BookOpen size={18} />}
        />

        <StatCard
          label="Total Students"
          value={totalStudents.toLocaleString()}
          icon={<Users size={18} />}
        />

        <StatCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={18} />}
        />

        <StatCard
          label="Approved Courses"
          value={approvedCourses}
          icon={<TrendingUp size={18} />}
        />

      </div>

      {/* COURSE LIST */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-6">
          Your Courses
        </h2>

        {courses.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No courses created yet.
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="flex justify-between p-4 border rounded-lg hover:bg-muted/40 transition"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">
                      {course.title}
                    </h3>

                    <Badge>
                      {course.status}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground flex gap-4">
                    <span>{course.students} students</span>
                    <span>
                      ₹{course.revenue?.toLocaleString() || 0}
                    </span>
                    <span>
                      ⭐ {course.rating || 0}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {course.status === "approved" && (
                    <Link href={`/courses/${course._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  )}

                  <Link
                    href={`/teacher/courses/edit-course/${course._id}`}
                  >
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

const StatCard = ({ label, value, icon }: any) => (
  <div className="rounded-xl border bg-card p-6 shadow-sm">
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground text-sm">
        {label}
      </span>
      {icon}
    </div>
    <h3 className="text-2xl font-semibold mt-2">
      {value}
    </h3>
  </div>
);

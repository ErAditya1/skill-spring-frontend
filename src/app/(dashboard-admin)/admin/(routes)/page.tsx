"use client";

import {
  Users,
  BookOpen,
  AlertCircle,
  DollarSign,
  Eye,
  Loader2,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import api from "@/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalRevenue: number;
  pendingApprovals: number;
}

interface PendingCourse {
  _id: string;
  title: string;
  author: {
    name: string;
  };
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingCourses, setPendingCourses] = useState<PendingCourse[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Dashboard Data ---------------- */

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const [statsRes, pendingRes] = await Promise.all([
          api.get("/v1/admin/dashboard"),
          api.get("/v1/admin/pending-courses"),
        ]);

        setStats(statsRes.data.data);
        setPendingCourses(pendingRes.data.data);

      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* ---------------- Loading UI ---------------- */

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Platform overview and management
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <Card className="p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Students
              </p>
              <h2 className="text-2xl font-semibold mt-1">
                {stats.totalStudents.toLocaleString()}
              </h2>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Courses
              </p>
              <h2 className="text-2xl font-semibold mt-1">
                {stats.totalCourses}
              </h2>
            </div>
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Pending Approvals
              </p>
              <h2 className="text-2xl font-semibold mt-1">
                {stats.pendingApprovals}
              </h2>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Platform Revenue
              </p>
              <h2 className="text-2xl font-semibold mt-1">
                ₹{stats.totalRevenue.toLocaleString()}
              </h2>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <Card className="p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <Users className="h-10 w-10 text-primary mb-4" />
          <h3 className="font-semibold mb-2">
            User Management
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage students, instructors, and admins
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/admin/users")}
          >
            Manage Users
          </Button>
        </Card>

        <Card className="p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <BookOpen className="h-10 w-10 text-primary mb-4" />
          <h3 className="font-semibold mb-2">
            Course Approvals
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Review pending course submissions
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/admin/courses")}
          >
            Review Courses
          </Button>
        </Card>

        <Card className="p-6 rounded-xl shadow-sm hover:shadow-md transition">
          <AlertCircle className="h-10 w-10 text-primary mb-4" />
          <h3 className="font-semibold mb-2">
            Categories
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage course categories
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/admin/categories")}
          >
            Manage Categories
          </Button>
        </Card>

      </div>

      {/* Pending Courses */}
      {pendingCourses.length > 0 && (
        <Card className="p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold">
                Pending Course Approvals
              </h2>
              <p className="text-sm text-muted-foreground">
                {pendingCourses.length} courses waiting for review
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => router.push("/admin/courses")}
            >
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {pendingCourses.map((course) => (
              <div
                key={course._id}
                className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/40 transition"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium">
                      {course.title}
                    </h3>
                    <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-600">
                      Pending
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    By {course.author?.name} •{" "}
                    {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/admin/courses`)
                  }
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Review
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

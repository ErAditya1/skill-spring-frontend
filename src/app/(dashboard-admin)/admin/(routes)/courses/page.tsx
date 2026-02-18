"use client";

import {
  Check,
  X,
  Eye,
  Loader2,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface Course {
  _id: string;
  title: string;
  author: {
    name: string;
    username: string;
  };
  createdAt: string;
  status: "pending" | "approved" | "rejected";
}

export default function CourseApprovalPage() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  /* ---------------- Fetch Courses ---------------- */

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const res = await api.get("/v1/admin/course/course-get");

        setCourses(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  /* ---------------- Approve / Reject ---------------- */

  const handleApproval = async (
    courseId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setActionLoading(courseId);

      const res = await api.patch(
        `/v1/admin/course/course-approval/${courseId}`,
        { status }
      );

      setCourses((prev) =>
        prev.map((course) =>
          course._id === courseId
            ? { ...course, status }
            : course
        )
      );

      toast({
        title: "Success!",
        description: res.data.message,
        variant: "success",
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  /* ---------------- Filters ---------------- */

  const pendingCourses = courses.filter(
    (c) => c.status === "pending"
  );

  const approvedCourses = courses.filter(
    (c) => c.status === "approved"
  );

  const rejectedCourses = courses.filter(
    (c) => c.status === "rejected"
  );

  /* ---------------- Loading UI ---------------- */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Course Management
        </h1>
        <p className="text-muted-foreground text-sm">
          Review and manage instructor submissions
        </p>
      </div>

      <Tabs defaultValue="pending">

        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingCourses.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedCourses.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedCourses.length})
          </TabsTrigger>
        </TabsList>

        {/* ---------------- Pending ---------------- */}

        <TabsContent value="pending" className="mt-6">
          <Card className="overflow-hidden rounded-xl shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm">Course</th>
                    <th className="text-left py-4 px-6 text-sm">Instructor</th>
                    <th className="text-left py-4 px-6 text-sm">Submitted</th>
                    <th className="text-left py-4 px-6 text-sm">Status</th>
                    <th className="text-right py-4 px-6 text-sm">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {pendingCourses.map((course) => (
                    <tr
                      key={course._id}
                      className="border-b hover:bg-muted/40 transition"
                    >
                      <td className="py-4 px-6 font-medium">
                        {course.title}
                      </td>

                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {course.author?.name}
                      </td>

                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {new Date(course.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6">
                        <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-600">
                          Pending
                        </Badge>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/courses/${course._id}`)
                            }
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Review
                          </Button>

                          <Button
                            size="sm"
                            disabled={actionLoading === course._id}
                            onClick={() =>
                              handleApproval(course._id, "approved")
                            }
                          >
                            {actionLoading === course._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Approve
                              </>
                            )}
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={actionLoading === course._id}
                            onClick={() =>
                              handleApproval(course._id, "rejected")
                            }
                          >
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>

                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </Card>
        </TabsContent>

        {/* ---------------- Approved ---------------- */}

        <TabsContent value="approved" className="mt-6">
          <Card className="p-6 rounded-xl shadow-sm">
            {approvedCourses.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No approved courses yet.
              </p>
            ) : (
              approvedCourses.map((course) => (
                <div
                  key={course._id}
                  className="flex justify-between items-center border-b py-4"
                >
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.author?.name}
                    </p>
                  </div>

                  <Badge className="bg-green-500/10 text-green-600 border-green-600">
                    Approved
                  </Badge>
                </div>
              ))
            )}
          </Card>
        </TabsContent>

        {/* ---------------- Rejected ---------------- */}

        <TabsContent value="rejected" className="mt-6">
          <Card className="p-6 rounded-xl shadow-sm">
            {rejectedCourses.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No rejected courses.
              </p>
            ) : (
              rejectedCourses.map((course) => (
                <div
                  key={course._id}
                  className="flex justify-between items-center border-b py-4"
                >
                  <div>
                    <p className="font-medium">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.author?.name}
                    </p>
                  </div>

                  <Badge variant="destructive">
                    Rejected
                  </Badge>
                </div>
              ))
            )}
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}

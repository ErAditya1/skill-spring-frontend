"use client";

import {
  BookMarkedIcon,
  FileAxis3DIcon,
  LayoutDashboard,
  PlusCircle,
  Loader2,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import api from "@/api";
import { toast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";

import TitleForm from "@/app/dashboard/(routes)/(courses)/components/TitleForm";
import DescriptionForm from "@/app/dashboard/(routes)/(courses)/components/DescriptionForm";
import ThumbnailForm from "@/app/dashboard/(routes)/(courses)/components/ThumbnailForm";
import CategoryForm from "@/app/dashboard/(routes)/(courses)/components/LanguageForm";
import { DatePickerWithRange } from "@/app/dashboard/(routes)/(courses)/components/DurationForm";
import PriceForm from "@/app/dashboard/(routes)/(courses)/components/PriceForm";
import ChapterForm from "@/app/dashboard/(routes)/(courses)/components/chapter/ChaptersForm";
import ChapterList from "@/app/dashboard/(routes)/(courses)/components/chapter/ChapterList";
import QuizPost from "@/app/dashboard/(routes)/(courses)/components/quiz/QuizPost";
import QuizList from "@/app/dashboard/(routes)/(courses)/components/quiz/QuizList";
import CategorySelectForm from "@/app/dashboard/(routes)/(courses)/components/CategorySelect";

function EditCourse() {
  const { course_id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [courseData, setCourseData] = useState<any>(null);
  const [addChapter, setAddChapter] = useState(false);
  const [addQuiz, setAddQuiz] = useState(false);

  /* ---------------- FETCH COURSE ---------------- */

  useEffect(() => {
    if (!course_id) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/v1/courses/course/get-edit-course-data/${course_id}`
        );

        if (!res.data.data?.length) {
          setError(true);
        } else {
          setCourseData(res.data.data[0]);
        }
      } catch (err) {
        console.log(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [course_id]);

  /* ---------------- SUBMIT FOR APPROVAL ---------------- */

  const submitForReview = async () => {
    try {
      setSubmitting(true);

      const res = await api.patch(
        `/v1/courses/course/submit-for-review/${course_id}`,
        {}
      );

      setCourseData((prev: any) => ({
        ...prev,
        status: "pending",
      }));

      toast({
        title: "Course Submitted",
        description: res?.data?.message,
        variant: "success",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast({
        title: "Submission Failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- REORDER ---------------- */

  const onReorder = async (updateData: { _id: string; position: number }[]) => {
    try {
      const response = await api.put(
        `/v1/courses/course/reorder-chapters/${course_id}`,
        { updateData }
      );

      toast({
        title: "Success!",
        description: response?.data?.message,
        variant: "success",
      });

      setCourseData((prevState: any) => ({
        ...prevState,
        chapters: response?.data?.data,
      }));
    } catch (error) {
      toast({
        title: "Error!",
        description: "Something went wrong while updating.",
        variant: "destructive",
      });
    }
  };

  const onEdit = (_id: String) => {
    router.push(`/teacher/chapters/${_id}`);
  };

  const onQuizEdit = (_id: String) => {
    router.push(`/teacher/courses/edit-course/${course_id}/${_id}`);
  };

  /* ---------------- LOADING UI ---------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin h-8 w-8 text-primary" />
          <p className="text-muted-foreground text-sm">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------- ERROR UI ---------------- */

  if (error || !courseData) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold">Course not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  /* ---------------- MAIN UI ---------------- */

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-2xl font-semibold">
            {courseData.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your course content and submit for approval
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* STATUS BADGE */}
          <div
            className={`px-3 py-1 text-xs rounded-full border font-medium
              ${courseData.status === "draft" && "bg-gray-100 text-gray-600 border-gray-300"}
              ${courseData.status === "pending" && "bg-yellow-100 text-yellow-700 border-yellow-300"}
              ${courseData.status === "approved" && "bg-green-100 text-green-700 border-green-300"}
              ${courseData.status === "rejected" && "bg-red-100 text-red-700 border-red-300"}
            `}
          >
            {courseData.status}
          </div>

          {/* ACTION BUTTONS */}
          {courseData.status === "draft" && (
            <Button onClick={submitForReview} disabled={submitting}>
              {submitting && (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              )}
              Submit For Approval
            </Button>
          )}

          {courseData.status === "rejected" && (
            <Button variant="outline" onClick={submitForReview}>
              Resubmit
            </Button>
          )}

          {courseData.status === "pending" && (
            <Button disabled variant="secondary">
              Waiting for Admin Review
            </Button>
          )}

          {courseData.status === "approved" && (
            <Button disabled className="bg-green-600">
              Approved & Live
            </Button>
          )}
        </div>
      </div>

      {/* LAYOUT */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* COURSE DETAILS */}
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">

            <h2 className="text-lg font-semibold flex items-center gap-2">
              <LayoutDashboard size={18} />
              Course Details
            </h2>

            <TitleForm title={courseData.title} />
            <DescriptionForm description={courseData.description} />
            <ThumbnailForm thumbnail={courseData.thumbnail} />
            <CategoryForm language={courseData.language} />
            <DatePickerWithRange from={courseData.from} to={courseData.to} />

            <CategorySelectForm
              courseId={course_id as string}
              currentCategory={courseData.category?._id}
              setCourseData={setCourseData}
            />

            <PriceForm
              printPrice={courseData.printPrice}
              discount={courseData.discount}
            />
          </div>

          {/* CHAPTERS */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BookMarkedIcon size={18} />
                Course Curriculum
              </h2>

              <Button
                variant="outline"
                onClick={() => setAddChapter(!addChapter)}
              >
                <PlusCircle size={16} className="mr-2" />
                Add Lecture
              </Button>
            </div>

            {addChapter && (
              <ChapterForm
                setCourseData={setCourseData}
                setAddChapter={setAddChapter}
              />
            )}

            {courseData.chapters?.length ? (
              <ChapterList
                onEdit={onEdit}
                onRender={onReorder}
                items={courseData.chapters}
              />
            ) : (
              <div className="text-muted-foreground text-sm py-6 text-center border rounded-md">
                No lectures added yet.
              </div>
            )}
          </div>

          {/* QUIZZES */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileAxis3DIcon size={18} />
                Quizzes
              </h2>

              <Button variant="outline" onClick={() => setAddQuiz(!addQuiz)}>
                <PlusCircle size={16} className="mr-2" />
                Add Quiz
              </Button>
            </div>

            {addQuiz && (
              <QuizPost
                setCourseData={setCourseData}
                setAddQuiz={setAddQuiz}
              />
            )}

            {courseData.quizzes?.length ? (
              <QuizList
                onEdit={onQuizEdit}
                onRender={onReorder}
                items={courseData.quizzes}
              />
            ) : (
              <div className="text-muted-foreground text-sm py-6 text-center border rounded-md">
                No quizzes created yet.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          <div className="rounded-xl border bg-card p-6 shadow-sm sticky top-20">

            <h3 className="font-semibold mb-4">
              Course Workflow
            </h3>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span>Status</span>
                <span className="capitalize font-medium">
                  {courseData.status}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Lectures</span>
                <span>{courseData.chapters?.length || 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Quizzes</span>
                <span>{courseData.quizzes?.length || 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Price</span>
                <span>₹{courseData.sellingPrice}</span>
              </div>
            </div>

            {courseData.status === "pending" && (
              <div className="mt-4 p-3 rounded-md bg-yellow-50 text-yellow-700 text-xs border border-yellow-200">
                Your course is currently under admin review.
              </div>
            )}

            {courseData.status === "rejected" && (
              <div className="mt-4 p-3 rounded-md bg-red-50 text-red-700 text-xs border border-red-200">
                This course was rejected. Please update and resubmit.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default EditCourse;

'use client'

import {
  LayoutDashboard,
  PlusCircle,
  Trash2,
  HelpCircle
} from 'lucide-react'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import api from '@/api'
import { toast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import { Badge } from '@/components/ui/badge'

import QuizTitleForm from '@/app/dashboard/(routes)/(courses)/components/quiz/TitleForm'
import QuizDescriptionForm from '@/app/dashboard/(routes)/(courses)/components/quiz/DescriptionForm'
import QuizThumbnailForm from '@/app/dashboard/(routes)/(courses)/components/quiz/ThumbnailForm'
import QuizVisibility from '@/app/dashboard/(routes)/(courses)/components/quiz/VisibilityForm'
import QuizQuestionForm from '@/app/dashboard/(routes)/(courses)/components/quiz/QuizQuestionForm'

function EditQuiz() {

  const { quiz_id } = useParams();
  const router = useRouter();
  const [addQuestion, setAddQuestion] = useState(false)

  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    isPublished: false,
    isFree: false,
    order: 0,
    questions: [] as any[],
  });

  useEffect(() => {
    api.get(`/v1/quiz/get/${quiz_id}`)
      .then(res => setQuizData(res.data.data))
      .catch(console.log)
  }, [quiz_id]);

  /* ---------------- Publish Toggle ---------------- */

  const onPublishToggle = async () => {
    try {
      const res = await api.patch(`/v1/quiz/published/${quiz_id}`, {})
      setQuizData(prev => ({
        ...prev,
        isPublished: res.data.data.isPublished
      }))

      toast({
        title: 'Success!',
        description: res.data.message,
        variant: 'success',
      })

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Publishing Failed',
        description: axiosError.response?.data.message,
        variant: 'destructive',
      })
    }
  };

  /* ---------------- Delete Quiz ---------------- */

  const deleteQuiz = async () => {
    try {
      const res = await api.delete(`/v1/quiz/delete/${quiz_id}`)
      toast({
        title: 'Deleted!',
        description: res.data.message,
        variant: 'success',
      })
      router.back()
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Delete Failed',
        description: axiosError.response?.data.message,
        variant: 'destructive',
      })
    }
  }

  /* ---------------- Delete Question ---------------- */

  const deleteQuestion = async (question_id: string) => {
    try {
      await api.delete(`/v1/quiz/delete-question/${question_id}`)
      setQuizData(prev => ({
        ...prev,
        questions: prev.questions.filter(q => q._id !== question_id)
      }))

      toast({
        title: 'Question Deleted',
        variant: 'success',
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message,
        variant: 'destructive',
      })
    }
  }

  if (!quizData?.title) return null

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">

      {/* Top Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">
            {quizData.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage quiz content and questions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            className={
              quizData.isPublished
                ? "bg-green-500/10 text-green-600 border-green-600"
                : "bg-yellow-500/10 text-yellow-600 border-yellow-600"
            }
          >
            {quizData.isPublished ? "Published" : "Draft"}
          </Badge>

          <Button onClick={onPublishToggle}>
            {quizData.isPublished ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT SIDE - Quiz Settings */}
        <div className="lg:col-span-2 space-y-6">

          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <LayoutDashboard size={18} />
              Quiz Settings
            </h2>

            <QuizTitleForm title={quizData.title} />
            <QuizDescriptionForm description={quizData.description} />
            <QuizThumbnailForm thumbnail={quizData.thumbnail} />
            <QuizVisibility visibility={quizData.isFree} />
          </div>

          {/* Questions Section */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <HelpCircle size={18} />
                Questions
              </h2>

              <Button
                variant="outline"
                onClick={() => setAddQuestion(!addQuestion)}
              >
                <PlusCircle size={16} className="mr-2" />
                Add Question
              </Button>
            </div>

            {addQuestion && (
              <QuizQuestionForm
                setQuizData={setQuizData}
                setAddQuestion={setAddQuestion}
              />
            )}

            {quizData.questions?.length ? (
              <div className="space-y-4">
                {quizData.questions.map((item, index) => (
                  <div
                    key={item._id}
                    className="border rounded-lg p-4 bg-muted/30 relative group"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium">
                        {index + 1}. {item.question}
                      </p>

                      <button
                        onClick={() => deleteQuestion(item._id)}
                        className="opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>

                    <div className="mt-3 space-y-1 text-sm">
                      {item.options?.map((option: string, i: number) => (
                        <p
                          key={i}
                          className={`pl-3 ${
                            option === item.answer
                              ? "text-green-600 font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {i + 1}. {option}
                        </p>
                      ))}
                    </div>

                    <p className="text-xs mt-3 text-muted-foreground">
                      Explanation: {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm py-8 text-center border rounded-md">
                No questions added yet.
              </div>
            )}

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">

          <div className="rounded-xl border bg-card p-6 shadow-sm sticky top-20">

            <h3 className="font-semibold mb-4">
              Quiz Status
            </h3>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-medium">
                  {quizData.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Questions</span>
                <span>{quizData.questions?.length || 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Access</span>
                <span>{quizData.isFree ? "Free" : "Paid"}</span>
              </div>

            </div>

            <div className="mt-6 space-y-3">
              <Button
                className="w-full"
                onClick={onPublishToggle}
              >
                {quizData.isPublished ? "Unpublish Quiz" : "Publish Quiz"}
              </Button>

              <Button
                variant="destructive"
                className="w-full"
                onClick={deleteQuiz}
              >
                Delete Quiz
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default EditQuiz

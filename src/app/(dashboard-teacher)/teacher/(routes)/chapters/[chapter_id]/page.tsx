'use client'

import {
  BadgeDollarSignIcon,
  BookMarkedIcon,
  FileAxis3DIcon,
  LayoutDashboard,
  PlusCircle,
  Trash2,
  FileText
} from 'lucide-react'

import React, { useEffect, useState } from 'react'
import { BiMoneyWithdraw } from 'react-icons/bi'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { AxiosError } from 'axios'
import api from '@/api'
import { toast } from '@/components/ui/use-toast'
import ThumbnailForm from '@/app/dashboard/(routes)/(courses)/components/ThumbnailForm'
import ChapterTitleForm from '@/app/dashboard/(routes)/(courses)/components/chapter/ChapterTitleForm'
import ChapterDescriptionForm from '@/app/dashboard/(routes)/(courses)/components/chapter/ChapterDescriptionForm'
import ChapterVideoIdForm from '@/app/dashboard/(routes)/(courses)/components/chapter/ChapterVideoIdForm'
import ChapterVisibility from '@/app/dashboard/(routes)/(courses)/components/chapter/ChapterVisibilityForm'
import { ApiResponse } from '@/types/ApiResponse'
import ChapterThumbnailForm from '@/app/dashboard/(routes)/(courses)/components/chapter/ChapterThumbnailForm'
import FileForm from '@/app/dashboard/(routes)/(courses)/components/chapter/FileForm'
import FileCard from '@/app/dashboard/(routes)/(courses)/components/chapter/FileCard'
import { Badge } from '@/components/ui/badge'

function EditChapter() {

  const { chapter_id } = useParams();
  const router = useRouter();
  const [addFile, setAddFile] = useState(false)

  const [chapterData, setChapterData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    videoId: '',
    isPublished: false,
    visibility: '',
    files: [],
    tests: [],
    order: 0,
  });

  useEffect(() => {
    api.get(`/v1/videos/video/get-video/${chapter_id}`)
      .then(res => setChapterData(res.data.data))
      .catch(console.log)
  }, [chapter_id]);

  /* ---------------- Delete File ---------------- */

  const deleteFile = async (file_id: string) => {
    try {
      await api.delete(`/v1/videos/video/file/${file_id}`)
      setChapterData(prev => ({
        ...prev,
        files: prev.files.filter((file: any) => file._id !== file_id)
      }))
    } catch (error) {
      console.log(error)
    }
  }

  /* ---------------- Publish ---------------- */

  const onPublishToggle = async () => {
    try {
      const endpoint = chapterData.isPublished
        ? `/v1/videos/video/update-videoUnPublish/${chapter_id}`
        : `/v1/videos/video/update-videoPublish/${chapter_id}`

      const res = await api.patch(endpoint, {})
      setChapterData(res.data.data)

      toast({
        title: 'Success!',
        description: res.data.message,
        variant: 'success',
      })

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast({
        title: 'Action Failed',
        description: axiosError.response?.data.message || "Something went wrong",
        variant: 'destructive',
      })
    }
  }

  /* ---------------- Delete Chapter ---------------- */

  const deleteChapter = async () => {
    try {
      const res = await api.delete(`/v1/videos/video/delete-chapter/${chapter_id}`)
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

  if (!chapterData?.title) return null

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">

      {/* Top Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">
            {chapterData.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage lecture details and resources
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            className={
              chapterData.isPublished
                ? "bg-green-500/10 text-green-600 border-green-600"
                : "bg-yellow-500/10 text-yellow-600 border-yellow-600"
            }
          >
            {chapterData.isPublished ? "Published" : "Draft"}
          </Badge>

          <Button onClick={onPublishToggle}>
            {chapterData.isPublished ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* Lecture Details */}
          <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">

            <h2 className="text-lg font-semibold flex items-center gap-2">
              <LayoutDashboard size={18} />
              Lecture Details
            </h2>

            <ChapterVideoIdForm videoId={chapterData.videoId} />
            <ChapterTitleForm title={chapterData.title} />
            <ChapterDescriptionForm description={chapterData.description} />
            <ChapterThumbnailForm thumbnail={chapterData.thumbnail} />
            <ChapterVisibility />

          </div>

          {/* Notes Section */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText size={18} />
                Lecture Resources
              </h2>

              <Button
                variant="outline"
                onClick={() => setAddFile(!addFile)}
              >
                <PlusCircle size={16} className="mr-2" />
                Add File
              </Button>
            </div>

            {addFile && (
              <FileForm
                setChapterData={setChapterData}
                setAddFile={setAddFile}
              />
            )}

            {chapterData.files?.length ? (
              <div className="space-y-3">
                {chapterData.files.map((item: any) => (
                  <div key={item._id} className="relative group">
                    <FileCard item={item} />

                    <button
                      onClick={() => deleteFile(item._id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-sm py-6 text-center border rounded-md">
                No resources uploaded yet.
              </div>
            )}

          </div>
        </div>

        {/* RIGHT SIDE PANEL */}
        <div className="space-y-6">

          <div className="rounded-xl border bg-card p-6 shadow-sm sticky top-20">

            <h3 className="font-semibold mb-4">
              Lecture Status
            </h3>

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-medium">
                  {chapterData.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Resources</span>
                <span>{chapterData.files?.length || 0}</span>
              </div>

              <div className="flex justify-between">
                <span>Order</span>
                <span>{chapterData.order}</span>
              </div>

            </div>

            <div className="mt-6 space-y-3">

              <Button
                className="w-full"
                onClick={onPublishToggle}
              >
                {chapterData.isPublished ? "Unpublish" : "Publish Lecture"}
              </Button>

              <Button
                variant="destructive"
                className="w-full"
                onClick={deleteChapter}
              >
                Delete Lecture
              </Button>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default EditChapter

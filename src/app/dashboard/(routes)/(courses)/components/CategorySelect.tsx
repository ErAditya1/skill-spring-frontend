'use client'

import React, { useEffect, useState } from 'react'
import api from '@/api'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface Props {
  courseId: string
  currentCategory?: string
  setCourseData: any
}

function CategorySelectForm({ courseId, currentCategory, setCourseData }: Props) {

  const [categories, setCategories] = useState<any[]>([])
  const [selected, setSelected] = useState(currentCategory || '')
  const [loading, setLoading] = useState(false)

  /* ---------------- Fetch Categories ---------------- */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/v1/admin/categories')
        setCategories(res.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchCategories()
  }, [])

  /* ---------------- Update Category ---------------- */

  const updateCategory = async () => {
    if (!selected) return

    try {
      setLoading(true)

      const res = await api.patch(
        `/v1/courses/course/updateCategory/${courseId}`,
        { category: selected }
      )

      setCourseData(res.data.data)

      toast({
        title: "Success",
        description: "Category updated successfully",
        variant: "success"
      })

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">

      <h3 className="text-sm font-medium">
        Course Category
      </h3>

      <div className="flex gap-3">

        <Select
          value={selected}
          onValueChange={(value) => setSelected(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>

          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={updateCategory}
          disabled={!selected || loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save"
          )}
        </Button>

      </div>

    </div>
  )
}

export default CategorySelectForm

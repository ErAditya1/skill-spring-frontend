"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import api from "@/api"
import { useToast } from "@/components/ui/use-toast"
import { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"

type Category = {
  _id: string
  name: string
  description: string
}

export default function CategoryManagement() {
  const { toast } = useToast()

  const [categories, setCategories] = useState<Category[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  // Fetch
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await api.get("/v1/admin/categories")
      setCategories(data.data)
    }
    fetchCategories()
  }, [])

  // Submit (Create / Update)
  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingCategory) {
        const { data } = await api.put(
          `/v1/admin/categories/${editingCategory._id}`,
          { name, description }
        )

        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === editingCategory._id ? data.data : cat
          )
        )

        toast({
          title: "Updated",
          description: data.message,
        })

      } else {
        const { data } = await api.post(
          "/v1/admin/categories",
          { name, description }
        )

        setCategories((prev) => [data.data, ...prev])

        toast({
          title: "Created",
          description: data.message,
        })
      }

      setName("")
      setDescription("")
      setEditingCategory(null)
      setIsDialogOpen(false)

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>

      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Operation failed",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete
  const handleDelete = async (id: string) => {
    await api.delete(`/v1/admin/categories/${id}`)

    setCategories((prev) =>
      prev.filter((cat) => cat._id !== id)
    )

    toast({
      title: "Deleted",
      description: "Category removed successfully",
    })
  }

  return (
    <div className="p-6">

      <div className="flex justify-between mb-8">
        <h1 className="text-2xl font-semibold">
          Category Management
        </h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Create Category"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">

              <div>
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingCategory ? "Update" : "Create"}
              </Button>

            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6 space-y-3">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex justify-between items-center border p-4 rounded-lg"
          >
            <div>
              <h3 className="font-semibold">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setEditingCategory(category)
                  setName(category.name)
                  setDescription(category.description)
                  setIsDialogOpen(true)
                }}
              >
                <Edit size={16} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(category._id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </Card>
      {/* STATS PANEL */}
      <Card className="p-6 mt-8 bg-muted/30">
        <h3 className="font-semibold mb-4">
          Statistics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">

          <div>
            <p className="text-2xl font-bold text-primary">
              {categories.length}
            </p>
            <p className="text-sm text-muted-foreground">
              Total Categories
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-primary">
              —
            </p>
            <p className="text-sm text-muted-foreground">
              Total Courses
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-primary">
              —
            </p>
            <p className="text-sm text-muted-foreground">
              Avg per Category
            </p>
          </div>

          <div>
            <p className="text-2xl font-bold text-primary">
              —
            </p>
            <p className="text-sm text-muted-foreground">
              Most Popular
            </p>
          </div>

        </div>
      </Card>

    </div>
  )
}

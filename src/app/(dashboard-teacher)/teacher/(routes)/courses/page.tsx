'use client'
import api from "@/api";
import FormModal from "@/components/FormModal";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { useAppSelector } from "@/store/hooks";
import { formatUploadDateTime } from "@/utils/agoTime";
import { SlidersHorizontal, SortDesc, BookOpen, Loader2 } from "lucide-react";
import ValidatedImage from '@/components/ValidatedImage';
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";

type Class = {
  _id: string;
  title: string;
  thumbnail: { secure_url: string };
  language: string;
  printPrice: number;
  sellingPrice: number;
  discount: number;
  from: string;
  to: string;
  isPublished: boolean;
  createdAt: string;
};

const columns = [
  { header: "Course", accessor: "1" },
  { header: "Language", accessor: "2" },
  { header: "Original Price", accessor: "3" },
  { header: "Selling Price", accessor: "4" },
  { header: "Discount", accessor: "5" },
  { header: "Duration", accessor: "6" },
  { header: "Status", accessor: "7" },
  { header: "Uploaded", accessor: "8" },
  { header: "Actions", accessor: "9" },
];

const ClassListPage = () => {
  const [courseData, setCourseData] = useState<Class[]>([]);
  const [filteredData, setFilteredData] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useAppSelector((state) => state.auth.user);

  /* ---------------------------------- */
  /* Fetch Courses */
  /* ---------------------------------- */

  useEffect(() => {
    setLoading(true);

    api
      .patch("/v1/courses/course/getAdminCourses", {})
      .then((res: any) => {
        setCourseData(res.data.data);
        setFilteredData(res.data.data);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  /* ---------------------------------- */
  /* Search Filter */
  /* ---------------------------------- */

  const handleChange = (text: string) => {
    const value = text.toLowerCase();

    const data = courseData.filter((c) =>
      c.title.toLowerCase().includes(value) ||
      c.language.toLowerCase().includes(value)
    );

    setFilteredData(data);
  };

  /* ---------------------------------- */
  /* Row Renderer */
  /* ---------------------------------- */

  const renderRow = (item: Class) => (
    <tr key={item._id} className="border-b hover:bg-muted/40 transition">
      <td className="p-4">
        <div className="flex items-center gap-4">
          <div className="aspect-video h-14 w-24 border rounded overflow-hidden">
            {item?.thumbnail?.secure_url && (
              <ValidatedImage
                src={item.thumbnail.secure_url}
                alt={item.title}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <p className="font-medium max-w-xs line-clamp-2">
            {item.title}
          </p>
        </div>
      </td>

      <td className="px-4">{item.language}</td>

      <td className="px-4 line-through text-muted-foreground">
        ₹{item.printPrice}
      </td>

      <td className="px-4 font-semibold text-primary">
        ₹{item.sellingPrice}
      </td>

      <td className="px-4">
        <Badge variant="secondary">
          {item.discount}%
        </Badge>
      </td>

      <td className="px-4 text-sm text-muted-foreground">
        {formatUploadDateTime(item.from)} - {formatUploadDateTime(item.to)}
      </td>

      <td className="px-4">
        {item.isPublished ? (
          <Badge className="bg-green-500/10 text-green-600 border-green-600">
            Published
          </Badge>
        ) : (
          <Badge variant="destructive">
            Draft
          </Badge>
        )}
      </td>

      <td className="px-4 text-sm text-muted-foreground">
        {formatUploadDateTime(item.createdAt)}
      </td>

      <td className="px-4">
        <div className="flex items-center gap-3">
          {user?.role === "teacher" &&  (
          <div className="flex items-center gap-3">
            <Link
              href={`/teacher/courses/edit-course/${item._id}`}
              className="text-primary hover:scale-110 transition"
            >
              <FaEdit />
            </Link>

            <FormModal
              table="course"
              type="delete"
              id={item._id}
            />
          </div>
        )}
        </div>
      </td>
    </tr>
  );

  /* ---------------------------------- */
  /* UI States */
  /* ---------------------------------- */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin" size={30} />
      </div>
    );
  }



  /* ---------------------------------- */
  /* Main UI */
  /* ---------------------------------- */

  return (
    <div className="p-6 rounded-xl bg-card shadow-sm border m-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">
          All Courses
        </h1>

        <div className="flex items-center gap-4">
          <TableSearch handleChange={handleChange} />

          <button className="w-9 h-9 flex items-center justify-center rounded-lg border hover:bg-muted">
            <SlidersHorizontal size={18} />
          </button>

          <button className="w-9 h-9 flex items-center justify-center rounded-lg border hover:bg-muted">
            <SortDesc size={18} />
          </button>

          {user?.role === "teacher" && (
            <FormModal table="course" type="create" />
          )}
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} renderRow={renderRow} data={filteredData} />
    </div>
  );
};

export default ClassListPage;

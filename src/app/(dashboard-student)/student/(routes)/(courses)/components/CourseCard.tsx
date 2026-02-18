'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@mui/joy';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Star } from 'lucide-react';
import api from '@/api';
import AvatarLayout from '@/components/AvatarLayout';
import { Badge } from '@/components/ui/badge';
import { MdEventAvailable } from 'react-icons/md';

type Props = {
  _id: string;
};

export default function CourseCard({ _id }: Props) {
  const [courseData, setCourseData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          `/v1/courses/course/getPublishedCourses/${_id}`
        );
        setCourseData(res.data.data[0]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (_id) fetchData();
  }, [_id]);

  if (isLoading) {
    return (
      <Card className="p-0 shadow-md">
        <Skeleton className="aspect-video w-full" />
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={`/courses/${_id}`}>

      <Card
        className={`group p-0 dark:bg-card overflow-hidden transition-all duration-300 hover:shadow-xl  border ${
          courseData?.isEnrolled
            ? 'border-green-500'
            : 'border-border'
        }`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={courseData?.thumbnail?.secure_url}
            alt={courseData?.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Category Badge */}
          {courseData?.category?.name && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary text-primary-foreground text-xs">
                {courseData.category.name}
              </Badge>
            </div>
          )}

          {/* Enrolled Badge */}
          {courseData?.isEnrolled && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-green-600 text-white text-xs">
                Enrolled
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-2">

          {/* Title */}
          <h3 className="font-semibold text-sm line-clamp-2 leading-snug">
            {courseData?.title}
          </h3>

          {/* Instructor */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <AvatarLayout
              src={courseData?.author?.avatar?.url}
              name={courseData?.author?.name}
              className="h-6 w-6"
            />
            <span>{courseData?.author?.name}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-xs">
            <span className="font-semibold text-yellow-600">
              {courseData?.rating?.toFixed(1)}
            </span>

            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < courseData?.rating
                      ? 'fill-yellow-500 text-yellow-500'
                      : 'text-muted-foreground'
                  }
                />
              ))}
            </div>

            <span className="text-muted-foreground">
              ({courseData?.totalReviews})
            </span>
          </div>

          {/* Chapters & Language */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen size={14} />
              {courseData?.chapterCount} Chapters
            </div>
            <span>{courseData?.language}</span>
          </div>

          {/* Price Section */}
          <div className="flex items-center gap-2 pt-1">

            {courseData?.sellingPrice === 0 ? (
              <span className="font-bold text-green-600">
                Free
              </span>
            ) : (
              <>
                <span className="font-bold text-sm">
                  ₹{courseData?.sellingPrice}
                </span>

                {courseData?.printPrice > courseData?.sellingPrice && (
                  <>
                    <span className="line-through text-xs text-muted-foreground">
                      ₹{courseData?.printPrice}
                    </span>

                    <Badge
                      variant="secondary"
                      className="text-[10px]"
                    >
                      {courseData?.discount}% OFF
                    </Badge>
                  </>
                )}
              </>
            )}
          </div>

        </CardContent>
      </Card>
    </Link>
  );
}

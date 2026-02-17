'use client';

import React, { useEffect, useState } from 'react';
import CourseCard from '../components/CourseCard';
import api from '@/api';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { LoadingScreen } from '@/context/UserContext';
import { BookOpen, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Page() {
  const [courseData, setCourseData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* ---------------------------------- */
  /* Fetch Courses */
  /* ---------------------------------- */

  useEffect(() => {
    setLoading(true);

    api
      .patch('/v1/courses/course/getAllCourses')
      .then((res) => {
        setCourseData(res.data.data || []);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------------------------------- */
  /* UI States */
  /* ---------------------------------- */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingScreen message="Loading Courses..." size={30} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20">
        <SearchX size={60} className="text-destructive mb-4" />
        <h2 className="text-lg font-semibold mb-2">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mb-4">
          Unable to load courses. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (courseData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24">
        <BookOpen size={60} className="text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold mb-2">
          No Courses Available
        </h2>
        <p className="text-muted-foreground max-w-md">
          There are currently no courses published. Check back later or explore other categories.
        </p>
      </div>
    );
  }

  /* ---------------------------------- */
  /* Main UI */
  /* ---------------------------------- */

  return (
    <div className="w-full px-4 py-6">

      {/* Section Header */}
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="text-primary" />
        <h1 className="text-2xl font-semibold">
          Explore Courses
        </h1>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {courseData.map((course, index) => (
          <HoverEffect key={course?._id} index={index}>
            <CourseCard _id={course?._id} />
          </HoverEffect>
        ))}
      </div>
    </div>
  );
}

export default Page;

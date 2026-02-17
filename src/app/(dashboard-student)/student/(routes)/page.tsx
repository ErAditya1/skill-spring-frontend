"use client";
import api from "@/api";
import React, { useEffect, useState, useCallback } from "react";
import CourseCard from "./(courses)/components/CourseCard";
import VideoCard from "./(courses)/components/VideoCard";
import PostCard from "@/components/PostCard";
import { LoadingScreen } from "@/context/UserContext";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";

function Home() {
  const [recomendedData, setRecomendedData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [noMoreContent, setNoMoreContent] = useState(false);
  const [enrolledCourse, setEnrolledCourse] = useState<any[]>([]);

  /* ---------------------------------- */
  /* Fetch Enrolled Courses */
  /* ---------------------------------- */

  useEffect(() => {
    api
      .patch(`/v1/courses/course/getEnrolledCourses`)
      .then((res) => {
        const data = res.data.data || [];
        setEnrolledCourse(data);
      })
      .catch((error) => console.log(error));
  }, []);

  /* ---------------------------------- */
  /* Fetch Recommended Content */
  /* ---------------------------------- */

  useEffect(() => {
    setLoading(true);

    api
      .get(`/v1/comman/recomended?page=${page}`)
      .then((res) => {
        const data = res.data.data || [];

        if (data.length > 0) {
          setRecomendedData((prev) => [...prev, ...data]);
        } else {
          setNoMoreContent(true);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, [page]);

  /* ---------------------------------- */
  /* Infinite Scroll */
  /* ---------------------------------- */

  const loadMoreContent = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !loading && !noMoreContent) {
        setPage((prev) => prev + 1);
      }
    },
    [loading, noMoreContent]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(loadMoreContent, {
      rootMargin: "200px",
    });

    const sentinel = document.getElementById("sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [loadMoreContent]);

  /* ---------------------------------- */
  /* Empty State */
  /* ---------------------------------- */

  const showEmpty =
    !loading &&
    enrolledCourse.length === 0 &&
    recomendedData.length === 0;

  return (
    <div className="text-foreground mt-4 px-4">

      {/* Section Title */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-primary" />
        <h2 className="text-xl font-semibold">Recommended For You</h2>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

        {/* Enrolled Courses */}
        {enrolledCourse.map((course, index) => (
          <HoverEffect key={`enrolled-${index}`} index={index}>
            <CourseCard _id={course?.course_Id} />
          </HoverEffect>
        ))}

        {/* Recommended Content */}
        {recomendedData.map((item, index) => {
          if (item?.type === "video") {
            return (
              <HoverEffect key={index} index={index}>
                <VideoCard _id={item?.contentId} />
              </HoverEffect>
            );
          }

          if (item?.type === "course") {
            return (
              <HoverEffect key={index} index={index}>
                <CourseCard _id={item?.contentId} />
              </HoverEffect>
            );
          }

          if (item?.type === "post") {
            return (
              <HoverEffect key={index} index={index}>
                <PostCard _id={item?.contentId} />
              </HoverEffect>
            );
          }

          return null;
        })}
      </div>

      {/* Empty State UI */}
      {showEmpty && (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <BookOpen size={60} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No Content Available Yet
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start exploring courses and videos to build your learning journey.
          </p>
          <Button onClick={() => (window.location.href = "/courses")}>
            Explore Courses
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading && !noMoreContent && (
        <div className="flex justify-center mt-8">
          <LoadingScreen message="Loading more content..." className="h-20" size={25} />
        </div>
      )}

      {/* End Message */}
      {noMoreContent && recomendedData.length > 0 && (
        <div className="text-center text-muted-foreground mt-8">
          🎉 You've reached the end.
        </div>
      )}

      <div id="sentinel" className="h-10"></div>
    </div>
  );
}

export default Home;

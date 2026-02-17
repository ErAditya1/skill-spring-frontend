"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StarIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import MaxWidthWrapper from "@/app/(marketing)/components/global/max-width-wrapper";

const COURSES = [
  {
    id: 1,
    title: "Complete MERN Stack Bootcamp",
    instructor: "Aditya Kumar",
    category: "Development",
    price: 1999,
    rating: 5,
    level: "Advanced",
    lessons: 42,
    thumbnail: "/assets/course1.jpg",
  },
  {
    id: 2,
    title: "Next.js Production Guide",
    instructor: "Rahul Sharma",
    category: "Development",
    price: 0,
    rating: 4,
    level: "Intermediate",
    lessons: 28,
    thumbnail: "/assets/course2.jpg",
  },
  {
    id: 3,
    title: "React for Beginners",
    instructor: "Anita Verma",
    category: "Frontend",
    price: 999,
    rating: 5,
    level: "Beginner",
    lessons: 35,
    thumbnail: "/assets/course3.jpg",
  },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [priceType, setPriceType] = useState("All");
  const [rating, setRating] = useState("All");
  const [level, setLevel] = useState("All");

  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesSearch = course.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || course.category === category;

      const matchesPrice =
        priceType === "All" ||
        (priceType === "Free" && course.price === 0) ||
        (priceType === "Paid" && course.price > 0);

      const matchesRating =
        rating === "All" || course.rating >= Number(rating);

      const matchesLevel =
        level === "All" || course.level === level;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesLevel
      );
    });
  }, [search, category, priceType, rating, level]);

  return (
    <div className="flex flex-col w-full py-16">

      <MaxWidthWrapper>

        {/* PAGE HEADER */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold">
            Explore Our Courses
          </h1>
          <p className="text-muted-foreground mt-2">
            Discover trending courses and level up your skills.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-8">
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* FILTER SIDEBAR */}
          <div className="space-y-6">

            {/* CATEGORY */}
            <div>
              <h3 className="font-semibold mb-2">Category</h3>
              {["All", "Development", "Frontend"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="block text-sm hover:text-primary"
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* PRICE */}
            <div>
              <h3 className="font-semibold mb-2">Price</h3>
              {["All", "Free", "Paid"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPriceType(p)}
                  className="block text-sm hover:text-primary"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* RATING */}
            <div>
              <h3 className="font-semibold mb-2">Rating</h3>
              {["All", "4", "5"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRating(r)}
                  className="block text-sm hover:text-primary"
                >
                  {r === "All" ? "All" : `${r}+ Stars`}
                </button>
              ))}
            </div>

            {/* LEVEL */}
            <div>
              <h3 className="font-semibold mb-2">Level</h3>
              {["All", "Beginner", "Intermediate", "Advanced"].map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className="block text-sm hover:text-primary"
                >
                  {l}
                </button>
              ))}
            </div>

          </div>

          {/* COURSE GRID */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition">
                <CardContent className="p-0">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    width={500}
                    height={300}
                    className="rounded-t-lg object-cover h-48 w-full"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {course.instructor}
                    </p>
                    <div className="flex items-center mt-2 gap-1">
                      {Array.from({ length: course.rating }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className="w-4 h-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {course.level} • {course.lessons} Lessons
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center">
                  <span className="font-bold">
                    {course.price === 0
                      ? "Free"
                      : `₹${course.price}`}
                  </span>
                  <Button size="sm" asChild>
                    <Link href={`/courses/${course.id}`}>
                      View Course
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {filteredCourses.length === 0 && (
              <p className="text-muted-foreground">
                No courses found.
              </p>
            )}

          </div>
        </div>

      </MaxWidthWrapper>
    </div>
  );
}

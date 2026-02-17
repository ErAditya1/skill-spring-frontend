"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StarIcon } from "lucide-react";
import MaxWidthWrapper from "./components/global/max-width-wrapper";

const COURSES = [
  {
    id: 1,
    title: "Complete MERN Stack Bootcamp",
    instructor: "Aditya Kumar",
    price: 1999,
    rating: 5,
    lessons: 42,
    thumbnail: "/assets/course1.jpg",
  },
  {
    id: 2,
    title: "Next.js Production Guide",
    instructor: "Rahul Sharma",
    price: 1499,
    rating: 4,
    lessons: 28,
    thumbnail: "/assets/course2.jpg",
  },
  {
    id: 3,
    title: "React for Beginners",
    instructor: "Anita Verma",
    price: 999,
    rating: 5,
    lessons: 35,
    thumbnail: "/assets/course3.jpg",
  },
];

const REVIEWS = [
  {
    name: "Rohit Singh",
    review:
      "The course structure is excellent. I was able to track my progress easily and complete everything step by step.",
    rating: 5,
  },
  {
    name: "Priya Mehta",
    review:
      "The instructor dashboard is simple and powerful. Uploading lessons was very smooth.",
    rating: 4,
  },
  {
    name: "Aman Gupta",
    review:
      "Secure enrollment and well-organized curriculum. Highly recommend SkillSpring!",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <div className="mt-20">
      <div
        id="home"
        className="absolute inset-0 dark:bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] h-full"
      ></div>
      <div className="flex flex-col w-full overflow-x-hidden">
        {/* HERO SECTION */}
        <section className="py-20 text-center bg-gradient-to-b from-background/80 to-muted">
          <MaxWidthWrapper>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Learn Without Limits.
              <br />
              <span className="text-primary">Teach Without Barriers.</span>
            </h1>

            <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
              SkillSpring is a modern learning marketplace where students
              discover high-quality courses and instructors share their
              expertise with the world.
            </p>

            <div className="flex gap-4 justify-center mt-8">
              <Button asChild size="lg">
                <Link href="/courses">Browse Courses</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/instructor/dashboard">Become Instructor</Link>
              </Button>
            </div>
          </MaxWidthWrapper>
        </section>

        {/* TRENDING COURSES */}
        <section className="py-20">
          <MaxWidthWrapper>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-semibold">Trending Courses</h2>
              <Link
                href="/courses"
                className="text-primary font-medium hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {COURSES.map((course) => (
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
                      <h3 className="font-semibold text-lg">{course.title}</h3>
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
                        {course.lessons} Lessons
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <span className="font-bold">₹{course.price}</span>
                    <Button size="sm" asChild>
                      <Link href={`/courses/${course.id}`}>View Course</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </MaxWidthWrapper>
        </section>

        {/* INSTRUCTOR CTA */}
        <section className="py-20 bg-muted text-center">
          <MaxWidthWrapper>
            <h2 className="text-3xl md:text-4xl font-semibold">
              Share Your Knowledge With the World
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Create structured courses, upload lessons, manage students, and
              grow your income through our powerful instructor dashboard.
            </p>
            <Button className="mt-8" size="lg" asChild>
              <Link href="/instructor/dashboard">Start Teaching Today</Link>
            </Button>
          </MaxWidthWrapper>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20">
          <MaxWidthWrapper>
            <h2 className="text-3xl font-semibold text-center mb-12">
              Platform Features
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <h3 className="font-semibold">Course Builder</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Create structured courses with modules and lessons.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Secure Enrollment</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Simple and secure checkout experience.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Progress Tracking</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Resume courses anytime and track completion.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">Reviews & Ratings</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Transparent feedback system for quality assurance.
                </p>
              </div>
            </div>
          </MaxWidthWrapper>
        </section>

        {/* REVIEWS */}
        <section className="py-20 bg-muted">
          <MaxWidthWrapper>
            <h2 className="text-3xl font-semibold text-center mb-12">
              What Our Users Say
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REVIEWS.map((review, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">{review.review}</p>
                    <div className="flex mt-4 gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className="w-4 h-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </div>
                    <p className="mt-2 font-medium">{review.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </MaxWidthWrapper>
        </section>

        {/* FINAL CTA */}
        <section className="py-20 text-center">
          <MaxWidthWrapper>
            <h2 className="text-3xl md:text-4xl font-semibold">
              Ready to Upgrade Your Skills?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of learners and start your journey today.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </MaxWidthWrapper>
        </section>
      </div>
    </div>
  );
}

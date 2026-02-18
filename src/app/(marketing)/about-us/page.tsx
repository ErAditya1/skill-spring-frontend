"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Eye,
  Users,
  BookOpen,
  Shield,
  Award,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MaxWidthWrapper from "../components/global/max-width-wrapper";

export default function AboutPage() {
  return (
    <div className="flex flex-col">

      {/* ================= HERO ================= */}

      <section className="py-24 bg-gradient-to-b from-background to-muted text-center">
        <MaxWidthWrapper>
          <h1 className="text-4xl md:text-5xl font-bold">
            About SkillSpring
          </h1>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg">
            Empowering learners and instructors through a modern,
            secure, and scalable education platform built for the future.
          </p>
        </MaxWidthWrapper>
      </section>

      {/* ================= OUR STORY ================= */}

      <section className="py-20">
        <MaxWidthWrapper className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h2 className="text-3xl font-semibold mb-6">
              Our Story
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              SkillSpring was created with a simple goal — to make high-quality
              education accessible, structured, and scalable for both learners
              and educators.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              In a rapidly evolving digital world, traditional learning models
              struggle to keep up. We built SkillSpring to bridge that gap —
              combining modern technology with expert-driven knowledge sharing.
            </p>
          </div>

          <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/assets/about.jpg"
              alt="About SkillSpring"
              fill
              className="object-cover"
            />
          </div>

        </MaxWidthWrapper>
      </section>

      {/* ================= MISSION & VISION ================= */}

      <section className="py-20 bg-muted">
        <MaxWidthWrapper>
          <div className="grid md:grid-cols-2 gap-10">

            <Card className="p-8 hover:shadow-lg transition">
              <CardContent className="p-0">
                <Target className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Our Mission
                </h3>
                <p className="text-muted-foreground">
                  To democratize education by providing a platform where
                  students can learn real-world skills and instructors can
                  build sustainable careers.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition">
              <CardContent className="p-0">
                <Eye className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Our Vision
                </h3>
                <p className="text-muted-foreground">
                  To become a global learning ecosystem that transforms
                  knowledge into opportunity and skills into success.
                </p>
              </CardContent>
            </Card>

          </div>
        </MaxWidthWrapper>
      </section>

      {/* ================= PLATFORM STRENGTH ================= */}

      <section className="py-20">
        <MaxWidthWrapper>

          <h2 className="text-3xl font-semibold text-center mb-16">
            What Makes SkillSpring Different?
          </h2>

          <div className="grid md:grid-cols-4 gap-8 text-center">

            <div>
              <BookOpen className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">
                Structured Courses
              </h4>
              <p className="text-sm text-muted-foreground">
                Well-organized modules and lessons for effective learning.
              </p>
            </div>

            <div>
              <Users className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">
                Instructor Tools
              </h4>
              <p className="text-sm text-muted-foreground">
                Powerful dashboard to manage content and students.
              </p>
            </div>

            <div>
              <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">
                Secure Payments
              </h4>
              <p className="text-sm text-muted-foreground">
                Safe transactions and protected user data.
              </p>
            </div>

            <div>
              <Award className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">
                Verified Quality
              </h4>
              <p className="text-sm text-muted-foreground">
                Course approval system ensures high content standards.
              </p>
            </div>

          </div>

        </MaxWidthWrapper>
      </section>

      {/* ================= FOUNDER SECTION ================= */}

      <section className="py-20 bg-muted text-center">
        <MaxWidthWrapper>

          <h2 className="text-3xl font-semibold mb-8">
            Built by Passionate Developers
          </h2>

          <p className="max-w-2xl mx-auto text-muted-foreground">
            SkillSpring was founded by developers who understand both
            technology and education. Our goal is to build scalable,
            high-performance systems that empower learning worldwide.
          </p>

          <Button className="mt-8" asChild>
            <Link href="/courses">
              Explore Courses
            </Link>
          </Button>

        </MaxWidthWrapper>
      </section>

    </div>
  );
}

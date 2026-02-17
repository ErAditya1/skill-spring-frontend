"use client";


import React, { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MaxWidthWrapper from "../global/max-width-wrapper";
import AnimationContainer from "../global/animation-container";
import MobileNavbar from "./mobile-navbar";
import { useAppSelector } from "@/store/hooks";
import ColorSchemeToggle from "@/components/ColorSchemeToggle";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  const { user } = useAppSelector((state) => state.auth);
  const role = user?.role;

  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTeacher = role === "teacher";
  const isStudent = role === "student";
  const isAdmin = role === "admin";

  return (
    <header
      className={cn(
        "sticky top-0 inset-x-0 h-16 w-full border-b border-transparent z-[99] bg-background",
        scroll && "border-border backdrop-blur-md bg-background/80"
      )}
    >
      <AnimationContainer reverse delay={0.1} className="size-full">
        <MaxWidthWrapper className="flex items-center justify-between h-full">
          
          {/* LEFT SIDE */}
          <div className="flex items-center space-x-10">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/skillspringLight.png"
                alt="SkillSpring"
                width={140}
                height={40}
                className="h-8 w-auto dark:hidden rounded-md"
              />
              <Image
                src="/skillspringDark.png"
                alt="SkillSpring"
                width={140}
                height={40}
                className="h-8 w-auto hidden dark:block rounded-md"
              />
            </Link>

            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>

                <NavigationMenuItem>
                  <Link href="/courses" legacyBehavior passHref>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      Browse Courses
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                

              

              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden lg:flex items-center gap-3">

            {/* Guest */}
            {!user && (
              <>
                <Link
                  href="/auth/sign-in"
                  className={buttonVariants({ size: "sm", variant: "ghost" })}
                >
                  Sign In
                </Link>

                <Link
                  href="/auth/sign-up"
                  className={buttonVariants({ size: "sm" })}
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Student */}
            {isStudent && (
              <Link
                href="/student"
                className={buttonVariants({ size: "sm" })}
              >
                My Courses
              </Link>
            )}

            {/* Teacher */}
            {isTeacher && (
              <Link
                href="/teacher"
                className={buttonVariants({ size: "sm" })}
              >
                Teacher Dashboard
              </Link>
            )}

            {/* Admin */}
            {isAdmin && (
              <Link
                href="/admin"
                className={buttonVariants({ size: "sm" })}
              >
                Admin Panel
              </Link>
            )}

            <ColorSchemeToggle />
          </div>

          {/* MOBILE NAV */}
          <MobileNavbar />

        </MaxWidthWrapper>
      </AnimationContainer>
    </header>
  );
};

export default Navbar;

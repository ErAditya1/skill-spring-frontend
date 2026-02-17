"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAppSelector } from "@/store/hooks";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import ColorSchemeToggle from "@/components/ColorSchemeToggle";

const MobileNavbar = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = () => setIsOpen(false);

  // 🔒 Hide completely if user is logged in
  if (user) return null;

  return (
    <div className="flex lg:hidden items-center justify-end">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>

        <SheetContent className="w-full p-6">
          <SheetClose asChild className="absolute top-4 right-4">
            <Button size="icon" variant="ghost">
              <X className="w-5 h-5" />
            </Button>
          </SheetClose>

          <div className="flex flex-col gap-6 mt-10">

            {/* AUTH BUTTONS */}
            <div className="flex flex-col gap-3">
              <Link
                href="/auth/sign-in"
                onClick={handleClose}
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full",
                })}
              >
                Sign In
              </Link>

              <Link
                href="/auth/sign-up"
                onClick={handleClose}
                className={buttonVariants({
                  className: "w-full",
                })}
              >
                Get Started
              </Link>
            </div>

            {/* NAV LINKS */}
            <div className="flex flex-col gap-4 pt-4 border-t">
              <Link href="/" onClick={handleClose} className="text-lg font-medium">
                Home
              </Link>

              <Link href="/courses" onClick={handleClose} className="text-lg font-medium">
                Browse Courses
              </Link>

              <Link href="/categories" onClick={handleClose} className="text-lg font-medium">
                Categories
              </Link>

              <Link href="/teacher" onClick={handleClose} className="text-lg font-medium">
                Become Instructor
              </Link>
            </div>

            {/* THEME TOGGLE */}
            <div className="pt-6 border-t">
              <ColorSchemeToggle />
            </div>

          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;

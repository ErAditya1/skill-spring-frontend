'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { FaSpinner } from 'react-icons/fa6';
import { MdOutlineCloudOff } from 'react-icons/md';
import { toast } from '@/components/ui/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, logoutUser } from '@/store/user/userSlice';
import api from '@/api';
import { usePathname, useRouter } from 'next/navigation';
import { handleSidebar } from '@/store/setting/settingSlice';
import { v4 as uuidv4 } from 'uuid';

/* ===================================== */
/* Loading Screen */
/* ===================================== */

export function LoadingScreen({
  message,
  className = 'h-dvh w-full',
  size = 50,
}: any) {
  return (
    <div className={`bg-background text-foreground flex justify-center items-center ${className}`}>
      <FaSpinner className="animate-spin mx-4" size={size} />
      {message}
    </div>
  );
}

/* ===================================== */
/* Offline Screen */
/* ===================================== */

function NoNetworkScreen() {
  return (
    <div className="bg-background text-foreground h-dvh w-full flex justify-center items-center">
      <MdOutlineCloudOff className="mx-4" size={50} />
      No Network Connection...
    </div>
  );
}

/* ===================================== */
/* Core Wrapper */
/* ===================================== */

function Page({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(false);

  /* ===================================== */
  /* ROUTE GROUPS */
  /* ===================================== */

  // Auth-only pages (should NOT be accessible if logged in)
  const authRoutes = [
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/verify',
    '/auth/reset-password',
  ];

  // Public pages (accessible to everyone)
  const publicRoutes = [
    '/',
    '/courses',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/refund',
  ];

  
const isPublicRoute = publicRoutes.some((path) => {
  if (path === '/') {
    return pathname === '/'; // exact match only
  }
  return pathname === path || pathname.startsWith(path + '/');
});
  
  const isAuthRoute = pathname.startsWith('/auth/')
  const isProfileRoute = pathname.startsWith('/profile');
  const isAdminRoute = pathname.startsWith('/admin');
  const isTeacherRoute = pathname.startsWith('/teacher');
  const isStudentRoute = pathname.startsWith('/student');

  /* ===================================== */
  /* Redirect Helper */
  /* ===================================== */

  const redirectByRole = (role: string) => {
    if (role === 'admin') return '/admin';
    if (role === 'teacher') return '/teacher';
    if (role === 'student') return '/student';
    return '/';
  };

  /* ===================================== */
  /* Fetch Current User */
  /* ===================================== */

  const getCurrentUser = async () => {
    try {
      const response = await api.get('/v1/users/current-user');
      const currentUser = response.data.data.user;

      dispatch(loginUser(currentUser));

      // 🚫 If logged in & trying to access auth page → redirect
      if (isAuthRoute) {
        router.replace(redirectByRole(currentUser.role));
      }

    } catch (error) {
      dispatch(logoutUser());

      // 🔒 If not logged in & accessing protected route → redirect to login
      if (
        (isProfileRoute ||
        isAdminRoute ||
        isTeacherRoute ||
        isStudentRoute ) && !isPublicRoute && !isAuthRoute
      ) {
        router.replace('/auth/sign-in');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===================================== */
  /* Initial Auth Check */
  /* ===================================== */

  useEffect(() => {
    getCurrentUser();
  }, []);

  /* ===================================== */
  /* Role Protection */
  /* ===================================== */

  useEffect(() => {
    if (!user || isPublicRoute) return;

    const denyAccess = () => {
      toast({
        title: 'Access Denied',
        description: 'You are not authorized to access this page.',
        variant: 'destructive',
      });

      router.replace(redirectByRole(user.role));
    };

    if (isAdminRoute && user.role !== 'admin') {
      denyAccess();
    }

    if (isTeacherRoute && user.role !== 'teacher') {
      denyAccess();
    }

    if (isStudentRoute && user.role !== 'student') {
      denyAccess();
    }

  }, [pathname, user]);

  /* ===================================== */
  /* Online / Offline Detection */
  /* ===================================== */

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (!isOnline) {
      timeout = setTimeout(() => setShowOffline(true), 3000);
    } else {
      setShowOffline(false);
    }

    return () => clearTimeout(timeout);
  }, [isOnline]);

  /* ===================================== */
  /* Unique Device ID */
  /* ===================================== */

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let uniqueId = localStorage.getItem('uniqueId');

    if (!uniqueId) {
      uniqueId = uuidv4();
      localStorage.setItem('uniqueId', uniqueId);
      document.cookie = `uniqueId=${uniqueId}; path=/; max-age=${
        60 * 60 * 24 * 365
      }`;
    }

    dispatch(handleSidebar(window.innerWidth >= 900));
  }, []);

  /* ===================================== */
  /* Final Render */
  /* ===================================== */

  if (loading)
    return (
      <LoadingScreen message="Verifying..." className="h-dvh w-screen" />
    );

  if (!isOnline && showOffline) return <NoNetworkScreen />;

  return <>{children}</>;
}


/* ===================================== */
/* Suspense Wrapper */
/* ===================================== */

export default function UserContext({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingScreen message="Loading..." />}>
      <Page>{children}</Page>
    </Suspense>
  );
}

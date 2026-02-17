'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { FaSpinner } from 'react-icons/fa6';
import { MdOutlineCloudOff } from 'react-icons/md';
import { toast } from '@/components/ui/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, logoutUser } from '@/store/user/userSlice';
import { AxiosError } from 'axios';
import api from '@/api';
import { usePathname, useRouter } from 'next/navigation';
import { handleSidebar } from '@/store/setting/settingSlice';
import { selectChat } from '@/store/chat/chatSlice';
import { v4 as uuidv4 } from 'uuid';

/* ---------------------------------- */
/* Loading Screen */
/* ---------------------------------- */

export function LoadingScreen({
  message,
  className = 'h-dvh w-full',
  size = 50,
}: any) {
  return (
    <div
      className={`bg-background text-foreground flex justify-center items-center ${className}`}
    >
      <FaSpinner className="animate-spin mx-4" size={size} />
      {message}
    </div>
  );
}

/* ---------------------------------- */
/* Offline Screen */
/* ---------------------------------- */

function NoNetworkScreen() {
  return (
    <div className="bg-background text-foreground h-dvh w-full flex justify-center items-center">
      <MdOutlineCloudOff className="mx-4" size={50} />
      No Network Connection...
    </div>
  );
}

/* ---------------------------------- */
/* Core Page Wrapper */
/* ---------------------------------- */

function Page({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const { isLoggedIn, user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(false);

  /* ---------------------------------- */
  /* Public Routes */
  /* ---------------------------------- */

  const isPublicPath = useMemo(
    () =>
      ['/auth', '/sign-in', '/sign-up', '/verify', '/reset-password'].some(
        (path) => pathname.startsWith(path)
      ),
    [pathname]
  );

  const commonPath = useMemo(
    () =>
      ['/terms-services', '/privacy-policy', '/support'].some((path) =>
        pathname.startsWith(path)
      ),
    [pathname]
  );

  /* ---------------------------------- */
  /* Fetch Current User (Cookie Based) */
  /* ---------------------------------- */

  const getCurrentUser = async () => {
    console.log("loading current user")
    setLoading(true);
    try {
      const response = await api.get('/v1/users/current-user');

      const currentUser = response.data.data.user;
      
      dispatch(loginUser(currentUser));

      if (isPublicPath) {
        router.replace('/');
      }
    } catch (error) {
      dispatch(logoutUser());

      if (!isPublicPath && !commonPath) {
        router.replace('/auth/sign-in');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------------- */
  /* Initial Auth Check */
  /* ---------------------------------- */

  useEffect(() => {
    getCurrentUser();
  }, []);

  /* ---------------------------------- */
  /* Role-Based Route Protection */
  /* ---------------------------------- */

  useEffect(() => {
    if (!user) return;

    const denyAccess = () => {
      toast({
        title: 'Access Denied',
        description: 'You are not authorized to access this page.',
        variant: 'destructive',
      });
      router.replace('/auth');
    };

    if (pathname.startsWith('/admin') && user.role !== 'admin') {
      denyAccess();
    }

    if (
      pathname.startsWith('/teacher') &&
      user.role !== 'teacher'
    ) {
      denyAccess();
    }

    if (
      pathname.startsWith('/student') &&
      user.role !== 'student'
    ) {
      denyAccess();
    }
  }, [pathname, user]);

  /* ---------------------------------- */
  /* Online / Offline Detection */
  /* ---------------------------------- */

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

  /* ---------------------------------- */
  /* Unique Device ID Setup */
  /* ---------------------------------- */

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

    dispatch(handleSidebar(window.screen.width >= 900));
  }, []);



  /* ---------------------------------- */
  /* Final Render */
  /* ---------------------------------- */

  if (loading)
    return (
      <LoadingScreen message="Verifying..." className="h-dvh w-screen" />
    );

  if (!isOnline && showOffline) return <NoNetworkScreen />;

  return <>{children}</>;
}

/* ---------------------------------- */
/* Suspense Wrapper */
/* ---------------------------------- */

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



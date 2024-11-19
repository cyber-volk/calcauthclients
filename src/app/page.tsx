'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import Calc301 from './components/calc301';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else {
        // Redirect based on user role
        switch (user.role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'agent':
            router.push('/agent/dashboard');
            break;
          case 'user':
            router.push('/user/dashboard');
            break;
        }
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // This will be briefly shown while redirecting
  return (
    <main>
      <Calc301 />
    </main>
  );
}

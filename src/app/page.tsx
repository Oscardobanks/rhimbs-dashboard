'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import Image from 'next/image';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Listen for authentication state changes
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/login');
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div>
      {loading && <div className="flex flex-col gap-5 items-center justify-center w-screen h-screen">
        <div className="transition duration-500 animate-pulse">
          <Image src="/assets/images/logo.png" alt="Rhibms Logo" width={150} height={150} className=" text-primary" />
        </div>
        <BeatLoader
          color="#2ed484"
          loading={loading}
          size={20}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>}

    </div>
  );
}

'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    const result = await signIn('google', {
      callbackUrl: '/dashboard',
      redirect: false,
    });

    if (result?.ok) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-96 rounded-lg p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Sign In
        </h1>
        <button
          onClick={handleGoogleSignIn}
          className="flex w-full items-center justify-center gap-2 rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
        >
          <FaGoogle />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

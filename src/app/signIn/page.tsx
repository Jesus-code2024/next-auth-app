'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    const result = await signIn('google', {
      callbackUrl: '/dashboard',
      redirect: false,
    });

    if (result?.ok) {
      router.push('/dashboard');
    }
  };

  const handleGithubSignIn = async () => {
    const result = await signIn('github', { callbackUrl: '/dashboard', redirect: false });
    if (result?.ok) router.push('/dashboard');
  };

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await signIn('credentials', {
      email,
      password,
      callbackUrl: '/dashboard',
      redirect: false,
    });
    if (result?.error) {
      setError(result.error);
    } else if (result?.ok) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-lg p-8 shadow-md space-y-6">
        <h1 className="text-center text-2xl font-bold text-gray-800">Iniciar sesión</h1>
        <form onSubmit={handleCredentials} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-slate-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-slate-600 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition"
          >
            Acceder
          </button>
        </form>
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            className="flex w-full items-center justify-center gap-2 rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            <FaGoogle /> Continuar con Google
          </button>
          <button
            onClick={handleGithubSignIn}
            className="flex w-full items-center justify-center gap-2 rounded bg-gray-800 px-4 py-2 text-white transition hover:bg-gray-700"
          >
            <FaGithub /> Continuar con GitHub
          </button>
        </div>
        <p className="text-center text-xs text-gray-500">
          ¿No tienes cuenta? <a href="/register" className="text-slate-700 underline">Regístrate</a>
        </p>
      </div>
    </div>
  );
}

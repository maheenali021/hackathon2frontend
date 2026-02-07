'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../../lib/api';
import Link from 'next/link';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('token', res.access_token);

      // Decode JWT to get user_id
      try {
        const base64Url = res.access_token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        if (payload.user_id) {
          localStorage.setItem('user_id', payload.user_id);
        }
      } catch (e) {
        console.error("Failed to decode token", e);
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F1B24] flex items-center justify-center p-4">
      <div className="neu-flat p-8 w-full max-w-md relative overflow-hidden">

        {/* Decorative Circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/20 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600/20 rounded-full blur-xl pointer-events-none"></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to continue to TaskEvo</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
            <div className="relative">
              <div className="absolute left-4 top-3.5 text-gray-500">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="neu-input pl-12"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <div className="relative">
              <div className="absolute left-4 top-3.5 text-gray-500">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="neu-input pl-12"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="#" className="text-xs text-purple-400 hover:text-purple-300">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full neu-btn-primary py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-purple-400 font-medium hover:text-purple-300 hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
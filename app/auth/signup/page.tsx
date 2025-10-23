'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { Swords, Sparkles, UserPlus } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();

      // Sign up the user with metadata
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
          },
        },
      });

      if (authError) throw authError;

      // Profile will be created automatically by database trigger
      // Give the trigger a moment to execute
      await new Promise(resolve => setTimeout(resolve, 500));

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-purple-600 p-3 rounded-lg border-4 border-purple-400 shadow-lg">
              <Swords className="w-8 h-8 text-yellow-300" />
            </div>
            <h1 className="text-4xl font-bold text-white font-pixel tracking-wider drop-shadow-lg">
              TodoBozo
            </h1>
          </div>
          <p className="text-purple-300 font-pixel text-xs">
            Start your adventure!
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-[#2a2139] border-4 border-[#3f3454] rounded-lg p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-6">
            <UserPlus className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white font-pixel text-center">
              Join Quest
            </h2>
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="p-4 rounded-lg bg-red-900/30 border-4 border-red-500/50 text-red-300 text-sm font-pixel">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2 font-pixel">
                Username
              </label>
              <input
                type="text"
                placeholder="adventurer123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-4 border-[#3f3454] bg-[#1a1625] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2 font-pixel">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-4 border-[#3f3454] bg-[#1a1625] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2 font-pixel">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border-4 border-[#3f3454] bg-[#1a1625] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-purple-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg border-4 border-purple-400 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-pixel text-sm mt-6"
            >
              {loading ? 'Creating...' : 'Begin Adventure'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t-2 border-purple-700">
            <p className="text-center text-sm text-purple-300 font-pixel">
              Already questing?{' '}
              <Link
                href="/auth/login"
                className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
              >
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

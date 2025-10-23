'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Settings, User as UserIcon, ChevronDown, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import Button from './ui/Button';
import PixelCharacter from './gamification/PixelCharacter';
import type { User as UserType } from '@/types';

interface HeaderProps {
  user: UserType;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  return (
    <header className="bg-[#2a2139] border-b-4 border-[#3f3454] sticky top-0 z-50 relative shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="bg-purple-600 p-2 rounded-lg border-2 border-purple-400 group-hover:scale-110 transition-transform">
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-yellow-300">
                <path fill="currentColor" d="M12 2L14 8L20 10L14 12L12 18L10 12L4 10L10 8L12 2Z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white font-pixel tracking-wider drop-shadow-lg">
              TodoBozo
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            {pathname !== '/dashboard' && (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg border-4 border-purple-400 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg font-pixel hover:scale-105"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            )}

            <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 px-4 py-3 bg-[#3f3454] hover:bg-[#4f4464] rounded-lg border-2 border-purple-500 transition-all hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/50"
            >
              <PixelCharacter
                level={user.level}
                avatarStyle={user.avatar_style}
                avatarColor={user.avatar_color}
                avatarAccessory={user.avatar_accessory}
                animation="idle"
                size="small"
              />
              <div className="hidden sm:block text-left">
                <div className="text-sm font-bold text-white font-pixel">
                  {user.display_name || user.username}
                </div>
                <div className="text-xs text-yellow-400 font-pixel">Level {user.level}</div>
              </div>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-purple-300" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-72 bg-[#2a2139] rounded-lg shadow-2xl border-4 border-purple-500 p-2 z-50"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{ imageRendering: 'pixelated' }}
                >
                  {/* Profile info */}
                  <div className="p-4 border-b-2 border-purple-700">
                    <div className="flex items-center gap-3">
                      <PixelCharacter
                        level={user.level}
                        avatarStyle={user.avatar_style}
                        avatarColor={user.avatar_color}
                        avatarAccessory={user.avatar_accessory}
                        animation="celebrate"
                        size="small"
                      />
                      <div>
                        <div className="font-bold text-white font-pixel text-sm">{user.display_name || user.username}</div>
                        <div className="text-xs text-yellow-400 font-pixel mt-1">{user.title || 'Adventurer'}</div>
                        <div className="text-xs text-purple-300 mt-1">Lv {user.level} • {user.total_xp} XP</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-2">
                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-purple-800/50 rounded-lg transition-colors group"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white font-pixel">Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-900/50 rounded-lg transition-colors text-left group"
                    >
                      <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                      <span className="text-sm font-medium text-red-400 group-hover:text-red-300 font-pixel">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

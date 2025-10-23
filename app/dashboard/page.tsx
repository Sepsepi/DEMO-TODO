import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import Header from '@/components/Header';
import LevelDisplay from '@/components/gamification/LevelDisplay';
import XPBar from '@/components/gamification/XPBar';
import StreakCounter from '@/components/gamification/StreakCounter';
import TaskList from '@/components/tasks/TaskList';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/auth/login');
  }

  // Get user profile
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen relative">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#2a2139] border-4 border-[#3f3454] rounded-lg p-6 shadow-2xl">
              <h2 className="text-3xl font-bold mb-2 text-white">
                Welcome back, {user.username || 'Adventurer'}!
              </h2>
              <p className="text-purple-300 font-pixel text-sm">
                Ready to level up today?
              </p>
            </div>

            <div className="bg-[#2a2139] border-4 border-[#3f3454] rounded-lg p-6 shadow-2xl">
              <XPBar totalXP={user.total_xp} />
            </div>
          </div>

          <LevelDisplay
            level={user.level}
            totalXP={user.total_xp}
            avatarStyle={user.avatar_style}
            avatarColor={user.avatar_color}
            avatarAccessory={user.avatar_accessory}
          />
        </div>

        <div className="mb-8">
          <StreakCounter
            currentStreak={user.current_streak}
            longestStreak={user.longest_streak}
          />
        </div>

        <TaskList userId={user.id} />
      </main>
    </div>
  );
}

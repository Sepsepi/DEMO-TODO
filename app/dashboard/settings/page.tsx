import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import Header from '@/components/Header';
import ProfileEditor from '@/components/settings/ProfileEditor';

export default async function SettingsPage() {
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
    <div className="min-h-screen">
      <Header user={user} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2 font-pixel">
            Profile Settings
          </h1>
          <p className="text-purple-300 font-pixel text-sm">
            Customize your character and preferences
          </p>
        </div>

        <ProfileEditor user={user} />
      </main>
    </div>
  );
}

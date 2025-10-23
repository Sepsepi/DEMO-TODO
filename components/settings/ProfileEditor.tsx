'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { User } from '@/types';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Button from '../ui/Button';
import AvatarSelector from '../gamification/AvatarSelector';
import PixelCharacter from '../gamification/PixelCharacter';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

interface ProfileEditorProps {
  user: User;
}

export default function ProfileEditor({ user }: ProfileEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState(user.display_name || user.username);
  const [title, setTitle] = useState(user.title || 'Adventurer');
  const [avatarStyle, setAvatarStyle] = useState(user.avatar_style || 'warrior');
  const [avatarColor, setAvatarColor] = useState(user.avatar_color || 'blue');
  const [avatarAccessory, setAvatarAccessory] = useState(user.avatar_accessory || 'none');

  const supabase = createClient();

  const handleSave = async () => {
    // Check if trying to save locked items
    const classUnlockLevels = { warrior: 1, mage: 3, rogue: 5, healer: 7, knight: 10, archer: 12 };
    const colorUnlockLevels = { blue: 1, red: 2, green: 4, purple: 6, orange: 8, pink: 10 };
    const accessoryUnlockLevels = { none: 1, crown: 5, glasses: 3, hat: 8, halo: 15, horns: 20 };

    if (classUnlockLevels[avatarStyle as keyof typeof classUnlockLevels] > user.level) {
      toast.error(`${avatarStyle} class unlocks at level ${classUnlockLevels[avatarStyle as keyof typeof classUnlockLevels]}`);
      return;
    }
    if (colorUnlockLevels[avatarColor as keyof typeof colorUnlockLevels] > user.level) {
      toast.error(`${avatarColor} color unlocks at level ${colorUnlockLevels[avatarColor as keyof typeof colorUnlockLevels]}`);
      return;
    }
    if (accessoryUnlockLevels[avatarAccessory as keyof typeof accessoryUnlockLevels] > user.level) {
      toast.error(`${avatarAccessory} accessory unlocks at level ${accessoryUnlockLevels[avatarAccessory as keyof typeof accessoryUnlockLevels]}`);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          display_name: displayName,
          title,
          avatar_style: avatarStyle,
          avatar_color: avatarColor,
          avatar_accessory: avatarAccessory,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated!');
      router.refresh();
    } catch (err) {
      toast.error('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (style: string, color: string, accessory: string) => {
    setAvatarStyle(style);
    setAvatarColor(color);
    setAvatarAccessory(accessory);
  };

  const titles = [
    'Adventurer',
    'Task Master',
    'Productivity Wizard',
    'Quest Hunter',
    'Goal Crusher',
    'Achievement Collector',
    'Time Warrior',
    'Focus Champion',
    'Legendary Doer',
  ];

  return (
    <div className="space-y-6">
      {/* Preview Card */}
      <div className="bg-[#2a2139] border-4 border-[#3f3454] rounded-lg p-6 shadow-2xl text-center">
        <div className="flex flex-col items-center">
          <PixelCharacter
            level={user.level}
            avatarStyle={avatarStyle}
            avatarColor={avatarColor}
            avatarAccessory={avatarAccessory}
            animation="celebrate"
            size="large"
          />
          <h2 className="text-2xl font-bold mt-4 text-white font-pixel">{displayName}</h2>
          <div className="flex items-center gap-2 mt-2 text-yellow-400">
            <span className="font-medium font-pixel text-sm">{title}</span>
          </div>
          <div className="mt-2 text-sm text-purple-300">
            Level {user.level} • {user.total_xp} XP
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-[#2a2139] border-4 border-[#3f3454] rounded-lg p-6 shadow-2xl">
        <h3 className="text-xl font-bold mb-4 text-white font-pixel">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2 font-pixel">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your hero name..."
              className="w-full px-4 py-2 rounded-lg border-4 border-[#3f3454] bg-[#1a1625] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2 font-pixel">
              Title
            </label>
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border-4 border-[#3f3454] bg-[#1a1625] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-pixel text-sm"
            >
              {titles.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Avatar Customization */}
      <div className="bg-[#2a2139] border-4 border-[#3f3454] rounded-lg p-6 shadow-2xl">
        <h3 className="text-xl font-bold mb-4 text-white font-pixel">Character Customization</h3>
        <AvatarSelector
          currentStyle={avatarStyle}
          currentColor={avatarColor}
          currentAccessory={avatarAccessory}
          currentLevel={user.level}
          onUpdate={handleAvatarUpdate}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2"
        >
          ← Back
        </Button>
      </div>
    </div>
  );
}

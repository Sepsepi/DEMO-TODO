'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { CreateTaskInput, Priority } from '@/types';
import { calculateXP } from '@/lib/utils';
import { toast } from 'sonner';
import CustomDatePicker from '../ui/CustomDatePicker';

interface TaskFormProps {
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TaskForm({ userId, onClose, onSuccess }: TaskFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTaskInput>({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    category: '',
  });

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const xpReward = calculateXP(formData.priority || 'medium');

      const { error } = await supabase.from('tasks').insert({
        user_id: userId,
        title: formData.title,
        description: formData.description || null,
        priority: formData.priority || 'medium',
        due_date: formData.due_date || null,
        category: formData.category || null,
        xp_reward: xpReward,
      });

      if (error) throw error;

      toast.success('Task created successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error('Failed to create task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#2a2139] border-4 border-[#3f3454] rounded-lg p-6 shadow-2xl relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-xl font-bold mb-6 text-white font-pixel">Create New Quest</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2 font-pixel">
            Quest Name
          </label>
          <input
            type="text"
            placeholder="What quest awaits you?"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-2 rounded-lg border-4 border-[#3f3454] bg-[#1a1625] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-purple-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2 font-pixel">
            Quest Details
          </label>
          <textarea
            placeholder="Add quest details... (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 rounded-lg border-4 border-[#3f3454] bg-[#1a1625] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-purple-400"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-purple-300 mb-2 font-pixel">
            Difficulty
          </label>
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value as Priority })
            }
            className="w-full px-4 py-2 rounded-lg border-4 border-[#3f3454] bg-[#1a1625] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-pixel text-sm"
          >
            <option value="low">Easy (10 XP)</option>
            <option value="medium">Medium (20 XP)</option>
            <option value="high">Hard (30 XP)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomDatePicker
            label="Quest Deadline"
            value={formData.due_date}
            onChange={(value) =>
              setFormData({ ...formData, due_date: value })
            }
          />

          <div>
            <label className="block text-sm font-medium text-purple-300 mb-2 font-pixel">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g., Work, Personal"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 rounded-lg border-4 border-[#3f3454] bg-[#1a1625] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-purple-400"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg border-4 border-purple-400 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-pixel"
          >
            {loading ? 'Creating...' : 'Accept Quest'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-[#1a1625] text-purple-300 font-bold rounded-lg border-4 border-[#3f3454] hover:border-purple-500 hover:text-white transition-all font-pixel"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

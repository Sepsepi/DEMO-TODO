'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Calendar, Tag } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { Task } from '@/types';
import { formatDate, calculateXP, calculateLevel } from '@/lib/utils';
import { toast } from 'sonner';

interface TaskItemProps {
  task: Task;
  onUpdate: () => void;
}

export default function TaskItem({ task, onUpdate }: TaskItemProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      const newCompletedState = !task.is_completed;

      // Update task
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          is_completed: newCompletedState,
          completed_at: newCompletedState ? new Date().toISOString() : null,
        })
        .eq('id', task.id);

      if (taskError) throw taskError;

      // If completing task, update user XP
      if (newCompletedState) {
        const { data: user, error: userFetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', task.user_id)
          .single();

        if (userFetchError) throw userFetchError;

        const newTotalXP = user.total_xp + task.xp_reward;
        const oldLevel = calculateLevel(user.total_xp);
        const newLevel = calculateLevel(newTotalXP);

        const { error: userUpdateError } = await supabase
          .from('users')
          .update({ total_xp: newTotalXP, level: newLevel })
          .eq('id', task.user_id);

        if (userUpdateError) throw userUpdateError;

        toast.success(`Task completed! +${task.xp_reward} XP`, {
          description:
            newLevel > oldLevel
              ? `Level Up! You are now level ${newLevel}!`
              : undefined,
        });
      } else {
        toast.success('Task marked as incomplete');
      }

      onUpdate();
      // Force page refresh to update XP display
      window.location.reload();
    } catch (err) {
      toast.error('Failed to update task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', task.id);

      if (error) throw error;

      toast.success('Task deleted');
      onUpdate();
    } catch (err) {
      toast.error('Failed to delete task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`bg-[#2a2139] border-4 border-[#3f3454] rounded-lg p-4 shadow-2xl transition-all ${
          task.is_completed ? 'opacity-60' : ''
        }`}
      >
        <div className="flex items-start gap-4">
          <button
            onClick={handleToggleComplete}
            disabled={loading}
            className={`flex-shrink-0 mt-1 w-6 h-6 rounded border-4 transition-all ${
              task.is_completed
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400'
                : 'border-[#3f3454] bg-[#1a1625] hover:border-purple-500'
            }`}
            style={{ imageRendering: 'pixelated' }}
          >
            {task.is_completed && <Check className="w-5 h-5 text-white" />}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-lg font-bold mb-1 font-pixel ${
                task.is_completed
                  ? 'line-through text-purple-400'
                  : 'text-white'
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="text-sm text-purple-300 mb-2">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-xs text-purple-300 font-pixel">
              <div className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-sm ${priorityColors[task.priority]}`}
                  style={{ imageRendering: 'pixelated' }}
                />
                <span className="capitalize">{task.priority}</span>
              </div>

              <div className="flex items-center gap-1 text-yellow-400">
                <Tag className="w-3 h-3" />
                <span>{task.xp_reward} XP</span>
              </div>

              {task.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.due_date)}</span>
                </div>
              )}

              {task.category && (
                <span className="px-2 py-0.5 bg-[#1a1625] border-2 border-[#3f3454] rounded text-purple-300">
                  {task.category}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-shrink-0 text-red-400 hover:text-red-300 hover:bg-red-900/20 p-2 rounded transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

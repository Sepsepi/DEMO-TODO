'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase';
import { Task, FilterType, SortType } from '@/types';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import { toast } from 'sonner';

interface TaskListProps {
  userId: string;
}

export default function TaskList({ userId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('date');

  const supabase = createClient();

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      toast.error('Failed to load tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const filterTasks = (tasks: Task[]) => {
    let filtered = tasks;

    // Apply filter
    if (filter === 'active') {
      filtered = filtered.filter((task) => !task.is_completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter((task) => task.is_completed);
    }

    // Apply sort
    if (sort === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      filtered.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    } else {
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return filtered;
  };

  const filteredTasks = filterTasks(tasks);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[#2a2139] border-4 border-[#3f3454] rounded-lg p-4 shadow-2xl animate-pulse">
            <div className="h-20 bg-[#1a1625] rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white font-pixel">Your Quests</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg border-4 border-purple-400 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg font-pixel"
        >
          <Plus className="w-4 h-4" />
          New Quest
        </button>
      </div>

      <TaskFilters
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
      />

      {showForm && (
        <TaskForm
          userId={userId}
          onClose={() => setShowForm(false)}
          onSuccess={fetchTasks}
        />
      )}

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-[#2a2139] border-4 border-[#3f3454] rounded-lg p-12 shadow-2xl text-center">
            <p className="text-purple-300 mb-4 font-pixel text-sm">
              {filter === 'completed'
                ? 'No completed quests yet. Start completing quests to earn XP!'
                : filter === 'active'
                ? 'No active quests. Create a new quest to get started!'
                : 'No quests yet. Create your first quest and start leveling up!'}
            </p>
            {filter === 'all' && !showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg border-4 border-purple-400 hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg font-pixel"
              >
                Create First Quest
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} onUpdate={fetchTasks} />
          ))
        )}
      </div>
    </div>
  );
}

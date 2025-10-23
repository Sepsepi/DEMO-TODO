export type Priority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  email: string;
  username: string;
  display_name?: string;
  level: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  avatar_style?: string;
  avatar_color?: string;
  avatar_accessory?: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: Priority;
  is_completed: boolean;
  completed_at?: string;
  due_date?: string;
  category?: string;
  xp_reward: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  due_date?: string;
  category?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: Priority;
  due_date?: string;
  category?: string;
  is_completed?: boolean;
}

export type FilterType = 'all' | 'active' | 'completed';
export type SortType = 'date' | 'priority';

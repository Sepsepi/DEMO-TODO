import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Priority } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Calculate XP reward based on priority
export function calculateXP(priority: Priority): number {
  const xpMap: Record<Priority, number> = {
    low: 10,
    medium: 20,
    high: 30,
  };
  return xpMap[priority];
}

// Calculate level from total XP
export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 100) + 1;
}

// Calculate XP progress to next level
export function calculateXPProgress(totalXP: number): {
  currentLevelXP: number;
  xpToNextLevel: number;
  percentage: number;
} {
  const currentLevelXP = totalXP % 100;
  const xpToNextLevel = 100 - currentLevelXP;
  const percentage = (currentLevelXP / 100) * 100;

  return {
    currentLevelXP,
    xpToNextLevel,
    percentage,
  };
}

// Format date for display
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Check if two dates are the same day
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Check if date is yesterday
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return isSameDay(date, yesterday);
}

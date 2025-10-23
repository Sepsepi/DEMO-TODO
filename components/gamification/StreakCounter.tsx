'use client';

import { motion } from 'framer-motion';
import { Flame, Award } from 'lucide-react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.div
        className="bg-[#2a2139] border-4 border-[#3f3454] rounded-lg p-6 shadow-2xl hover:border-orange-500 transition-colors"
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-orange-600 p-2 rounded border-2 border-orange-400">
            <Flame className="w-6 h-6 text-yellow-300" />
          </div>
          <span className="text-sm text-purple-300 font-pixel">
            Current Streak
          </span>
        </div>
        <p className="text-4xl font-bold text-white font-pixel">
          {currentStreak}
          <span className="text-base text-gray-400 ml-2 font-pixel">days</span>
        </p>
      </motion.div>

      <motion.div
        className="bg-[#2a2139] border-4 border-[#3f3454] rounded-lg p-6 shadow-2xl hover:border-green-500 transition-colors"
        whileHover={{ scale: 1.02, y: -2 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-green-600 p-2 rounded border-2 border-green-400">
            <Award className="w-6 h-6 text-yellow-300" />
          </div>
          <span className="text-sm text-purple-300 font-pixel">
            Best Streak
          </span>
        </div>
        <p className="text-4xl font-bold text-white font-pixel">
          {longestStreak}
          <span className="text-base text-gray-400 ml-2 font-pixel">days</span>
        </p>
      </motion.div>
    </div>
  );
}

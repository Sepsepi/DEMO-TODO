'use client';

import { motion } from 'framer-motion';
import { calculateXPProgress } from '@/lib/utils';

interface XPBarProps {
  totalXP: number;
}

export default function XPBar({ totalXP }: XPBarProps) {
  const { currentLevelXP, xpToNextLevel, percentage } = calculateXPProgress(totalXP);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm font-pixel text-purple-300">
        <span>XP Progress</span>
        <span className="text-yellow-400">
          {currentLevelXP} / 100 XP
        </span>
      </div>

      {/* Retro pixel progress bar */}
      <div className="relative h-8 bg-[#1a1625] border-4 border-[#3f3454] rounded-lg overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Pixel shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20" />

          {/* Scanlines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
          }} />
        </motion.div>

        {/* Percentage text overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-pixel text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>

      <p className="text-xs font-pixel text-gray-400">
        {xpToNextLevel} XP to next level
      </p>
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import PixelCharacter from './PixelCharacter';
import Link from 'next/link';
import { Settings } from 'lucide-react';

interface LevelDisplayProps {
  level: number;
  totalXP: number;
  avatarStyle?: string;
  avatarColor?: string;
  avatarAccessory?: string;
}

export default function LevelDisplay({
  level,
  totalXP,
  avatarStyle,
  avatarColor,
  avatarAccessory,
}: LevelDisplayProps) {
  return (
    <motion.div
      className="bg-[#2a2139] border-4 border-[#3f3454] rounded-lg p-6 text-center relative shadow-2xl"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >

      <div className="flex justify-center mb-4">
        <PixelCharacter
          level={level}
          avatarStyle={avatarStyle}
          avatarColor={avatarColor}
          avatarAccessory={avatarAccessory}
          animation="idle"
          size="large"
        />
      </div>
      <h3 className="text-2xl font-bold mb-1 text-white font-pixel">Level {level}</h3>
      <p className="text-sm text-purple-300">
        {totalXP} Total XP
      </p>

      {/* Next level preview */}
      <div className="mt-4 pt-4 border-t-2 border-purple-700">
        <p className="text-xs text-gray-400 mb-3 font-pixel">Next Level:</p>
        <PixelCharacter
          level={level + 1}
          avatarStyle={avatarStyle}
          avatarColor={avatarColor}
          avatarAccessory={avatarAccessory}
          animation="dance"
          size="small"
        />
      </div>
    </motion.div>
  );
}

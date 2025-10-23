'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, ReactNode } from 'react';
import PixelCharacter from './PixelCharacter';
import { LockIcon } from '../ui/Icons';

interface ItemPreviewPopupProps {
  children: ReactNode;
  isLocked: boolean;
  unlockLevel: number;
  itemName: string;
  itemType: 'class' | 'color' | 'accessory';
  previewStyle?: string;
  previewColor?: string;
  previewAccessory?: string;
  currentLevel: number;
}

export default function ItemPreviewPopup({
  children,
  isLocked,
  unlockLevel,
  itemName,
  itemType,
  previewStyle,
  previewColor,
  previewAccessory,
  currentLevel,
}: ItemPreviewPopupProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!isLocked) return; // Only show popup for locked items

    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    setShowPopup(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isLocked) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setShowPopup(!showPopup);
  };

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="relative"
      >
        {children}
      </div>

      <AnimatePresence>
        {showPopup && isLocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              mass: 0.5
            }}
            style={{
              position: 'fixed',
              left: position.x,
              top: position.y,
              transform: 'translate(-50%, -100%)',
              zIndex: 9999,
              pointerEvents: 'none',
            }}
            className="bg-[#2a2139] border-4 border-[#3f3454] rounded-lg p-4 shadow-2xl"
          >
            {/* Preview Character (only for class type) */}
            {itemType === 'class' && previewStyle && (
              <div className="flex justify-center mb-3">
                <PixelCharacter
                  level={currentLevel}
                  avatarStyle={previewStyle}
                  avatarColor={previewColor || 'blue'}
                  avatarAccessory={previewAccessory || 'none'}
                  animation="celebrate"
                  size="medium"
                />
              </div>
            )}

            {/* Preview Color Swatch (for color type) */}
            {itemType === 'color' && previewColor && (
              <div className="flex justify-center mb-3">
                <div
                  className={`w-16 h-16 rounded-lg bg-${previewColor}-500 border-4 border-white shadow-lg`}
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>
            )}

            {/* Lock Info */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <LockIcon className="w-5 h-5" />
                <span className="font-pixel text-sm">LOCKED</span>
              </div>

              <div className="text-white font-pixel text-xs">
                {itemName}
              </div>

              <div className="text-purple-300 font-pixel text-xs">
                Unlocks at Level {unlockLevel}
              </div>

              <div className="text-purple-400 font-pixel text-xs">
                {unlockLevel - currentLevel} levels to go!
              </div>
            </div>

            {/* Arrow pointing down */}
            <div
              className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full"
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid #3f3454',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

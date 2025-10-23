'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { LockIcon, CheckIcon, SwordIcon, StaffIcon, DaggerIcon, HealIcon, ShieldIcon, BowIcon, SparklesIcon, CrownIcon, GlassesIcon, TopHatIcon, HaloIcon, HornsIcon } from '../ui/Icons';
import PixelCharacter from './PixelCharacter';
import ItemPreviewPopup from './ItemPreviewPopup';

interface AvatarSelectorProps {
  currentStyle: string;
  currentColor: string;
  currentAccessory: string;
  currentLevel: number;
  onUpdate: (style: string, color: string, accessory: string) => void;
}

export default function AvatarSelector({
  currentStyle,
  currentColor,
  currentAccessory,
  currentLevel,
  onUpdate,
}: AvatarSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState(currentStyle);
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [selectedAccessory, setSelectedAccessory] = useState(currentAccessory);

  const styles = [
    { id: 'warrior', icon: SwordIcon, name: 'Warrior', color: 'from-red-500 to-orange-500', unlockLevel: 1 },
    { id: 'mage', icon: StaffIcon, name: 'Mage', color: 'from-purple-500 to-blue-500', unlockLevel: 3 },
    { id: 'rogue', icon: DaggerIcon, name: 'Rogue', color: 'from-gray-700 to-gray-900', unlockLevel: 5 },
    { id: 'healer', icon: HealIcon, name: 'Healer', color: 'from-green-400 to-emerald-500', unlockLevel: 7 },
    { id: 'knight', icon: ShieldIcon, name: 'Knight', color: 'from-yellow-500 to-amber-600', unlockLevel: 10 },
    { id: 'archer', icon: BowIcon, name: 'Archer', color: 'from-teal-500 to-cyan-500', unlockLevel: 12 },
  ];

  const colors = [
    { id: 'blue', name: 'Ocean Blue', color: 'bg-blue-500', unlockLevel: 1 },
    { id: 'red', name: 'Fire Red', color: 'bg-red-500', unlockLevel: 2 },
    { id: 'green', name: 'Forest Green', color: 'bg-green-500', unlockLevel: 4 },
    { id: 'purple', name: 'Royal Purple', color: 'bg-purple-500', unlockLevel: 6 },
    { id: 'orange', name: 'Sunset Orange', color: 'bg-orange-500', unlockLevel: 8 },
    { id: 'pink', name: 'Rose Pink', color: 'bg-pink-500', unlockLevel: 10 },
  ];

  const accessories = [
    { id: 'none', icon: SparklesIcon, name: 'None', unlockLevel: 1 },
    { id: 'crown', icon: CrownIcon, name: 'Crown', unlockLevel: 5 },
    { id: 'glasses', icon: GlassesIcon, name: 'Cool Glasses', unlockLevel: 3 },
    { id: 'hat', icon: TopHatIcon, name: 'Top Hat', unlockLevel: 8 },
    { id: 'halo', icon: HaloIcon, name: 'Halo', unlockLevel: 15 },
    { id: 'horns', icon: HornsIcon, name: 'Horns', unlockLevel: 20 },
  ];

  const handleUpdate = (style?: string, color?: string, accessory?: string) => {
    const newStyle = style || selectedStyle;
    const newColor = color || selectedColor;
    const newAccessory = accessory || selectedAccessory;

    setSelectedStyle(newStyle);
    setSelectedColor(newColor);
    setSelectedAccessory(newAccessory);
    onUpdate(newStyle, newColor, newAccessory);
  };

  return (
    <div className="space-y-6">
      {/* Class Selection */}
      <div>
        <h3 className="text-lg font-bold mb-3 text-purple-300 font-pixel">Choose Your Class</h3>
        <div className="grid grid-cols-3 gap-3">
          {styles.map((style) => {
            const isLocked = currentLevel < style.unlockLevel;
            const Icon = style.icon;
            return (
              <ItemPreviewPopup
                key={style.id}
                isLocked={isLocked}
                unlockLevel={style.unlockLevel}
                itemName={style.name}
                itemType="class"
                previewStyle={style.id}
                previewColor={selectedColor}
                previewAccessory={selectedAccessory}
                currentLevel={currentLevel}
              >
                <motion.button
                  onClick={() => handleUpdate(style.id)}
                  className={`p-4 rounded-lg border-4 transition-all shadow-lg relative w-full ${
                    selectedStyle === style.id
                      ? 'border-purple-500 bg-purple-600 text-white'
                      : 'border-[#3f3454] bg-[#1a1625] text-purple-300 hover:border-purple-500'
                  } ${isLocked ? 'opacity-70' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLocked && (
                    <div className="absolute top-1 right-1">
                      <LockIcon className="w-4 h-4 text-yellow-400" />
                    </div>
                  )}
                  <div className="mb-2 flex justify-center">
                    <Icon className="w-12 h-12" />
                  </div>
                  <div className="text-xs font-pixel">{style.name}</div>
                  {isLocked && (
                    <div className="text-xs font-pixel text-yellow-400 mt-1">Lv {style.unlockLevel}</div>
                  )}
                </motion.button>
              </ItemPreviewPopup>
            );
          })}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <h3 className="text-lg font-bold mb-3 text-purple-300 font-pixel">Pick Your Color</h3>
        <div className="grid grid-cols-6 gap-3">
          {colors.map((color) => {
            const isLocked = currentLevel < color.unlockLevel;
            return (
              <ItemPreviewPopup
                key={color.id}
                isLocked={isLocked}
                unlockLevel={color.unlockLevel}
                itemName={color.name}
                itemType="color"
                previewColor={color.id}
                currentLevel={currentLevel}
              >
                <motion.button
                  onClick={() => handleUpdate(undefined, color.id)}
                  className={`relative w-12 h-12 rounded-lg ${color.color} border-4 ${
                    selectedColor === color.id
                      ? 'border-white ring-4 ring-purple-500'
                      : 'border-[#3f3454]'
                  } ${isLocked ? 'opacity-50' : ''}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title={isLocked ? `Unlock at Level ${color.unlockLevel}` : color.name}
                  style={{ imageRendering: 'pixelated' }}
                >
                  {isLocked && (
                    <div className="absolute -top-1 -right-1">
                      <LockIcon className="w-3 h-3 text-yellow-400" />
                    </div>
                  )}
                  {selectedColor === color.id && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <CheckIcon className="w-6 h-6" />
                    </div>
                  )}
                </motion.button>
              </ItemPreviewPopup>
            );
          })}
        </div>
      </div>

      {/* Accessory Selection */}
      <div>
        <h3 className="text-lg font-bold mb-3 text-purple-300 font-pixel">Add an Accessory</h3>
        <div className="grid grid-cols-3 gap-3">
          {accessories.map((accessory) => {
            const isLocked = currentLevel < accessory.unlockLevel;
            const Icon = accessory.icon;
            return (
              <ItemPreviewPopup
                key={accessory.id}
                isLocked={isLocked}
                unlockLevel={accessory.unlockLevel}
                itemName={accessory.name}
                itemType="accessory"
                previewStyle={selectedStyle}
                previewColor={selectedColor}
                previewAccessory={accessory.id}
                currentLevel={currentLevel}
              >
                <motion.button
                  onClick={() => handleUpdate(undefined, undefined, accessory.id)}
                  className={`p-3 rounded-lg border-4 transition-all shadow-lg relative w-full ${
                    selectedAccessory === accessory.id
                      ? 'border-purple-500 bg-purple-600 text-white'
                      : 'border-[#3f3454] bg-[#1a1625] text-purple-300 hover:border-purple-500'
                  } ${isLocked ? 'opacity-70' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLocked && (
                    <div className="absolute top-1 right-1">
                      <LockIcon className="w-4 h-4 text-yellow-400" />
                    </div>
                  )}
                  <div className="mb-1 flex justify-center">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-xs font-pixel">{accessory.name}</div>
                  {isLocked && (
                    <div className="text-xs font-pixel text-yellow-400 mt-1">Lv {accessory.unlockLevel}</div>
                  )}
                </motion.button>
              </ItemPreviewPopup>
            );
          })}
        </div>
      </div>
    </div>
  );
}

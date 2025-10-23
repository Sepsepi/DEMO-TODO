'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { SpriteRenderer, TINY16_ANIMATIONS, type SpriteAnimation } from '@/lib/spriteUtils';

interface PixelCharacterProps {
  level: number;
  avatarStyle?: string;
  avatarColor?: string;
  avatarAccessory?: string;
  animation?: 'idle' | 'celebrate' | 'dance' | 'jump';
  size?: 'small' | 'medium' | 'large';
}

export default function PixelCharacter({
  level,
  avatarStyle = 'warrior',
  avatarColor = 'blue',
  avatarAccessory = 'none',
  animation = 'idle',
  size = 'medium',
}: PixelCharacterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [spriteRenderer, setSpriteRenderer] = useState<SpriteRenderer | null>(null);
  const animationRef = useRef<number>();

  const sizeMap = {
    small: 64,   // 16px * 4 scale
    medium: 96,  // 16px * 6 scale
    large: 128,  // 16px * 8 scale
  };

  const canvasSize = sizeMap[size];
  const scale = canvasSize / 16; // 16px is base sprite size

  // Initialize sprite renderer
  useEffect(() => {
    // Map avatar style to sprite file
    const spriteMap: Record<string, string> = {
      warrior: '/sprites/characters/warrior-sprites.png',
      mage: '/sprites/characters/mage-sprites.png',
      rogue: '/sprites/characters/rogue-sprites.png',
      healer: '/sprites/characters/healer-sprites.png',
      knight: '/sprites/characters/knight-sprites.png',
      archer: '/sprites/characters/archer-sprites.png',
    };

    // Use class-specific sprite or fall back to warrior
    const spritePath = spriteMap[avatarStyle] || spriteMap.warrior;

    const renderer = new SpriteRenderer(spritePath, () => {
      // Force state update when sprite loads to trigger re-render
      setSpriteRenderer(renderer);
      setCurrentFrame(0);
    });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [avatarStyle]);

  // Render sprite on canvas
  const renderSprite = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !spriteRenderer || !spriteRenderer.isLoaded()) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get current animation
    const anim = TINY16_ANIMATIONS[animation];
    const frame = anim.frames[frameIndex % anim.frames.length];

    // Center the sprite on canvas
    const x = (canvas.width - 16 * scale) / 2;
    const y = (canvas.height - 16 * scale) / 2;

    // Draw sprite
    spriteRenderer.drawFrame(ctx, frame, x, y, scale);
  };

  // Animation loop
  useEffect(() => {
    if (!spriteRenderer || !spriteRenderer.isLoaded()) return;

    const anim = TINY16_ANIMATIONS[animation];
    const frameDelay = 1000 / anim.frameRate; // ms per frame
    let lastFrameTime = Date.now();
    let frameIndex = 0;

    // Initial render
    renderSprite(frameIndex);

    const animate = () => {
      const now = Date.now();
      const elapsed = now - lastFrameTime;

      if (elapsed >= frameDelay) {
        frameIndex = (frameIndex + 1) % anim.frames.length;
        renderSprite(frameIndex);
        lastFrameTime = now;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animation, spriteRenderer, scale, currentFrame]);

  const motionVariants = {
    idle: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    celebrate: {
      y: [0, -15, 0],
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    dance: {
      rotate: [0, -5, 5, -5, 5, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    jump: {
      y: [0, -30, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  // Pixel sparkles for celebration
  const sparkles = animation === 'celebrate' ? (
    <>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400"
          style={{
            boxShadow: '0 0 4px #fbbf24',
            imageRendering: 'pixelated',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            x: [0, (Math.random() - 0.5) * 60],
            y: [0, (Math.random() - 0.5) * 60],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </>
  ) : null;

  return (
    <div className="relative inline-block">
      {sparkles}
      <motion.div
        variants={motionVariants}
        animate={animation}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="cursor-pointer"
      >
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          style={{
            imageRendering: 'pixelated',
            imageRendering: '-moz-crisp-edges',
            imageRendering: 'crisp-edges',
            background: 'transparent',
          }}
          className="select-none"
        />
      </motion.div>

      {/* Pixel art level badge */}
      <motion.div
        className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-500 text-gray-900 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-yellow-200"
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '10px',
          textShadow: '1px 1px 0px rgba(0,0,0,0.3)',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, delay: 0.2 }}
      >
        {level}
      </motion.div>
    </div>
  );
}

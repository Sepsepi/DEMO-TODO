// Sprite rendering utilities for pixel art
export interface SpriteFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpriteAnimation {
  frames: SpriteFrame[];
  frameRate: number; // frames per second
  loop: boolean;
}

export class SpriteRenderer {
  private image: HTMLImageElement | null = null;
  private loaded = false;
  private onLoadCallback?: () => void;

  constructor(imagePath: string, onLoad?: () => void) {
    this.onLoadCallback = onLoad;
    this.loadImage(imagePath);
  }

  private loadImage(path: string) {
    this.image = new Image();
    this.image.onload = () => {
      this.loaded = true;
      if (this.onLoadCallback) {
        this.onLoadCallback();
      }
    };
    this.image.src = path;
  }

  isLoaded(): boolean {
    return this.loaded;
  }

  drawFrame(
    ctx: CanvasRenderingContext2D,
    frame: SpriteFrame,
    x: number,
    y: number,
    scale: number = 1
  ) {
    if (!this.loaded || !this.image) return;

    ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
    ctx.drawImage(
      this.image,
      frame.x,
      frame.y,
      frame.width,
      frame.height,
      x,
      y,
      frame.width * scale,
      frame.height * scale
    );
  }
}

// Tiny16 character sprite layout (16x16 per frame)
// Row 0: Down (idle, walk1, walk2)
// Row 1: Up (idle, walk1, walk2)
// Row 2: Right (idle, walk1, walk2)
// Row 3: Left (idle, walk1, walk2)
// Row 4: Attack poses
export const TINY16_FRAMES = {
  // Idle poses
  idle_down: { x: 0, y: 0, width: 16, height: 16 },
  idle_up: { x: 0, y: 16, width: 16, height: 16 },
  idle_right: { x: 0, y: 32, width: 16, height: 16 },
  idle_left: { x: 0, y: 48, width: 16, height: 16 },

  // Walk animations (down)
  walk_down_1: { x: 16, y: 0, width: 16, height: 16 },
  walk_down_2: { x: 32, y: 0, width: 16, height: 16 },

  // Walk animations (up)
  walk_up_1: { x: 16, y: 16, width: 16, height: 16 },
  walk_up_2: { x: 32, y: 16, width: 16, height: 16 },

  // Walk animations (right)
  walk_right_1: { x: 16, y: 32, width: 16, height: 16 },
  walk_right_2: { x: 32, y: 32, width: 16, height: 16 },

  // Walk animations (left)
  walk_left_1: { x: 16, y: 48, width: 16, height: 16 },
  walk_left_2: { x: 32, y: 48, width: 16, height: 16 },

  // Attack poses
  attack_down: { x: 48, y: 0, width: 16, height: 16 },
  attack_up: { x: 48, y: 16, width: 16, height: 16 },
  attack_right: { x: 48, y: 32, width: 16, height: 16 },
  attack_left: { x: 48, y: 48, width: 16, height: 16 },
};

// LPC character sprite layout (64x64 per frame, 13 cols x 21 rows)
// Walkcycle animation is in rows 8-11 (down, left, right, up)
export const LPC_FRAMES = {
  // Idle poses (first frame of each walk direction)
  idle_down: { x: 0, y: 512, width: 64, height: 64 }, // Row 8
  idle_left: { x: 0, y: 576, width: 64, height: 64 }, // Row 9
  idle_right: { x: 0, y: 640, width: 64, height: 64 }, // Row 10
  idle_up: { x: 0, y: 704, width: 64, height: 64 }, // Row 11

  // Walk animations (down) - Row 8
  walk_down_1: { x: 64, y: 512, width: 64, height: 64 },
  walk_down_2: { x: 128, y: 512, width: 64, height: 64 },
  walk_down_3: { x: 192, y: 512, width: 64, height: 64 },
  walk_down_4: { x: 256, y: 512, width: 64, height: 64 },

  // Walk animations (left) - Row 9
  walk_left_1: { x: 64, y: 576, width: 64, height: 64 },
  walk_left_2: { x: 128, y: 576, width: 64, height: 64 },
  walk_left_3: { x: 192, y: 576, width: 64, height: 64 },
  walk_left_4: { x: 256, y: 576, width: 64, height: 64 },

  // Walk animations (right) - Row 10
  walk_right_1: { x: 64, y: 640, width: 64, height: 64 },
  walk_right_2: { x: 128, y: 640, width: 64, height: 64 },
  walk_right_3: { x: 192, y: 640, width: 64, height: 64 },
  walk_right_4: { x: 256, y: 640, width: 64, height: 64 },

  // Walk animations (up) - Row 11
  walk_up_1: { x: 64, y: 704, width: 64, height: 64 },
  walk_up_2: { x: 128, y: 704, width: 64, height: 64 },
  walk_up_3: { x: 192, y: 704, width: 64, height: 64 },
  walk_up_4: { x: 256, y: 704, width: 64, height: 64 },

  // Attack poses (slash animation - rows 12-15)
  attack_down: { x: 0, y: 768, width: 64, height: 64 },
  attack_left: { x: 0, y: 832, width: 64, height: 64 },
  attack_right: { x: 0, y: 896, width: 64, height: 64 },
  attack_up: { x: 0, y: 960, width: 64, height: 64 },
};

// LPC Animations
export const LPC_ANIMATIONS = {
  idle: {
    frames: [LPC_FRAMES.idle_down],
    frameRate: 1,
    loop: true,
  },
  celebrate: {
    frames: [
      LPC_FRAMES.walk_down_1,
      LPC_FRAMES.walk_down_2,
      LPC_FRAMES.walk_down_3,
      LPC_FRAMES.walk_down_4,
      LPC_FRAMES.attack_down,
    ],
    frameRate: 8,
    loop: true,
  },
  dance: {
    frames: [
      LPC_FRAMES.walk_left_1,
      LPC_FRAMES.walk_right_1,
      LPC_FRAMES.walk_left_2,
      LPC_FRAMES.walk_right_2,
    ],
    frameRate: 6,
    loop: true,
  },
  jump: {
    frames: [
      LPC_FRAMES.idle_down,
      LPC_FRAMES.walk_down_1,
      LPC_FRAMES.attack_down,
      LPC_FRAMES.walk_down_1,
    ],
    frameRate: 10,
    loop: true,
  },
};

// Tiny16 Animations
export const TINY16_ANIMATIONS = {
  idle: {
    frames: [TINY16_FRAMES.idle_down],
    frameRate: 1,
    loop: true,
  },
  celebrate: {
    frames: [
      TINY16_FRAMES.walk_down_1,
      TINY16_FRAMES.walk_down_2,
      TINY16_FRAMES.attack_down,
    ],
    frameRate: 8,
    loop: true,
  },
  dance: {
    frames: [
      TINY16_FRAMES.walk_left_1,
      TINY16_FRAMES.walk_right_1,
      TINY16_FRAMES.walk_left_2,
      TINY16_FRAMES.walk_right_2,
    ],
    frameRate: 6,
    loop: true,
  },
  jump: {
    frames: [
      TINY16_FRAMES.idle_down,
      TINY16_FRAMES.walk_down_1,
      TINY16_FRAMES.attack_down,
      TINY16_FRAMES.walk_down_1,
    ],
    frameRate: 10,
    loop: true,
  },
};

// Default to LPC animations for class sprites
export const ANIMATIONS = LPC_ANIMATIONS;

// Icon sprite positions (24x24 icons from inventory-icons.png)
export const ICON_FRAMES = {
  sword: { x: 0, y: 0, width: 24, height: 24 },
  dagger: { x: 24, y: 0, width: 24, height: 24 },
  potion_red: { x: 48, y: 0, width: 24, height: 24 },
  potion_blue: { x: 72, y: 0, width: 24, height: 24 },
  shield: { x: 96, y: 0, width: 24, height: 24 },
  helmet: { x: 120, y: 0, width: 24, height: 24 },
  key: { x: 144, y: 0, width: 24, height: 24 },
  coin: { x: 168, y: 0, width: 24, height: 24 },
  chest: { x: 192, y: 0, width: 24, height: 24 },
  crystal: { x: 216, y: 0, width: 24, height: 24 },
};

# TodoBozo

A gamified task manager with a retro RPG aesthetic. Level up by completing tasks, unlock character classes, and customize your pixel art avatar.

## Features

- **Gamified Quests** - Earn XP by completing tasks (10/20/30 XP based on difficulty)
- **Level Progression** - Level up every 100 XP
- **Character Classes** - Unlock 6 unique classes: Warrior, Mage, Rogue, Healer, Knight, Archer
- **Pixel Art Avatars** - Animated 16x16 character sprites with class-specific colors
- **Customization** - Unlock colors and accessories as you level up
- **Streak Tracking** - Build daily completion streaks
- **Dark Retro Theme** - Habitica-inspired purple/pink gradient design with pixel fonts
- **Custom Date Picker** - Fully styled calendar matching the retro RPG theme
- **Popup Previews** - Hover over locked items to see what you'll unlock

## Tech Stack

- Next.js 15 (App Router, Turbopack)
- React 19
- TypeScript
- Supabase (Auth & Database)
- Tailwind CSS v4
- Framer Motion
- Lucide React Icons

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**

   Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3001](http://localhost:3001)

## Deployment

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete deployment instructions.

## Character System

- **Warrior** (Lv 1) - Red/Orange theme
- **Mage** (Lv 3) - Purple/Blue theme
- **Rogue** (Lv 5) - Dark Green theme
- **Healer** (Lv 7) - Bright Green theme
- **Knight** (Lv 10) - Gold/Yellow theme
- **Archer** (Lv 12) - Cyan/Teal theme

Each class has unique colored sprite animations generated from the base Tiny16 sprite sheet.

## License

MIT

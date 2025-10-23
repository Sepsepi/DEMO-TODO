# Journal.md

## I Ship, Therefore I Am

Stop, what a cool job post.

So once I saw it, I was just thinking about some ideas to be "different". I asked my Claude about some cool websites to get cool thoughts for this. It came up with 2-3 good ones - one of them was https://habitica.com. I liked the idea and overall implementing some random cool stuff for this.

So then I asked my Claude app to give me a prompt to build the base. I copied your job post into the Claude (I KNOW) and this was the prompt:

### Step 1: Setup
- Create Next.js app with TypeScript
- Install dependencies: `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`, `framer-motion`, `lucide-react`, `date-fns`, `sonner` (for toasts)
- Setup Supabase project and get API keys
- Configure environment variables
- Setup Tailwind config with custom colors

### Step 2: Supabase Configuration
- Create `users` and `tasks` tables in Supabase
- Enable RLS policies:
  - Users can only read/update their own user record
  - Users can only CRUD their own tasks
- Setup Supabase client in `/lib/supabase.ts`

### Step 3: Authentication
- Create auth context/provider
- Build login page with form
- Build signup page with form
- Implement protected route middleware
- Add logout functionality

### Step 4: Dashboard & Task Management
- Create dashboard layout with sidebar
- Build `TaskForm` component (create/edit)
- Build `TaskList` component (displays all tasks)
- Build `TaskItem` component (individual task with actions)
- Implement task CRUD operations
- Add filters (all, active, completed)
- Add sorting options

### Step 5: Gamification
- Create `XPBar` component showing progress
- Create `LevelDisplay` component
- Implement XP calculation logic
- Update user XP/level when task completed
- Add streak tracking logic
- Create celebration animation when leveling up

### Step 6: Polish
- Add loading states
- Add error boundaries
- Implement toast notifications
- Add empty states
- Add animations (task completion, level up)
- Optimize for mobile
- Test dark mode

## What Happened Next

I got back to my Claude Code Max CLI with the prompt and it started working on it. Once it finished, I configured the Supabase and Vercel.

Once pushed, I asked Claude Code to use Playwright MCP to go search through the web for game assets - starting with https://itch.io - and fully customize all the components and features. Give level-based progression with preview on locked cosmetics, try to follow as much as possible the dark RPG retro style on every page.

Again, once it found all the assets, use Playwright MCP itself to test every feature, take screenshots, and be sensitive with the results. It's a fully functioning professional website, so no flaws should be there.

And there were a few errors like middlewares and assets and animations not loading properly. So overall it took us (Claude Code and me) an hour and a half and 6-7 prompts.

Overall I use Ai heavily on basically every part, nowadays specially its even easier since you can setup custom mcp server for specific use cases to make your coder work with even less issues 

## What Got Built

- Full auth system (signup/login)
- Task CRUD with difficulty levels (Easy/Medium/Hard = 10/20/30 XP)
- Level progression (100 XP per level)
- 6 unlockable character classes (Warrior, Mage, Rogue, Healer, Knight, Archer)
- Pixel art avatars with animations
- Color and accessory customization
- Streak tracking
- Custom retro RPG-styled date picker
- Hover previews for locked items
- Dark purple/pink gradient theme (Habitica vibes)
- Fully responsive
- Deployed on Vercel with Supabase backend

## Stack

Next.js 15 (App Router, Turbopack) / React 19 / TypeScript / Supabase / Tailwind CSS v4 / Framer Motion / Vercel

## Tools That Made This Fast

- Claude Code CLI main AI pair programmer
- Playwright MCP automated testing & asset discovery
- Context7 MCP relevant code context automatically and shows how sprites and assets can actually get used properly

Hope you find it cool.

Have a good one.

---

**Live Demo:** https://todobozo.vercel.app
**GitHub Repo:** https://github.com/Sepsepi/DEMO-TODO

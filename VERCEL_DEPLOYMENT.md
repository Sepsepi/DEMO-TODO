# Deploying TodoBozo to Vercel

## Prerequisites
1. A GitHub account
2. A Vercel account (sign up at https://vercel.com)
3. Your Supabase project credentials

## Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - TodoBozo gamified task manager"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/todobozo.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository (TodoBozo)
4. Vercel will auto-detect Next.js settings

## Step 3: Configure Environment Variables

In Vercel project settings, add these environment variables:

### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Where to find these:
1. Go to your Supabase project dashboard
2. Click "Settings" → "API"
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Your app will be live at: `https://your-project.vercel.app`

## Step 5: Configure Supabase Redirect URLs

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to **Site URL** and **Redirect URLs**:
   ```
   https://your-project.vercel.app
   https://your-project.vercel.app/auth/callback
   ```

## That's it! 🎉

Your TodoBozo app is now live on Vercel!

## Automatic Deployments

Every time you push to your `main` branch on GitHub, Vercel will automatically redeploy your app.

## Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

## Troubleshooting

### Build Errors
- Check build logs in Vercel dashboard
- Make sure all environment variables are set correctly

### Authentication Not Working
- Verify Supabase redirect URLs include your Vercel domain
- Check that environment variables are correctly set

### Need Help?
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs

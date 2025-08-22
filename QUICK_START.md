# 🚀 Quick Start - Deploy to Vercel in 5 Minutes

This guide will get your secure-ai-webui deployed to Vercel quickly.

## ⚡ Super Quick Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin develop
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your `secure-ai-webui` repository
4. Click "Import"

### 3. Set Environment Variables
In your Vercel project settings, add these variables:

```bash
NEXT_PUBLIC_API_URL=https://secure-ai-production.up.railway.app
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=https://your-project.vercel.app
```

**Generate a secret**: Use any random string generator or run `openssl rand -base64 32`

### 4. Deploy!
Click "Deploy" and wait for the build to complete.

## 🔧 Manual Deployment (if you prefer)

### Install Vercel CLI
```bash
npm install -g vercel
```

### Link Project
```bash
vercel link
```

### Set Environment Variables
```bash
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
```

### Deploy
```bash
vercel --prod
```

## ✅ Verify Deployment

1. Visit your deployed URL
2. Navigate to the dashboard
3. Use the API Test component to verify backend connectivity
4. Test authentication and file uploads

## 🆘 Common Issues

**Build fails**: Check that all dependencies are installed
**Environment variables not loading**: Verify they're set in Vercel dashboard
**API connection fails**: Ensure backend is running and accessible

## 📚 Need More Help?

- **Detailed Setup**: See `PRODUCTION_SETUP.md`
- **Deployment Checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Environment Setup**: See `ENVIRONMENT_SETUP.md`

## 🎯 What You Get

- ✅ Modern Next.js frontend
- ✅ Secure authentication with NextAuth
- ✅ API integration with your secure-ai backend
- ✅ Document upload and AI chat
- ✅ Production-optimized build
- ✅ Automatic deployments from GitHub
- ✅ Global CDN and edge functions
- ✅ SSL certificates included

---

**Ready to deploy?** Follow the super quick deployment steps above! 
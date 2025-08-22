# Production Setup for Vercel Deployment

This guide will help you deploy the secure-ai-webui to Vercel with production-ready configuration.

## 1. Vercel Project Setup

### Create New Project
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository: `secure-ai-webui`
4. Select the repository and click "Import"

### Project Configuration
- **Framework Preset**: Next.js (should auto-detect)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

## 2. Environment Variables

Set these environment variables in your Vercel project:

### Required Variables
```bash
# Backend API Configuration
NEXT_PUBLIC_API_URL=https://secure-ai-production.up.railway.app

# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-key-here

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### How to Set Environment Variables
1. In your Vercel project dashboard, go to "Settings" → "Environment Variables"
2. Add each variable with the exact names above
3. Set the environment to "Production" (and optionally "Preview" for staging)
4. Click "Save"

## 3. Domain Configuration

### Custom Domain (Optional)
1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Update `NEXTAUTH_URL` to match your custom domain
4. Configure DNS records as instructed by Vercel

## 4. Build Optimization

The project is already configured with:
- ✅ SWC minification
- ✅ Image optimization
- ✅ Package import optimization
- ✅ Security headers
- ✅ Compression enabled

## 5. Deployment

### First Deployment
1. Push your code to the `main` branch
2. Vercel will automatically build and deploy
3. Monitor the build logs for any issues

### Automatic Deployments
- **Production**: Deploys from `main` branch
- **Preview**: Deploys from pull requests
- **Development**: Deploys from `develop` branch

## 6. Post-Deployment Verification

### Health Check
1. Visit your deployed URL
2. Navigate to the dashboard
3. Use the API Test component to verify backend connectivity
4. Check that all features work correctly

### Performance Monitoring
- Vercel Analytics (if enabled)
- Core Web Vitals monitoring
- Function execution times

## 7. Production Checklist

- [ ] Environment variables set correctly
- [ ] Backend API accessible from Vercel
- [ ] Authentication working (NextAuth)
- [ ] File uploads functional
- [ ] AI chat working
- [ ] Error handling in place
- [ ] Security headers active
- [ ] Performance optimized

## 8. Troubleshooting

### Common Issues

**Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

**Environment Variable Issues**
- Ensure all required variables are set
- Check variable names match exactly
- Verify `NEXTAUTH_URL` matches your domain

**API Connection Issues**
- Verify backend is accessible from Vercel
- Check CORS configuration on backend
- Test API endpoints directly

**Authentication Issues**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` configuration
- Ensure OAuth providers are configured

## 9. Monitoring & Maintenance

### Regular Checks
- Monitor Vercel function execution times
- Check for failed deployments
- Review performance metrics
- Monitor error rates

### Updates
- Keep dependencies updated
- Monitor security advisories
- Test new features in preview deployments

## 10. Scaling Considerations

### Performance
- Vercel automatically scales based on traffic
- Edge functions for global performance
- CDN for static assets

### Cost Optimization
- Monitor function execution times
- Use preview deployments for testing
- Optimize bundle sizes

## Support

For deployment issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test locally with production settings
4. Check Vercel documentation
5. Contact Vercel support if needed 
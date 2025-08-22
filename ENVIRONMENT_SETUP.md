# Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Backend API Configuration
NEXT_PUBLIC_API_URL=https://secure-ai-production.up.railway.app

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:4000

# Google OAuth (optional - for Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Required Variables

- `NEXT_PUBLIC_API_URL`: The URL of your secure-ai backend (Railway deployment)
- `NEXTAUTH_SECRET`: A random string for JWT encryption
- `NEXTAUTH_URL`: Your frontend URL (localhost:4000 for development)

## Optional Variables

- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: For Google OAuth authentication

## Getting Started

1. Copy the example above to `.env.local`
2. Replace placeholder values with your actual configuration
3. Restart your development server after making changes

## Security Notes

- Never commit `.env.local` to version control
- Use strong, unique values for secrets
- The `NEXT_PUBLIC_` prefix makes variables available in the browser 
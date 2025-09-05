# Bishwas Community Platform

**Author: Bishwas Khanal**

This is a clean version of the community platform containing only files and code authored by Bishwas Khanal.

## Features

- Community Management System
- User Authentication & Profiles  
- Direct Messaging
- Post Creation & Management
- Admin Dashboard
- Mobile-Responsive Design
- Real-time Notifications

## Tech Stack

- **Framework:** Next.js 15.2.4
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Icons:** Lucide React

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
bishwas/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication pages
│   ├── communities/       # Community listing
│   ├── community/         # Individual community pages
│   ├── dashboard/         # User dashboard
│   ├── messages/          # Direct messaging
│   └── ...               # Other app pages
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── ...               # Feature components
├── contexts/             # React contexts
├── hooks/               # Custom hooks
├── lib/                 # Utilities
└── public/              # Static assets
```

## Clean Code Guarantee

✅ All files in this directory were authored by Bishwas Khanal  
✅ No code from other contributors included  
✅ Git history verified for authorship  
✅ Standalone runnable project  

## Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Code linting

---

**Created by:** Bishwas Khanal  
**Last Updated:** September 5, 2025
   ```bash
   git clone <your-repo-url>
   cd secure-ai-webui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp ENVIRONMENT_SETUP.md .env.local
   # Edit .env.local with your actual values
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:4000](http://localhost:4000)

## Environment Configuration

Create a `.env.local` file with the following variables:

```bash
# Backend API Configuration
NEXT_PUBLIC_API_URL=https://secure-ai-production.up.railway.app

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:4000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## API Integration

The frontend is configured to work with the Secure AI backend deployed on Railway. The API service layer provides:

- **Document Upload**: Upload PDFs and images with questions
- **AI Chat**: Stream chat with AI using document context
- **Document Management**: List, retrieve, and summarize documents
- **Health Checks**: Monitor backend connectivity

### Testing the API

Use the `ApiTest` component on the dashboard to:
- Check backend health
- Test document uploads
- Verify AI chat functionality
- Debug API connections

## Project Structure

```
secure-ai-webui/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   └── ...
├── components/            # React components
│   ├── atoms/            # Basic UI components
│   ├── molecules/        # Compound components
│   ├── features/         # Feature-specific components
│   └── ui/               # UI component library
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── api.ts            # API service layer
│   ├── auth.ts           # Authentication configuration
│   └── config.ts         # App configuration
├── contexts/              # React contexts
└── types/                 # TypeScript type definitions
```

## Development

### Available Scripts

- `npm run dev` - Start development server on port 4000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **API Integration**: Use the `useApi` hook for backend communication
2. **Components**: Follow the atomic design pattern in the components directory
3. **Styling**: Use Tailwind CSS classes and maintain consistency
4. **Types**: Define TypeScript interfaces in the types directory

## Backend Connection

The frontend connects to the Secure AI backend at:
- **Production**: `https://secure-ai-production.up.railway.app`
- **Development**: Configure via `NEXT_PUBLIC_API_URL`

### API Endpoints

- `POST /upload-and-ask` - Upload document and ask question
- `POST /vllm-stream-chat` - Stream chat with AI
- `GET /health` - Backend health check
- `GET /documents` - List documents
- `POST /summarize` - Summarize documents

## Contributing

1. Create a feature branch from `develop`
2. Make your changes following the project structure
3. Test thoroughly with the API test component
4. Submit a pull request to `develop`

## Support

For issues or questions:
1. Check the API test component for connectivity issues
2. Verify environment variables are set correctly
3. Ensure the backend is running and accessible
4. Check the browser console for error messages

## License

This project is part of the Secure AI ecosystem. 
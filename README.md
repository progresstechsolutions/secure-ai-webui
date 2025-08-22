# Secure AI WebUI

A modern Next.js frontend for the Secure AI backend, providing document analysis, AI chat, and secure document management.

## Features

- 🔐 **Secure Authentication** - NextAuth.js with Google OAuth and credentials
- 📄 **Document Upload & Analysis** - Upload PDFs and images for AI analysis
- 💬 **AI Chat Interface** - Stream chat with AI using document context
- 📊 **Document Management** - Organize and search through uploaded documents
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI components
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: NextAuth.js
- **State Management**: React Hooks
- **API**: RESTful API service layer

## Prerequisites

- Node.js 18+ 
- npm or pnpm
- Access to the Secure AI backend (Railway deployment)

## Quick Start

1. **Clone the repository**
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
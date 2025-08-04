# Caregiver App

A mobile-first, caregiver-friendly application designed for parents of children with rare conditions. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Home Dashboard**: Daily overview with symptom status, nutrition plans, alerts, and growth tracking
- **Mobile-First Design**: Optimized for caregivers on the go
- **Accessible UI**: Designed with accessibility in mind for all users
- **Clean, Scalable Components**: Modular architecture for easy maintenance and expansion

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (not recommended)

## Project Structure

```
src/
├── components/
│   └── HomeDashboard.tsx    # Main dashboard component
├── App.tsx                  # Root application component
├── index.tsx               # Application entry point
└── index.css               # Global styles and Tailwind imports
```

## Design System

The app uses a consistent design system with:
- **Colors**: Indigo primary palette with semantic colors for success, warning, and danger states
- **Typography**: Inter font family for excellent readability
- **Spacing**: Consistent spacing scale using Tailwind's spacing utilities
- **Components**: Reusable card and button components with consistent styling

## Accessibility Features

- Semantic HTML structure
- Proper ARIA labels and roles
- High contrast color combinations
- Focus management for keyboard navigation
- Screen reader friendly content structure

## Next Steps

This is the foundation for the caregiver app. Future features will include:
- Symptom logging and tracking
- Nutrition planning and monitoring
- Care team communication
- Growth and development tracking
- AI-powered insights and recommendations 
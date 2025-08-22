#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Optimizing build for production...');

// Check for required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn('⚠️  Warning: Missing environment variables:');
  missingVars.forEach(varName => console.warn(`   - ${varName}`));
  console.warn('   These should be set in your Vercel project settings.');
} else {
  console.log('✅ All required environment variables are set');
}

// Create production-ready .env.local if it doesn't exist
const envLocalPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envLocalPath)) {
  console.log('📝 Creating .env.local template...');
  const envTemplate = `# Production Environment Variables
# Update these values for your deployment

# Backend API Configuration
NEXT_PUBLIC_API_URL=${process.env.NEXT_PUBLIC_API_URL || 'https://secure-ai-production.up.railway.app'}

# NextAuth Configuration
NEXTAUTH_SECRET=${process.env.NEXTAUTH_SECRET || 'your-production-secret-key-here'}
NEXTAUTH_URL=${process.env.NEXTAUTH_URL || 'https://your-domain.vercel.app'}

# Google OAuth (optional)
GOOGLE_CLIENT_ID=${process.env.GOOGLE_CLIENT_ID || 'your-google-client-id'}
GOOGLE_CLIENT_SECRET=${process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret'}
`;
  
  fs.writeFileSync(envLocalPath, envTemplate);
  console.log('✅ Created .env.local template');
}

// Check package.json for production readiness
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Check for required dependencies
  const requiredDeps = ['next', 'react', 'react-dom', 'next-auth'];
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
  
  if (missingDeps.length > 0) {
    console.error('❌ Missing required dependencies:', missingDeps.join(', '));
    process.exit(1);
  }
  
  console.log('✅ All required dependencies are present');
}

// Check for critical files
const criticalFiles = [
  'next.config.mjs',
  'tailwind.config.ts',
  'tsconfig.json',
  'vercel.json'
];

criticalFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} found`);
  } else {
    console.warn(`⚠️  ${file} not found`);
  }
});

console.log('\n🎯 Production optimization complete!');
console.log('\nNext steps:');
console.log('1. Push your code to GitHub');
console.log('2. Import to Vercel as a new project');
console.log('3. Set environment variables in Vercel dashboard');
console.log('4. Deploy!');
console.log('\nFor detailed instructions, see PRODUCTION_SETUP.md'); 
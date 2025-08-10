const fs = require('fs');
const path = require('path');

// Function to remove toast imports and usage from a file
function removeToastFromFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove useToast import
    content = content.replace(/import\s*{\s*useToast\s*}\s*from\s*["']@\/hooks\/use-toast["']\s*\n?/g, '');
    
    // Remove toast destructuring
    content = content.replace(/const\s*{\s*toast\s*}\s*=\s*useToast\(\)\s*\n?/g, '');
    
    // Remove toast function calls (multi-line)
    content = content.replace(/\s*toast\s*\(\s*{[\s\S]*?}\s*\)\s*\n?/g, '');
    
    // Remove toast from dependency arrays
    content = content.replace(/(}, \[.*?),\s*toast(.*?\])/g, '$1$2');
    content = content.replace(/(}, \[)toast,?\s*(.*?\])/g, '$1$2');
    content = content.replace(/(}, \[.*?),\s*toast\s*\]/g, '$1]');
    
    // Clean up empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Cleaned toast from: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// List of files to clean
const filesToClean = [
  'components/community-home.tsx',
  'components/post-detail.tsx',
  'components/dm-conversation.tsx',
  'components/create-post-modal.tsx',
  'components/create-community-modal.tsx'
];

// Process each file
filesToClean.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    removeToastFromFile(fullPath);
  } else {
    console.log(`⚠️  File not found: ${fullPath}`);
  }
});

console.log('🎉 Toast removal completed!');

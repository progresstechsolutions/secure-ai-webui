const fs = require('fs');
const path = require('path');

// Function to remove toast from community-management.tsx
function removeToastFromCommunityManagement() {
  const filePath = path.join(__dirname, 'components/community-management.tsx');
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove toast import
    content = content.replace(/import\s*{\s*toast\s*}\s*from\s*["']@\/hooks\/use-toast["']\s*\n?/g, '');
    
    // Remove toast function calls (multi-line)
    content = content.replace(/\s*toast\s*\(\s*{[\s\S]*?}\s*\)\s*\n?/g, '');
    
    // Clean up empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Cleaned toast from: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

removeToastFromCommunityManagement();
console.log('🎉 Toast removal completed!');

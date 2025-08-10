const fs = require('fs');

function removeToastCalls(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove toast calls with proper syntax handling
  // Pattern: toast({ ... }) including multiline
  content = content.replace(/\s*toast\s*\(\s*{\s*[\s\S]*?^\s*}\s*\)\s*$/gm, '');
  
  // Clean up any remaining empty lines
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Cleaned toast calls from: ${filePath}`);
}

removeToastCalls('components/dm-conversation.tsx');

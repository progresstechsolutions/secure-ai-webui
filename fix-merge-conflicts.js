const fs = require('fs');
const path = require('path');

console.log('🔧 Removing all merge conflict markers...');

// Get all TypeScript/TSX files
function getAllFiles(dir, extensions = ['.ts', '.tsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory() && !file.includes('node_modules')) {
      results = results.concat(getAllFiles(filePath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Fix merge conflicts in a file
function fixMergeConflictsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Remove all merge conflict markers and keep the origin/Bishwas version
    content = content.replace(/<<<<<<< HEAD[\s\S]*?=======\s*/g, '');
    content = content.replace(/>>>>>>> origin\/Bishwas\s*/g, '');
    
    // If content changed, write it back
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed merge conflicts: ${path.relative('.', filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
const files = getAllFiles('.');
let totalFixed = 0;

files.forEach(file => {
  if (fixMergeConflictsInFile(file)) {
    totalFixed++;
  }
});

console.log(`🎯 Total files with merge conflicts fixed: ${totalFixed}`);
console.log('✨ All merge conflict markers have been removed!'); 
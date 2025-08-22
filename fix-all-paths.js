const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all remaining / import paths...');

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

// Fix imports in a file
function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Calculate relative path to root
    const relativePathToRoot = path.relative(path.dirname(filePath), '.');
    const prefix = relativePathToRoot.replace(/\\/g, '/');
    
    // Fix all / imports to relative paths
    content = content.replace(/from "\/([^"]*)"/g, `from "${prefix}/$1"`);
    
    // If content changed, write it back
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${path.relative('.', filePath)}`);
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
  if (fixImportsInFile(file)) {
    totalFixed++;
  }
});

console.log(`🎯 Total files fixed: ${totalFixed}`);
console.log('✨ All / import paths have been converted to relative paths!'); 
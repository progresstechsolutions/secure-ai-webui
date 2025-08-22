# Fix all @/ import paths in the project
Write-Host "🔧 Fixing all @/ import paths..." -ForegroundColor Green

# Get all TypeScript/TSX files
$files = Get-ChildItem -Recurse -Include "*.ts", "*.tsx" | Where-Object { $_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*.d.ts" }

$totalFixed = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix @/components imports
    $content = $content -replace '@/components/ui/', '../components/ui/'
    $content = $content -replace '@/components/atoms/', '../components/atoms/'
    $content = $content -replace '@/components/molecules/', '../components/molecules/'
    $content = $content -replace '@/components/features/', '../components/features/'
    $content = $content -replace '@/components/layout/', '../components/layout/'
    $content = $content -replace '@/components/', '../components/'
    
    # Fix @/lib imports
    $content = $content -replace '@/lib/', '../lib/'
    
    # Fix @/hooks imports
    $content = $content -replace '@/hooks/', '../hooks/'
    
    # Fix @/contexts imports
    $content = $content -replace '@/contexts/', '../contexts/'
    
    # Fix @/types imports
    $content = $content -replace '@/types/', '../types/'
    
    # Fix @/app imports
    $content = $content -replace '@/app/', '../app/'
    
    # If content changed, write it back
    if ($content -ne $originalContent) {
        Set-Content $file.FullName $content
        $totalFixed++
        Write-Host "✅ Fixed: $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host "🎯 Total files fixed: $totalFixed" -ForegroundColor Green
Write-Host "✨ All @/ import paths have been converted to relative paths!" -ForegroundColor Green 
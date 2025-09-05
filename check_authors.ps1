# Script to check file authorship
$files = @(
    "components/community-home.tsx",
    "components/community-feed.tsx", 
    "components/community-management.tsx",
    "components/dm-conversation.tsx",
    "components/navigation.tsx",
    "components/global-header.tsx",
    "components/HealthBinderApp.tsx",
    "components/create-community-modal.tsx",
    "components/post-detail.tsx",
    "app/page.tsx",
    "app/communities/page.tsx",
    "app/community/[slug]/page.tsx",
    "app/community-admin/[communityId]/page.tsx",
    "hooks/use-api.ts",
    "lib/api-client.ts",
    "package.json",
    "postcss.config.js",
    "postcss.config.mjs"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "File: $file"
        $author = git log --pretty=format:"%an" -- $file | Select-Object -First 1
        Write-Host "Primary Author: $author"
        Write-Host "---"
    }
}

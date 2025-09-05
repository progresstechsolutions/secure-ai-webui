# File Organization Script by Author
# Based on git commit history analysis

# Create subfolders
New-Item -ItemType Directory -Force -Path "author-separation\bishwas\components"
New-Item -ItemType Directory -Force -Path "author-separation\bishwas\app"
New-Item -ItemType Directory -Force -Path "author-separation\bishwas\hooks"
New-Item -ItemType Directory -Force -Path "author-separation\bishwas\lib"
New-Item -ItemType Directory -Force -Path "author-separation\bishwas\ui-components"

New-Item -ItemType Directory -Force -Path "author-separation\abishek\components"
New-Item -ItemType Directory -Force -Path "author-separation\abishek\app"
New-Item -ItemType Directory -Force -Path "author-separation\abishek\hooks"
New-Item -ItemType Directory -Force -Path "author-separation\abishek\ui-components"
New-Item -ItemType Directory -Force -Path "author-separation\abishek\features"
New-Item -ItemType Directory -Force -Path "author-separation\abishek\contexts"
New-Item -ItemType Directory -Force -Path "author-separation\abishek\stories"

# Bishwas Files
$bishwasFiles = @(
    # Community Components
    "components\community-home.tsx",
    "components\community-feed.tsx",
    "components\community-management.tsx", 
    "components\dm-conversation.tsx",
    "components\create-community-modal.tsx",
    "components\create-post-modal.tsx",
    "components\post-detail.tsx",
    "components\global-header.tsx",
    "components\group-invitation-notifications.tsx",
    "components\notification-page.tsx",
    "components\page-layout.tsx",
    "components\theme-provider.tsx",
    
    # App Pages
    "app\page.tsx",
    "app\layout.tsx",
    "app\communities\page.tsx",
    "app\community\[slug]\page.tsx",
    "app\community-admin\[communityId]\page.tsx",
    "app\dashboard\page.tsx",
    "app\messages\page.tsx",
    "app\notifications\page.tsx",
    "app\settings\page.tsx",
    
    # Hooks & Lib
    "hooks\use-api.ts",
    "hooks\use-mobile.tsx",
    "hooks\use-profile-picture.ts",
    "hooks\use-socket.ts",
    "lib\api-client.ts",
    "lib\utils.ts",
    
    # UI Components (Bishwas authored)
    "components\ui\alert-dialog.tsx",
    "components\ui\alert.tsx",
    "components\ui\avatar.tsx",
    "components\ui\badge.tsx",
    "components\ui\button.tsx",
    "components\ui\card.tsx",
    "components\ui\checkbox.tsx",
    "components\ui\drawer.tsx",
    "components\ui\dropdown-menu.tsx",
    "components\ui\input.tsx",
    "components\ui\label.tsx",
    "components\ui\radio-group.tsx",
    "components\ui\select.tsx",
    "components\ui\separator.tsx",
    "components\ui\sheet.tsx",
    "components\ui\switch.tsx",
    "components\ui\tabs.tsx",
    "components\ui\tooltip.tsx",
    "components\ui\user-avatar.tsx",
    
    # Other files
    "components\community-home\constants.ts",
    "components\community-home\search-section.tsx",
    "components\community-home\utils.ts",
    "components\molecules\SearchBar\SearchBar.tsx",
    "contexts\notification-context.tsx",
    
    # Config files
    "next.config.js",
    "postcss.config.mjs",
    "tailwind.config.ts"
)

# Abishek Files  
$abishekFiles = @(
    # Core Components
    "components\HealthBinderApp.tsx",
    "components\child-selector.tsx",
    "components\document-hub.tsx",
    "components\document-list.tsx",
    "components\document-search.tsx",
    "components\document-upload.tsx",
    
    # App Pages
    "app\document-viewer\page.tsx",
    "app\upload\page.tsx",
    
    # Features
    "components\features\dashboard\DashboardTab.tsx",
    "components\features\document-hub\child-selector.tsx",
    "components\features\document-hub\document-hub.tsx",
    "components\features\document-hub\document-list.tsx",
    "components\features\document-hub\document-search.tsx",
    "components\features\document-hub\document-stats.tsx",
    "components\features\document-hub\document-upload.tsx",
    "components\features\document-viewer\AISummaryView.tsx",
    "components\features\document-viewer\DocumentTabs.tsx",
    "components\features\document-viewer\DocumentToolbar.tsx",
    "components\features\document-viewer\DocumentViewer.tsx",
    "components\features\document-viewer\HighlightPanel.tsx",
    "components\features\document-viewer\KeyHighlightsView.tsx",
    "components\features\document-viewer\RawDocumentView.tsx",
    "components\features\documents\AddTaggingModal.tsx",
    "components\features\documents\DeleteDocumentDialog.tsx",
    "components\features\documents\DocumentsTab.tsx",
    "components\features\documents\RecoverDocumentDialog.tsx",
    "components\features\documents\ShareModal.tsx",
    "components\features\documents\TagModal.tsx",
    "components\features\folders\FolderSidebar.tsx",
    "components\features\folders\MoveDocumentModal.tsx",
    "components\features\manage-children\AddEditChildModal.tsx",
    "components\features\manage-children\AvatarUploadModal.tsx",
    "components\features\manage-children\ChildStatsPanel.tsx",
    "components\features\manage-children\DeleteChildModal.tsx",
    "components\features\manage-children\InviteParentModal.tsx",
    "components\features\manage-children\ManageChildren.tsx",
    "components\features\upload\DocumentCameraCapture.tsx",
    "components\features\upload\DocumentCaptureModal.tsx",
    "components\features\upload\FilePreview.tsx",
    "components\features\upload\TagSuggestions.tsx",
    "components\features\upload\UploadProgress.tsx",
    "components\features\upload\UploadTab.tsx",
    
    # Atoms & Molecules
    "components\atoms\Avatar\Avatar.tsx",
    "components\atoms\Button\Button.tsx",
    "components\atoms\Checkbox\Checkbox.tsx",
    "components\atoms\Input\Input.tsx",
    "components\atoms\Radio\Radio.tsx",
    "components\atoms\Skeleton\Skeleton.tsx",
    "components\atoms\Tag\Tag.tsx",
    "components\molecules\ChildProfileCard\ChildProfileCard.tsx",
    "components\molecules\DocumentCard\DocumentCard.tsx",
    "components\molecules\LabeledInput\LabeledInput.tsx",
    
    # Layout
    "components\layout\HamburgerNavigation.tsx",
    "components\layout\Navigation.tsx",
    
    # UI Components (Abishek authored)
    "components\ui\accordion.tsx",
    "components\ui\aspect-ratio.tsx",
    "components\ui\breadcrumb.tsx",
    "components\ui\calendar.tsx",
    "components\ui\carousel.tsx",
    "components\ui\chart.tsx",
    "components\ui\collapsible.tsx",
    "components\ui\command.tsx",
    "components\ui\context-menu.tsx",
    "components\ui\CustomLogo.tsx",
    "components\ui\dialog.tsx",
    "components\ui\form.tsx",
    "components\ui\HealthBinderLogo.tsx",
    "components\ui\hover-card.tsx",
    "components\ui\input-otp.tsx",
    "components\ui\menubar.tsx",
    "components\ui\Modal.tsx",
    "components\ui\navigation-menu.tsx",
    "components\ui\pagination.tsx",
    "components\ui\popover.tsx",
    "components\ui\progress.tsx",
    "components\ui\resizable.tsx",
    "components\ui\scroll-area.tsx",
    "components\ui\sidebar.tsx",
    "components\ui\skeleton.tsx",
    "components\ui\slider.tsx",
    "components\ui\sonner.tsx",
    "components\ui\table.tsx",
    "components\ui\textarea.tsx",
    "components\ui\toast.tsx",
    "components\ui\toaster.tsx",
    "components\ui\toggle-group.tsx",
    "components\ui\toggle.tsx",
    "components\ui\use-mobile.tsx",
    "components\ui\use-toast.ts",
    
    # Contexts
    "contexts\auth-context.tsx",
    "contexts\child-profile-context.tsx",
    "contexts\document-context.tsx",
    
    # Hooks
    "hooks\use-toast.ts",
    "hooks\useAIAnalysis.ts",
    "hooks\useAISuggestions.ts",
    "hooks\useDocumentViewer.ts",
    "hooks\useDragAndDrop.ts",
    "hooks\useHighlights.ts",
    "hooks\useUpload.ts",
    
    # Stories
    "stories\atoms\Button.stories.tsx",
    "stories\atoms\Input.stories.tsx",
    "stories\features\DocumentUpload.stories.tsx",
    "stories\features\DocumentViewer.stories.tsx",
    "stories\features\ManageChildren.stories.tsx",
    "stories\molecules\DocumentCard.stories.tsx",
    "stories\molecules\LabeledInput.stories.tsx",
    
    # Config files
    ".storybook\main.js",
    ".storybook\preview.js",
    "postcss.config.js",
    "tailwind.config.js"
)

# Copy Bishwas files
foreach ($file in $bishwasFiles) {
    if (Test-Path $file) {
        $destination = $file -replace "^", "author-separation\bishwas\"
        $destinationDir = Split-Path $destination -Parent
        New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null
        Copy-Item $file $destination -Force
        Write-Host "Copied to Bishwas: $file"
    }
}

# Copy Abishek files
foreach ($file in $abishekFiles) {
    if (Test-Path $file) {
        $destination = $file -replace "^", "author-separation\abishek\"
        $destinationDir = Split-Path $destination -Parent
        New-Item -ItemType Directory -Force -Path $destinationDir | Out-Null
        Copy-Item $file $destination -Force
        Write-Host "Copied to Abishek: $file"
    }
}

Write-Host "`nFile organization complete!"
Write-Host "Bishwas files are in: author-separation\bishwas\"
Write-Host "Abishek files are in: author-separation\abishek\"

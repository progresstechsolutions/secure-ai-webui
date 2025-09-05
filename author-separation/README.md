# File Organization Summary by Author

This document outlines how the codebase has been organized into two folders based on git commit authorship analysis.

## Organization Structure

### `author-separation/bishwas/` - Bishwas Khanal's Contributions
**Primary Focus: Community Features & API Integration**

#### Key Components:
- **Community Features:**
  - `community-home.tsx` - Main community dashboard
  - `community-feed.tsx` - Community post feed
  - `community-management.tsx` - Community administration
  - `dm-conversation.tsx` - Direct messaging system
  - `create-community-modal.tsx` - Community creation
  - `create-post-modal.tsx` - Post creation
  - `post-detail.tsx` - Post detail view

- **Global Components:**
  - `global-header.tsx` - Application header
  - `page-layout.tsx` - Page layout wrapper
  - `theme-provider.tsx` - Theme management
  - `notification-page.tsx` - Notifications interface

#### App Pages:
- `app/page.tsx` - Landing page
- `app/layout.tsx` - Root layout
- `app/communities/page.tsx` - Communities listing
- `app/dashboard/page.tsx` - Main dashboard
- `app/messages/page.tsx` - Messages page
- `app/notifications/page.tsx` - Notifications page
- `app/settings/page.tsx` - Settings page

#### Hooks & Libraries:
- `hooks/use-api.ts` - API integration hooks
- `hooks/use-socket.ts` - Socket.IO integration
- `hooks/use-profile-picture.ts` - Profile picture management
- `lib/api-client.ts` - API client implementation
- `lib/utils.ts` - Utility functions

#### UI Components (Authored by Bishwas):
- Form elements: `button.tsx`, `input.tsx`, `checkbox.tsx`, `select.tsx`
- Layout: `card.tsx`, `dialog.tsx`, `sheet.tsx`, `tabs.tsx`
- Display: `avatar.tsx`, `badge.tsx`, `tooltip.tsx`, `user-avatar.tsx`

#### Configuration:
- `next.config.js` - Next.js configuration
- `postcss.config.mjs` - PostCSS configuration
- `tailwind.config.ts` - Tailwind configuration

---

### `author-separation/abishek/` - abishekPTS's Contributions  
**Primary Focus: Document Management & UI Components**

#### Key Components:
- **Document Management:**
  - `HealthBinderApp.tsx` - Main health binder application
  - `document-hub.tsx` - Document management hub
  - `document-upload.tsx` - File upload interface
  - `document-list.tsx` - Document listing
  - `document-search.tsx` - Document search functionality

- **Feature Modules:**
  - `features/document-viewer/` - Complete document viewing system
  - `features/document-hub/` - Document management features
  - `features/upload/` - Upload functionality
  - `features/manage-children/` - Child profile management
  - `features/folders/` - Folder organization

#### App Pages:
- `app/document-viewer/page.tsx` - Document viewer
- `app/upload/page.tsx` - Upload interface

#### Component Architecture:
- **Atoms:** Basic UI building blocks (`Avatar`, `Button`, `Input`, etc.)
- **Molecules:** Composed components (`DocumentCard`, `LabeledInput`, etc.)
- **Layout:** Navigation and layout components

#### Extensive UI Library:
- Advanced components: `accordion.tsx`, `calendar.tsx`, `chart.tsx`
- Form elements: `form.tsx`, `input-otp.tsx`, `textarea.tsx`
- Navigation: `navigation-menu.tsx`, `sidebar.tsx`
- Feedback: `toast.tsx`, `progress.tsx`, `skeleton.tsx`

#### Hooks & Utilities:
- Document-specific hooks: `useDocumentViewer.ts`, `useUpload.ts`
- AI integration: `useAIAnalysis.ts`, `useAISuggestions.ts`
- UI utilities: `useDragAndDrop.ts`, `useHighlights.ts`

#### Development Tools:
- **Storybook:** Complete story configuration and component stories
- **Contexts:** Authentication, document, and child profile contexts

#### Configuration:
- `.storybook/` - Storybook configuration
- `postcss.config.js` - PostCSS configuration
- `tailwind.config.js` - Tailwind configuration

---

## File Distribution Analysis

### Bishwas Khanal (Community & API Focus):
- **Total Files:** ~50 files
- **Primary Areas:** Community features, API integration, core app pages
- **Expertise:** React hooks, API client development, community features

### abishekPTS (Document & UI Focus):
- **Total Files:** ~120+ files  
- **Primary Areas:** Document management, UI component library, upload systems
- **Expertise:** Component architecture, document processing, UI/UX design

---

## Usage Instructions

### For Bishwas:
```bash
cd author-separation/bishwas/
# Contains all community-related features and API integration
# Main focus areas: community management, messaging, API connections
```

### For Abishek:
```bash
cd author-separation/abishek/
# Contains all document management and UI component systems
# Main focus areas: document processing, upload features, component library
```

---

## Notes

1. **File Separation:** Based on git commit history analysis using `git log --pretty=format:"%an"`
2. **Overlap Handling:** Some files may have contributions from both authors - primary author was determined by most recent significant commits
3. **Shared Dependencies:** Both folders may reference shared types and configurations
4. **Component Interdependencies:** Some components in different folders may depend on each other

---

## Generated Files

- `organize_by_author.ps1` - PowerShell script used for file organization
- `check_authors.ps1` - PowerShell script for authorship analysis

This organization allows each developer to focus on their specific contribution areas while maintaining the overall application structure.

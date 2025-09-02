# Hard Rules for AI

## Token Usage
- NEVER use hex colors (#000000) - use tokens only
- NEVER use px values - use spacing tokens only
- NEVER use raw RGB/HSL values
- ALL colors must come from /vibe/theme.ts
- ALL spacing must use spacing tokens

## Component Standards
- Every interactive element needs focus-visible styles
- All components must support disabled state
- Loading states required for async actions
- Proper ARIA labels and roles required

## Code Quality
- TypeScript interfaces for all props
- Export component and props interface
- Include Storybook story
- Include basic tests

## Accessibility
- Minimum 4.5:1 contrast ratio
- Keyboard navigation support
- Screen reader compatibility
- Focus management

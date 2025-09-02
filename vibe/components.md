# Component Contracts

## Button
- **Variants**: solid, ghost, link
- **Sizes**: sm, md, lg
- **States**: default, hover, focus-visible, disabled, loading
- **Anatomy**: container, optional icon, label, optional progress
- **Tokens**: bg uses brand; text uses text/onBrand; radius uses md; no hex/px

### Props
\`\`\`ts
interface ButtonProps {
  variant?: 'solid' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  isLoading?: boolean
  disabled?: boolean
  children: React.ReactNode
}
\`\`\`

## Card
- **Variants**: default, elevated
- **States**: default, hover, focus
- **Anatomy**: container, optional header, content, optional footer
- **Tokens**: bg uses surface; border uses border; radius uses lg

## Input
- **Variants**: default, error
- **States**: default, focus, disabled, error
- **Anatomy**: container, label, input, optional helper text
- **Tokens**: border uses border; focus uses brand; radius uses md

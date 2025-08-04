# DocHub Design System

A comprehensive atomic design system built with React, TypeScript, and Tailwind CSS for the DocHub pediatric health document management application.

## Architecture

This design system follows the **Atomic Design** methodology:

### 🔬 **Atoms** (Basic Building Blocks)
- **Button**: Versatile button with variants, sizes, icons, and loading states
- **Input**: Flexible input with icon support and error states  
- **Avatar**: User avatar with fallback support
- **Tag**: Categorization tags with removal functionality
- **Checkbox**: Accessible checkbox with indeterminate state
- **Radio**: Radio button with proper labeling
- **Skeleton**: Loading placeholder component

### 🧬 **Molecules** (Simple Component Groups)
- **LabeledInput**: Input with integrated label, description, and error handling
- **SearchBar**: Search input with clear functionality
- **DocumentCard**: Document display with metadata and actions
- **ChildProfileCard**: Child profile display with medical info

### 🦠 **Organisms** (Complex Component Groups)
- **UploadModal**: File upload interface with drag & drop
- **FolderList**: Hierarchical folder navigation
- **DocumentList**: Paginated document listing
- **SummaryPanel**: Dashboard statistics and insights

## Usage Examples

### Importing Components

\`\`\`tsx
// Atoms
import { Button } from '@/components/atoms/Button/Button'
import { Input } from '@/components/atoms/Input/Input'
import { Avatar } from '@/components/atoms/Avatar/Avatar'
import { Tag } from '@/components/atoms/Tag/Tag'

// Molecules  
import { LabeledInput } from '@/components/molecules/LabeledInput/LabeledInput'
import { SearchBar } from '@/components/molecules/SearchBar/SearchBar'
import { DocumentCard } from '@/components/molecules/DocumentCard/DocumentCard'
\`\`\`

### Basic Usage

\`\`\`tsx
// Button with icon and loading state
<Button 
  variant="primary" 
  leftIcon={<Download />}
  loading={isUploading}
  onClick={handleUpload}
>
  Upload Document
</Button>

// Labeled input with validation
<LabeledInput
  label="Email Address"
  type="email"
  required
  errorMessage={errors.email}
  leftIcon={<Mail className="h-4 w-4" />}
/>

// Document card with actions
<DocumentCard
  document={documentData}
  onView={handleView}
  onDownload={handleDownload}
  onMore={handleMore}
/>
\`\`\`

## Accessibility Features

### ♿ **ARIA Support**
- Proper ARIA roles and attributes
- Screen reader announcements
- Error state communication
- Loading state indicators

### ⌨️ **Keyboard Navigation**
- Tab order management
- Enter/Space activation
- Escape key handling
- Focus management

### 🎯 **Focus Management**
- Visible focus indicators
- Focus trapping in modals
- Logical tab sequences
- Skip links where appropriate

## Storybook Development

### Running Storybook
\`\`\`bash
npm run storybook
\`\`\`

### Story Structure
Each component includes comprehensive stories:
- **Default**: Basic usage
- **Variants**: All visual variants
- **States**: Interactive states
- **Accessibility**: A11y examples
- **Playground**: Interactive testing

### Example Story
\`\`\`tsx
export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button leftIcon={<Download />}>Download</Button>
      <Button rightIcon={<Plus />}>Add New</Button>
    </div>
  ),
}
\`\`\`

## Design Tokens

### Colors
\`\`\`css
:root {
  --primary: 142 76% 36%;        /* Medical green */
  --destructive: 0 84.2% 60.2%;  /* Error red */
  --warning: 43 74% 66%;         /* Warning yellow */
  --success: 142 76% 36%;        /* Success green */
}
\`\`\`

### Spacing
- Consistent 4px base unit
- Logical spacing scale (4, 8, 12, 16, 24, 32, 48, 64px)

### Typography
- Inter font family
- Semantic font sizes
- Proper line heights for readability

## Component Guidelines

### 📝 **Naming Conventions**
- PascalCase for components
- Descriptive prop names
- Consistent event handler patterns (`onAction`)

### 🎨 **Styling Approach**
- Tailwind CSS utility classes
- CSS custom properties for theming
- Class Variance Authority for variants
- Consistent spacing and sizing

### 🔧 **Props Interface**
- Extend native HTML attributes
- Optional props with sensible defaults
- Proper TypeScript typing
- Forward refs for DOM access

### 🧪 **Testing Strategy**
- Storybook for visual testing
- Accessibility testing built-in
- Interactive story examples
- Documentation-driven development

## Integration

### Adding to Existing Projects
\`\`\`tsx
// Import the design system
import { Button, Input, DocumentCard } from '@dochub/design-system'

// Use in your components
function UploadForm() {
  return (
    <form className="space-y-4">
      <Input placeholder="Document name" />
      <Button type="submit">Upload</Button>
    </form>
  )
}
\`\`\`

### Customization
\`\`\`tsx
// Extend components with custom variants
const CustomButton = styled(Button)`
  &.medical-emergency {
    background: var(--emergency-red);
    animation: pulse 2s infinite;
  }
`
\`\`\`

## Development Workflow

1. **Design**: Create designs in Figma/Sketch
2. **Build**: Implement atomic components
3. **Document**: Write Storybook stories
4. **Test**: Verify accessibility and interactions
5. **Review**: Code review and design review
6. **Deploy**: Publish to Storybook and npm

## Best Practices

### 🎯 **Component Design**
- Single responsibility principle
- Composable and reusable
- Consistent API patterns
- Proper error boundaries

### 🔍 **Accessibility First**
- Test with screen readers
- Verify keyboard navigation
- Check color contrast ratios
- Provide alternative text

### 📚 **Documentation**
- Clear usage examples
- Props documentation
- Accessibility notes
- Design guidelines

This design system provides a solid foundation for building consistent, accessible, and maintainable user interfaces for the DocHub application.

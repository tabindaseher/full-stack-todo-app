# Layout Structure: Multi-User Todo Application

## Overall Architecture

### Page Structure
The application follows a consistent layout pattern with the following key regions:
- **Header**: Navigation, user profile, and global actions
- **Sidebar**: Primary navigation and quick actions (desktop)
- **Main Content**: Primary application content and user interactions
- **Footer**: Secondary information and legal links (minimal)

### Responsive Breakdown
- **Desktop (≥1024px)**: Full layout with sidebar, header, and main content
- **Tablet (768px - 1023px)**: Collapsible sidebar, main content with adapted navigation
- **Mobile (<768px)**: Header with hamburger menu, stacked content layout

## Layout Components

### 1. Header Layout
**Desktop Dimensions**: Fixed height of 64px
**Mobile Dimensions**: Fixed height of 56px

**Elements**:
- Logo/branding (left-aligned)
- Main navigation (desktop only, center or left)
- User profile dropdown with avatar (right-aligned)
- Notification indicator (if implemented)
- Mobile menu toggle (mobile only)

**Behavior**:
- Fixed position at top of viewport
- Elevated slightly (z-index) to stay above scrolling content
- Background with subtle transparency or solid color

### 2. Sidebar Layout (Desktop)
**Dimensions**: Width of 280px, full viewport height minus header

**Elements**:
- Navigation menu items
- User profile card
- Quick action buttons
- Collapsible sections (if needed)

**Behavior**:
- Collapsible on user preference
- Persistent scroll within sidebar
- Active state highlighting for current section

### 3. Main Content Area
**Desktop**: Content area adjusted for header and sidebar (calc(100vw - 280px))
**Mobile/Tablet**: Full width, adjusts for header only

**Structure**:
- Page title/crumb area
- Primary content container
- Action bar (if needed)
- Secondary content (sidebar on some pages)

## Page-Specific Layouts

### Authentication Pages (Login/Register)
**Layout**: Centered card-based design
- **Container**: Fixed-width card (400px max) centered vertically and horizontally
- **Content**: Form elements with appropriate spacing
- **Branding**: Minimal logo placement at top of card
- **Background**: Subtle background pattern or color

**Responsive**:
- Card fills container width with padding on mobile
- Maintains vertical rhythm and spacing

### Dashboard Layout
**Overall Structure**:
- Header with user controls
- Two-column layout (sidebar + main content) on desktop
- Single column on mobile

**Main Content Structure**:
- Page header with title and primary actions
- Stats/summary cards (grid layout)
- Todo list area with filtering controls
- Empty states and loading indicators

**Responsive Behavior**:
- Cards rearrange to single column on mobile
- Filters become collapsible drawer on mobile
- Action buttons adapt to available space

### Todo Detail/Editing Layout
**Structure**:
- Header with back navigation and save controls
- Main form area with input fields
- Metadata and action sections

**Responsive Adaptation**:
- Form fields stack vertically on mobile
- Action buttons move to bottom of screen on mobile

## Component Container Specifications

### Card Components
- **Padding**: 24px standard, 16px for compact variants
- **Border Radius**: 8px rounded corners
- **Shadow**: Subtle elevation effect
- **Spacing**: 16px between cards, 24px from page edges

### Form Containers
- **Width**: Maximum 600px for single-column forms
- **Spacing**: 24px between form sections
- **Field Spacing**: 16px between individual fields
- **Actions**: Right-aligned with appropriate spacing

### List Components
- **Item Height**: 64px minimum for touch targets
- **Spacing**: 8px between items
- **Padding**: 16px horizontal, 12px vertical
- **Hover States**: Subtle background change

## Grid System

### Desktop Grid (12-column basis)
- **Container**: 1200px max-width, centered
- **Gutters**: 24px between columns
- **Margins**: 32px from viewport edges

### Mobile Grid
- **Container**: Full width with 16px margins
- **Gutters**: 16px between elements
- **Margins**: 16px from screen edges

## Spacing Standards

### Spacing Scale
- **xs**: 4px (small dividers, minor adjustments)
- **sm**: 8px (tight grouping)
- **md**: 16px (standard spacing)
- **lg**: 24px (section separation)
- **xl**: 32px (major layout divisions)
- **2xl**: 48px (large separations)

### Typography Spacing
- **Line Height**: 1.5 for body text, 1.25 for headings
- **Letter Spacing**: Normal for body, -0.02em for headings
- **Paragraph Spacing**: 16px between paragraphs

## Navigation Structure

### Primary Navigation
- **Location**: Header on mobile, sidebar on desktop
- **Active State**: Clear visual indicator (highlight/border)
- **Icons**: Accompany text labels for recognition
- **Dropdowns**: Appear below main navigation items

### Breadcrumb Navigation
- **Placement**: Below header, above main content
- **Separator**: Chevron icons between items
- **Truncation**: Long paths truncated with ellipsis

## Loading & Empty States

### Loading Containers
- **Placeholder Dimensions**: Match final content dimensions
- **Animation**: Subtle shimmer effect
- **Positioning**: Maintain layout stability during loading

### Empty State Containers
- **Padding**: Extra vertical spacing for emphasis
- **Illustration**: Simple, relevant icon or image
- **Message**: Clear, helpful text with action suggestions
- **Action Button**: Primary action button for remediation

## Accessibility Considerations

### Focus Management
- **Visible Focus**: Clear outline for keyboard navigation
- **Logical Tab Order**: Follows visual hierarchy
- **Skip Links**: For bypassing repetitive navigation

### Screen Reader Support
- **Landmarks**: Proper use of header, nav, main, aside, footer
- **Section Headings**: Hierarchical heading structure
- **ARIA Labels**: For interactive elements without visible text

## Performance Optimization

### Layout Stability
- **Dimension Setting**: Fixed dimensions for media elements
- **Skeleton Screens**: Placeholder layouts during loading
- **CSS Containment**: Optimize rendering performance
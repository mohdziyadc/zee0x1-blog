<!-- 2c4460de-09ab-4ffe-8103-ad6ec71d82ed 0601886b-165c-4e1c-abf0-e69f1cc24920 -->
# Lexical Editor Integration Plan

## Overview

Integrate Lexical rich text editor into `/admin/create.tsx` with image upload capabilities using a custom image node and a submit button. The submit handler will be left as TODO for now.

## Implementation Steps

### 1. Install Lexical Dependencies

Install the required Lexical packages:

- `lexical` - Core editor framework
- `@lexical/react` - React bindings for Lexical
- `@lexical/rich-text` - Rich text formatting (bold, italic, etc.)
- `@lexical/list` - List support (ordered/unordered)
- `@lexical/link` - Link support
- `@lexical/utils` - Utility functions
- `@lexical/html` - HTML serialization (for saving/loading content)

### 2. Create Custom Image Node

Create a custom Lexical image node at `src/components/LexicalImageNode.tsx` that:

- Extends Lexical's `DecoratorNode` for image rendering
- Handles image properties (src, alt, width, height)
- Supports image resizing and alignment
- Implements `exportJSON()` and `importJSON()` methods for serialization/deserialization
- Creates a React component (`LexicalImageComponent`) for rendering the image in the editor
- Handles image deletion and editing capabilities
- Registers the node type with Lexical's node registry

### 3. Create Lexical Editor Component

Create a new component at `src/components/LexicalEditor.tsx` that:

- Sets up a Lexical editor with rich text features
- Registers the custom image node in the editor configuration
- Includes a toolbar with formatting buttons (bold, italic, underline, lists, links)
- Integrates image upload functionality using the custom image node
- Uses Tailwind CSS for styling to match the app's design system
- Exposes an `onChange` callback to get the editor content
- Exposes editor state via ref or callback for form submission

### 4. Implement Image Upload

- Add an image upload button in the toolbar
- Create an image upload handler that:
  - Opens a file input dialog
  - Validates image file types and size
  - Uploads images to `public/uploads/` directory
  - Generates unique filenames to avoid conflicts (using timestamp + random string)
  - Inserts the image into the editor using the custom image node
- Create utility functions to handle image node insertion into the editor

### 5. Update Create Page

Update `src/routes/admin/create.tsx` to:

- Import and render the LexicalEditor component
- Add a title input field (for blog post title)
- Add a submit button using the existing Button component from `@/components/ui/button`
- Create a form wrapper with proper layout
- Add state management for editor content and title
- Implement submit handler as TODO comment

### 6. Styling

- Style the editor to match the app's dark theme
- Ensure the editor has proper min-height and responsive design
- Style the toolbar to be visually consistent with shadcn/ui components
- Add proper spacing and layout for the form
- Style the custom image node component to be visually appealing

## Files to Create/Modify

### New Files

- `src/components/LexicalImageNode.tsx` - Custom Lexical node for image handling with serialization
- `src/components/LexicalEditor.tsx` - Main editor component with toolbar and image support

### Modified Files

- `src/routes/admin/create.tsx` - Add editor, title input, and submit button
- `package.json` - Add Lexical dependencies

## Technical Details

### Lexical Setup

- Use `LexicalComposer` as the root component
- Configure initial editor state with custom nodes registered
- Use `RichTextPlugin` for rich text editing
- Use `ListPlugin` for list support
- Use `LinkPlugin` for link handling
- Register custom image node in the editor configuration using `nodes` array
- Create image insertion utility functions that work with the custom node

### Custom Image Node Implementation

- Extend `DecoratorNode` from Lexical
- Implement required methods: `createDOM()`, `updateDOM()`, `decorate()`, `exportJSON()`, `importJSON()`, `static getType()`, `static clone()`
- Create a React component that renders the image with optional controls (delete button, resize handles)
- Handle image loading states and error states
- Support alt text editing

### Image Upload Strategy

- For MVP: Upload images to `public/uploads/` directory
- Generate unique filenames to avoid conflicts (using `Date.now()` + random string)
- Store image data in custom image node with src, alt, and metadata
- Custom node serializes to JSON format for persistence
- Consider future: API endpoint for image uploads with proper storage

### Content Storage Format

- Custom image node will serialize to JSON format with image metadata
- Use Lexical's `$generateNodesFromDOM` and `$generateHtmlFromNodes` for HTML serialization
- Store content as HTML string (images will be converted to `<img>` tags in HTML)
- Editor state can be serialized to JSON for more advanced features (preserves custom node structure)
- Custom node implements `exportJSON()` and `importJSON()` methods for proper serialization

## Dependencies to Install

```bash
npm install lexical @lexical/react @lexical/rich-text @lexical/list @lexical/link @lexical/utils @lexical/html
```

Note: We'll build a custom image node from scratch, so no additional image-related packages needed.

## Notes

- The submit handler will be marked as TODO for now
- Image uploads will be stored locally in `public/uploads/` directory
- Editor content will be accessible via state for future form submission
- The editor will be styled to match the existing dark theme
- Custom image node provides full control over image behavior and rendering

### To-dos

- [ ] Install Lexical dependencies (lexical, @lexical/react, @lexical/rich-text, @lexical/list, @lexical/link, @lexical/utils, @lexical/html)
- [ ] Create LexicalEditor component at src/components/LexicalEditor.tsx with rich text features, toolbar, and image upload support
- [ ] Implement image upload functionality in LexicalEditor component with file validation and local storage to public/uploads/
- [ ] Update src/routes/admin/create.tsx to include title input, LexicalEditor component, and submit button with TODO handler
- [ ] Style the editor and form to match the app theme with proper spacing and responsive design
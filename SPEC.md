# Reading Diary - MVP Specification

## 1. Project Overview

**Project Name:** Reading Diary  
**Type:** Personal Reading Journal Web Application  
**Core Functionality:** A warm, antique-styled diary where users capture reading moments by uploading book page photos and cover images, enhanced with consistent visual styling to create a cozy reading atmosphere.  
**Target Users:** Book lovers who want to preserve and reflect on their reading experiences

---

## 2. UI/UX Specification

### Layout Structure

**Pages:**
1. **Home Page** - Landing page with hero and navigation
2. **Create Entry Page** - Form to add new reading notes
3. **Diary Page** - Grid of saved entries
4. **Entry Detail Page** - Full view of a single entry

**Responsive Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Design

**Color Palette:**
- Background: `#F5F0E8` (warm cream/paper)
- Primary: `#8B4513` (saddle brown - antique leather)
- Secondary: `#D4A574` (warm tan)
- Accent: `#6B4423` (dark brown)
- Text Primary: `#3D2914` (deep brown)
- Text Secondary: `#7A6555` (muted brown)
- Card Background: `#FFFDF8` (off-white)
- Border: `#E0D5C5` (light tan)

**Typography:**
- Headings: `Playfair Display` (serif, elegant)
- Body: `Crimson Text` (serif, readable)
- UI Elements: `Source Sans 3` (clean sans-serif)

**Spacing System:**
- Base unit: 8px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

**Visual Effects:**
- Box shadows: `0 2px 8px rgba(61, 41, 20, 0.08)`
- Card hover: `0 4px 16px rgba(61, 41, 20, 0.12)`
- Border radius: 8px (cards), 4px (buttons)
- Transitions: 200ms ease-out

### Components

**Navigation:**
- Simple top nav with logo and links
- Links: Home, Create Entry, My Diary

**Buttons:**
- Primary: Brown background, cream text
- Secondary: Transparent with brown border
- States: hover (darken 10%), active (darken 15%), disabled (50% opacity)

**Cards:**
- Entry cards with image, title, thought preview, date
- Hover: subtle lift effect

**Forms:**
- Clean input fields with brown borders
- Focus state: slightly darker border
- Labels above inputs

**Image Upload:**
- Drag-and-drop zone
- Preview thumbnails after upload

**Image Toggle:**
- Switch between original and styled versions

---

## 3. Functionality Specification

### Core Features

**Image Upload:**
- Accept JPG, PNG, WebP formats
- Max file size: 5MB
- Two upload zones: book cover + page image

**Image Styling (CSS Filters):**
```css
/* Antique effect */
filter: sepia(30%) saturate(80%) brightness(95%) contrast(90%);
/* Add grain texture via overlay */
```

**Data Storage:**
- LocalStorage for entries
- Store as JSON array

**Entry Management:**
- Create new entry
- View all entries
- View single entry detail
- Delete entry (optional)

### User Interactions

1. **Home → Create:** Click "Create new entry" → Create Entry Page
2. **Home → Diary:** Click "View my diary" → Diary Page
3. **Create Entry:**
   - Upload cover image → preview styled version
   - Upload page image → preview styled version
   - Fill in book title, author, thought, tags
   - Click Save → stored to localStorage → redirect to Diary
4. **Diary → Detail:** Click entry card → Entry Detail Page
5. **Detail:** Toggle original/styled image view

### Data Model

```typescript
interface ReadingEntry {
  id: string;              // UUID
  bookTitle: string;
  author: string;
  thought: string;
  tags: string[];
  coverImage: {
    original: string;     // base64 data URL
    styled: string;       // base64 data URL with filter
  };
  pageImage: {
    original: string;
    styled: string;
  };
  createdAt: string;      // ISO date string
  updatedAt: string;
}
```

---

## 4. Acceptance Criteria

### Visual Checkpoints
- [ ] Warm, antique color scheme applied consistently
- [ ] Fonts load correctly (Playfair Display, Crimson Text)
- [ ] Image styling creates sepia/warm effect
- [ ] Cards have proper shadows and hover effects
- [ ] Responsive layout works on mobile/tablet/desktop

### Functional Checkpoints
- [ ] Can upload two images (cover + page)
- [ ] Styled versions auto-generate on upload
- [ ] Can toggle between original and styled images
- [ ] Can enter book title, author, thought, tags
- [ ] Save button stores entry to localStorage
- [ ] Diary page displays all saved entries
- [ ] Clicking entry shows detail page
- [ ] Data persists after page refresh

### Technical Checkpoints
- [ ] Next.js app builds without errors
- [ ] No console errors on page load
- [ ] LocalStorage read/write works
- [ ] Images stored as base64 data URLs
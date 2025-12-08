# Marketing Design System

## Design Philosophy

Our visual identity reflects our brand voice: **confident, clear, and real.** We're not another soft, pastel education platform. We're not a generic purple-gradient AI tool. We're a strategic command center for college prep—and we look like it.

**Core principles:**
- **Dark-mode first** — Gen Z lives in dark mode. We design for it, not as an afterthought.
- **Data-forward** — We're a strategy platform. Dashboards, metrics, and information density are features, not clutter.
- **Confident contrast** — Bold color choices, not safe ones. Sharp typography, not rounded everything.
- **Editorial clarity** — Information hierarchy matters. We guide the eye.

---

## Color Palette

### Primary Colors

Our palette is built around a confident dark base with a warm, energetic accent.

| Name | Hex | Usage |
|------|-----|-------|
| **Ink** | `#09090B` | Primary dark background |
| **Surface** | `#18181B` | Cards, elevated surfaces (dark) |
| **Border** | `#27272A` | Dividers, subtle boundaries |
| **Coral** | `#F97316` | Primary accent, CTAs, key actions |
| **Cyan** | `#06B6D4` | Secondary accent, data highlights, links |

### Light Mode Variants

| Name | Hex | Usage |
|------|-----|-------|
| **Paper** | `#FAFAFA` | Primary light background |
| **White** | `#FFFFFF` | Cards, elevated surfaces (light) |
| **Border Light** | `#E4E4E7` | Dividers, subtle boundaries |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Text Primary (Dark)** | `#FAFAFA` | Main text on dark backgrounds |
| **Text Secondary (Dark)** | `#A1A1AA` | Supporting text, labels |
| **Text Primary (Light)** | `#09090B` | Main text on light backgrounds |
| **Text Secondary (Light)** | `#71717A` | Supporting text, labels |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#22C55E` | Positive actions, completed states |
| **Warning** | `#EAB308` | Deadlines, alerts, caution |
| **Error** | `#EF4444` | Errors, rejections, critical |
| **Info** | `#3B82F6` | Informational, neutral alerts |

### Gradients

Used sparingly for hero sections and premium features:

```css
/* Hero gradient */
background: linear-gradient(135deg, #09090B 0%, #1a1a2e 50%, #09090B 100%);

/* Accent glow */
background: radial-gradient(ellipse at center, rgba(249,115,22,0.15) 0%, transparent 70%);

/* Coral to Cyan (for special moments) */
background: linear-gradient(90deg, #F97316 0%, #06B6D4 100%);
```

---

## Typography

### Font Stack

**Headlines:** Outfit  
A geometric, modern sans-serif with confident presence. Use weights 600-800.

**Body:** DM Sans  
Warm, readable, and clean. Use weights 400-500.

**Monospace:** JetBrains Mono  
For data, statistics, deadlines, and technical elements.

```css
/* Font imports */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@400;500;600;700;800&display=swap');

/* CSS Variables */
--font-display: 'Outfit', sans-serif;
--font-body: 'DM Sans', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| **Display** | 72px / 4.5rem | 800 | 1.1 | Hero headlines |
| **H1** | 48px / 3rem | 700 | 1.2 | Page titles |
| **H2** | 36px / 2.25rem | 700 | 1.25 | Section headers |
| **H3** | 24px / 1.5rem | 600 | 1.3 | Subsections |
| **H4** | 20px / 1.25rem | 600 | 1.4 | Card titles |
| **Body Large** | 18px / 1.125rem | 400 | 1.6 | Lead paragraphs |
| **Body** | 16px / 1rem | 400 | 1.6 | Default text |
| **Body Small** | 14px / 0.875rem | 400 | 1.5 | Captions, metadata |
| **Caption** | 12px / 0.75rem | 500 | 1.4 | Labels, timestamps |
| **Mono Data** | 14-24px | 600 | 1.2 | Statistics, percentages |

### Typography Guidelines

- **Headlines:** Short, punchy. No fluff. Sentence case, not Title Case.
- **Body:** Keep paragraphs short (3-4 lines max). Use whitespace.
- **Data:** Monospace for anything numeric or time-based.
- **Emphasis:** Use weight (bold), not italics. Use color sparingly.

---

## Spacing & Layout

### Spacing Scale

Based on 4px grid:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing, icon gaps |
| `--space-2` | 8px | Inline element spacing |
| `--space-3` | 12px | Small component padding |
| `--space-4` | 16px | Default component padding |
| `--space-5` | 20px | Medium spacing |
| `--space-6` | 24px | Section padding |
| `--space-8` | 32px | Large spacing |
| `--space-10` | 40px | Section gaps |
| `--space-12` | 48px | Major section breaks |
| `--space-16` | 64px | Hero spacing |
| `--space-20` | 80px | Page section gaps |

### Container Widths

| Name | Width | Usage |
|------|-------|-------|
| **Narrow** | 640px | Blog posts, focused content |
| **Default** | 1024px | Standard page content |
| **Wide** | 1280px | Dashboards, data-heavy pages |
| **Full** | 100% | Hero sections, edge-to-edge |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Buttons, badges |
| `--radius-md` | 8px | Cards, inputs |
| `--radius-lg` | 12px | Modals, large cards |
| `--radius-xl` | 16px | Feature cards |
| `--radius-full` | 9999px | Pills, avatars |

---

## Components

### Buttons

**Primary** — Coral background, white text. For main CTAs.  
**Secondary** — Border only, transparent fill. For secondary actions.  
**Ghost** — No border, subtle hover. For tertiary actions.  
**Danger** — Error color. For destructive actions.

All buttons: `font-weight: 600`, `padding: 12px 24px`, `border-radius: 6px`

Hover states: Slight lift (`transform: translateY(-1px)`) + subtle glow.

### Cards

- Background: Surface color (`#18181B` dark / `#FFFFFF` light)
- Border: 1px solid Border color
- Padding: 24px
- Border-radius: 12px
- Hover: Subtle border color change, optional lift

### Inputs

- Background: Slightly darker/lighter than surface
- Border: 1px solid Border color
- Focus: Coral border, subtle glow
- Padding: 12px 16px
- Border-radius: 8px

### Badges & Tags

- Small, pill-shaped (`border-radius: full`)
- Background: Accent color at 10-20% opacity
- Text: Accent color
- Padding: 4px 12px
- Font: Caption size, weight 500

---

## Iconography

**Style:** Outline icons, 1.5px stroke weight  
**Size:** 20px default, 16px small, 24px large  
**Recommended:** Lucide Icons, Phosphor Icons, or Heroicons

Icons should be functional, not decorative. Every icon should communicate something.

---

## Motion & Animation

**Philosophy:** Quick, confident, purposeful. No bouncy, playful animations—we're not a toy.

### Timing

| Type | Duration | Easing |
|------|----------|--------|
| **Micro** | 100-150ms | ease-out |
| **Standard** | 200-300ms | ease-out |
| **Complex** | 300-500ms | ease-in-out |

### Common Animations

```css
/* Button hover */
transition: transform 150ms ease-out, box-shadow 150ms ease-out;
transform: translateY(-1px);

/* Card hover */
transition: border-color 200ms ease-out, box-shadow 200ms ease-out;

/* Page transitions */
transition: opacity 300ms ease-out, transform 300ms ease-out;

/* Stagger children (entrance) */
animation-delay: calc(var(--index) * 50ms);
```

### Micro-interactions

- Button press: Scale to 0.98
- Success: Brief checkmark animation
- Error: Subtle shake (2-3 cycles, 4px)
- Loading: Pulsing opacity or skeleton shimmer

---

## Dark/Light Mode

**Default:** Dark mode  
**Toggle:** User preference, system preference respected

Dark mode is not an afterthought—it's our primary design. Light mode is a carefully considered alternative, not just inverted colors.

### Dark Mode

- Rich, inky backgrounds (`#09090B`, `#18181B`)
- Coral and cyan pop against dark
- Text: Off-white (`#FAFAFA`) primary, gray (`#A1A1AA`) secondary

### Light Mode

- Clean paper whites (`#FAFAFA`, `#FFFFFF`)
- Coral shifts slightly warmer
- Text: Near-black (`#09090B`) primary, gray (`#71717A`) secondary
- Increased contrast for readability

---

## Imagery & Illustration

### Photography

- Real students in real settings (not stock photo perfect)
- Diverse, authentic, candid
- Avoid: Cheesy graduation caps, stressed students, stereotypical "studying" poses
- Prefer: Students working on projects, collaborating, building things

### Illustrations

- Geometric, clean, minimal
- Use accent colors sparingly
- Data visualizations > decorative illustrations
- If using illustrations, they should communicate information, not just fill space

### Backgrounds

- Subtle gradient meshes
- Geometric grid patterns (faint)
- Noise texture (very subtle, 2-5% opacity)
- Avoid: Stock photo backgrounds, cluttered patterns

---

## Voice in Design

Our visual design reinforces our brand voice:

| Voice Trait | Design Expression |
|-------------|-------------------|
| **Confident** | Bold type, strong contrast, decisive color choices |
| **Direct** | Clear hierarchy, minimal decoration, information-dense |
| **Smart** | Data visualization, strategic layouts, precision |
| **Real** | Authentic imagery, honest UI (no fake data), clear states |
| **Forward-looking** | Modern aesthetic, dark mode, tech-forward details |

---

## Do's and Don'ts

### Do
- ✓ Use generous whitespace
- ✓ Lead with data and action
- ✓ Keep text short and scannable
- ✓ Use monospace for statistics and dates
- ✓ Make CTAs obvious
- ✓ Design for dark mode first

### Don't
- ✗ Use multiple colors simultaneously
- ✗ Add decorative elements without purpose
- ✗ Use stock photography
- ✗ Round everything (selective radius)
- ✗ Use pastel colors
- ✗ Make the UI feel "soft" or "safe"

---

## CSS Custom Properties

```css
:root {
  /* Colors - Dark Mode (default) */
  --color-bg: #09090B;
  --color-surface: #18181B;
  --color-border: #27272A;
  --color-text: #FAFAFA;
  --color-text-secondary: #A1A1AA;
  
  --color-accent: #F97316;
  --color-accent-secondary: #06B6D4;
  --color-success: #22C55E;
  --color-warning: #EAB308;
  --color-error: #EF4444;
  --color-info: #3B82F6;
  
  /* Typography */
  --font-display: 'Outfit', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  
  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 20px rgba(249,115,22,0.3);
}

/* Light mode overrides */
[data-theme="light"] {
  --color-bg: #FAFAFA;
  --color-surface: #FFFFFF;
  --color-border: #E4E4E7;
  --color-text: #09090B;
  --color-text-secondary: #71717A;
  
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.15);
}
```

---

*This design system is a living document. As we build and iterate, we'll refine these guidelines—but the core philosophy remains: confident, clear, and real.*





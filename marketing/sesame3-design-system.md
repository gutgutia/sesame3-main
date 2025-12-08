# Sesame3 Design System

> **Brand:** Sesame3  
> **Aesthetic:** Bold Lime (High-energy dark theme with neon lime accent)  
> **Last Updated:** December 2024

---

## Brand Overview

**Sesame3** is a college counseling platform that cuts through the chaos. Our visual identity is bold, confident, and unapologetically modern—inspired by high-energy sports branding and tech-forward aesthetics.

### Design Philosophy

- **Dark-mode only** — We embrace the darkness. No light mode. No compromises.
- **High energy** — Bold typography, neon accents, confident presence
- **Data-forward** — Statistics and metrics are features, not clutter
- **Sharp & angular** — Minimal border radius, architectural layouts
- **Information density** — We show you everything; we just make it look good

---

## Logo

### Primary Logo (Stacked)

```
SESAME  ← White (#FFFFFF)
3       ← Lime (#BEFF00)
```

- Font: Bebas Neue
- Line height: 0.85
- Letter spacing: 0.02em

### Inline Logo

```
SESAME3
^^^^^^ White
      ^ Lime
```

### Logo Mark

- Shape: Rounded square (border-radius: 16px)
- Background: Lime (#BEFF00)
- Text: "S3" in black (#0A0A0A)
- Small variant: 40×40px, border-radius: 8px

### Logo Usage Rules

- Always use on dark backgrounds
- Minimum clear space: Height of the "3"
- Never stretch, rotate, or add effects
- The lime "3" is always the accent—never change its color

---

## Color Palette

### Brand Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Lime** | `#BEFF00` | 190, 255, 0 | Primary accent, CTAs, highlights |
| **Lime Hover** | `#D4FF4D` | 212, 255, 77 | Hover states |
| **Lime Active** | `#A8E600` | 168, 230, 0 | Active/pressed states |
| **Lime Subtle** | `rgba(190,255,0,0.12)` | — | Backgrounds, badges |

### Background Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Primary** | `#0A0A0A` | Main background, body |
| **Secondary** | `#111111` | Sections, alternating areas |
| **Elevated** | `#1A1A1A` | Cards, modals, elevated surfaces |
| **Surface** | `#222222` | Inputs, interactive surfaces |

### Border Colors

| Name | Value | Usage |
|------|-------|-------|
| **Default** | `rgba(255,255,255,0.08)` | Subtle dividers |
| **Hover** | `rgba(255,255,255,0.15)` | Hover states |
| **Active** | `rgba(255,255,255,0.25)` | Focus states |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Primary** | `#FFFFFF` | Headlines, important text |
| **Secondary** | `#888888` | Body text, descriptions |
| **Muted** | `#555555` | Labels, metadata, captions |
| **Inverse** | `#000000` | Text on lime backgrounds |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#22C55E` | Positive actions, completed, accepted |
| **Warning** | `#FACC15` | Deadlines, alerts, caution |
| **Error** | `#EF4444` | Errors, rejections, critical |
| **Info** | `#3B82F6` | Informational, neutral |

### Gradients & Effects

```css
/* Hero background glow */
background: 
  radial-gradient(ellipse at 70% 30%, rgba(190,255,0,0.08) 0%, transparent 50%),
  radial-gradient(ellipse at 30% 70%, rgba(190,255,0,0.05) 0%, transparent 40%);

/* Lime button glow */
box-shadow: 0 8px 30px rgba(190,255,0,0.3);

/* Glass effect */
background: rgba(10,10,10,0.9);
backdrop-filter: blur(20px);
```

---

## Typography

### Font Stack

| Role | Font | Fallback |
|------|------|----------|
| **Display** | Bebas Neue | Anton, sans-serif |
| **Body** | DM Sans | -apple-system, sans-serif |
| **Mono** | JetBrains Mono | Fira Code, monospace |

### Font Import

```css
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
```

### Type Scale

| Name | Size | Font | Weight | Line Height | Usage |
|------|------|------|--------|-------------|-------|
| **Hero** | clamp(60px, 10vw, 120px) | Bebas Neue | 400 | 0.9 | Main hero headlines |
| **Display 1** | 72px | Bebas Neue | 400 | 1.0 | Section heroes |
| **Display 2** | 56px | Bebas Neue | 400 | 1.0 | Major headings |
| **Display 3** | 48px | Bebas Neue | 400 | 1.1 | Section titles |
| **Display 4** | 36px | Bebas Neue | 400 | 1.1 | Subsection titles |
| **Display 5** | 28px | Bebas Neue | 400 | 1.2 | Card titles |
| **Body Large** | 18px | DM Sans | 400 | 1.6 | Lead paragraphs |
| **Body** | 15px | DM Sans | 400 | 1.6 | Default text |
| **Body Small** | 13px | DM Sans | 400 | 1.5 | Captions, metadata |
| **Label** | 11-12px | DM Sans | 500 | 1.4 | Labels, uppercase caps |
| **Stat Value** | 32-48px | JetBrains Mono | 600 | 1.0 | Statistics, data |

### Typography Rules

- **Display text:** Always uppercase for Bebas Neue headings
- **Letter spacing:** 0.02em for display, 0.05em for nav links, 0.15em for labels
- **Labels:** Always uppercase, wide letter spacing
- **Data/stats:** Always use JetBrains Mono
- **Lime accent:** Use sparingly on key words or data points

### Example Headline Treatments

```
THE COLLEGE          ← White
PROCESS IS           ← White  
CHAOS.               ← Lime
```

---

## Spacing

### Spacing Scale (4px base)

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight gaps, icon padding |
| `space-2` | 8px | Inline spacing, small gaps |
| `space-3` | 12px | Compact component padding |
| `space-4` | 16px | Default padding |
| `space-5` | 20px | Medium spacing |
| `space-6` | 24px | Component padding |
| `space-8` | 32px | Section padding |
| `space-10` | 40px | Large spacing, container padding |
| `space-12` | 48px | Major gaps |
| `space-16` | 64px | Section spacing |
| `space-20` | 80px | Hero spacing |
| `space-24` | 96px | Major section breaks |

### Container Widths

| Name | Width | Usage |
|------|-------|-------|
| **sm** | 640px | Narrow content |
| **md** | 768px | Blog, focused |
| **lg** | 1024px | Standard |
| **xl** | 1200px | Wide content |
| **2xl** | 1400px | Full dashboard |
| **Padding** | 40px | Container side padding |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0 | Stat blocks, sharp edges |
| `radius-sm` | 4px | Small elements |
| `radius-md` | 8px | Inputs, small cards |
| `radius-lg` | 12px | Icons, badges |
| `radius-xl` | 16px | Cards, modals |
| `radius-2xl` | 24px | Feature cards |
| `radius-full` | 9999px | Pills, buttons, avatars |

**Note:** The Sesame3 aesthetic favors sharp edges (0 radius) for stat blocks and feature cards, with pill shapes (full radius) for buttons and badges.

---

## Shadows

| Name | Value | Usage |
|------|-------|-------|
| **sm** | `0 2px 8px rgba(0,0,0,0.3)` | Subtle elevation |
| **md** | `0 4px 16px rgba(0,0,0,0.4)` | Cards, dropdowns |
| **lg** | `0 8px 30px rgba(0,0,0,0.5)` | Modals, popovers |
| **xl** | `0 16px 48px rgba(0,0,0,0.6)` | Hero elements |
| **lime** | `0 8px 30px rgba(190,255,0,0.3)` | Lime button hover |
| **lime-lg** | `0 12px 40px rgba(190,255,0,0.4)` | Emphasized lime elements |

---

## Components

### Buttons

#### Primary (Lime)

```css
background: #BEFF00;
color: #000000;
padding: 14px 28px;
border-radius: 9999px;
font-weight: 600;
font-size: 14px;
text-transform: uppercase;
letter-spacing: 0.05em;

/* Hover */
background: #D4FF4D;
transform: translateY(-2px);
box-shadow: 0 8px 30px rgba(190,255,0,0.3);
```

#### Secondary (Outline)

```css
background: transparent;
color: #FFFFFF;
padding: 14px 28px;
border-radius: 9999px;
border: 2px solid rgba(255,255,255,0.15);
font-weight: 600;

/* Hover */
border-color: #FFFFFF;
background: rgba(255,255,255,0.05);
```

#### Ghost

```css
background: transparent;
color: #888888;
padding: 12px 20px;
border-radius: 8px;

/* Hover */
color: #FFFFFF;
background: rgba(255,255,255,0.05);
```

#### Button Sizes

| Size | Padding | Font Size |
|------|---------|-----------|
| **sm** | 10px 20px | 12px |
| **default** | 14px 28px | 14px |
| **lg** | 18px 36px | 16px |

### Cards

#### Feature Card

```css
background: #0A0A0A;
border: 1px solid rgba(255,255,255,0.08);
padding: 40px;
border-radius: 0; /* Sharp edges */

/* Hover */
border-color: #BEFF00;
transform: translateY(-4px);
```

#### Stat Card

```css
background: #111111;
border: 1px solid rgba(255,255,255,0.08);
padding: 40px;
text-align: center;
border-radius: 0;
```

#### Elevated Card

```css
background: #1A1A1A;
border: 1px solid rgba(255,255,255,0.08);
padding: 24px;
border-radius: 16px;
backdrop-filter: blur(10px);
```

### Badges

```css
display: inline-flex;
padding: 4px 12px;
border-radius: 9999px;
font-size: 12px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.05em;
```

| Variant | Background | Text Color |
|---------|------------|------------|
| **Lime** | `rgba(190,255,0,0.12)` | `#BEFF00` |
| **Success** | `rgba(34,197,94,0.12)` | `#22C55E` |
| **Warning** | `rgba(250,204,21,0.12)` | `#FACC15` |
| **Error** | `rgba(239,68,68,0.12)` | `#EF4444` |
| **Info** | `rgba(59,130,246,0.12)` | `#3B82F6` |

### Form Inputs

```css
background: #0A0A0A;
border: 1px solid rgba(255,255,255,0.08);
border-radius: 8px;
padding: 12px 16px;
color: #FFFFFF;
font-size: 14px;

/* Focus */
border-color: #BEFF00;
box-shadow: 0 0 0 3px rgba(190,255,0,0.12);
outline: none;

/* Placeholder */
color: #555555;
```

### Alerts

```css
display: flex;
align-items: flex-start;
gap: 12px;
padding: 16px;
border-radius: 8px;
font-size: 14px;
```

| Variant | Background | Border | Text |
|---------|------------|--------|------|
| **Warning** | `rgba(250,204,21,0.12)` | `rgba(250,204,21,0.3)` | `#FACC15` |
| **Success** | `rgba(34,197,94,0.12)` | `rgba(34,197,94,0.3)` | `#22C55E` |
| **Error** | `rgba(239,68,68,0.12)` | `rgba(239,68,68,0.3)` | `#EF4444` |

### Icon Boxes

```css
width: 48px;
height: 48px;
background: rgba(190,255,0,0.12);
border-radius: 12px;
display: flex;
align-items: center;
justify-content: center;
color: #BEFF00;
```

---

## Motion & Animation

### Timing

| Type | Duration | Easing |
|------|----------|--------|
| **Fast** | 150ms | ease |
| **Base** | 200ms | ease |
| **Slow** | 300ms | ease |
| **Bounce** | 400ms | cubic-bezier(0.34, 1.56, 0.64, 1) |

### Common Animations

```css
/* Button hover */
transition: all 0.2s ease;
transform: translateY(-2px);
box-shadow: 0 8px 30px rgba(190,255,0,0.3);

/* Card hover */
transition: all 0.3s ease;
border-color: #BEFF00;
transform: translateY(-4px);

/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pulse lime (for attention) */
@keyframes pulseLime {
  0%, 100% { box-shadow: 0 0 0 0 rgba(190,255,0,0.4); }
  50% { box-shadow: 0 0 0 12px rgba(190,255,0,0); }
}
```

### Stagger Animation

```css
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 100ms; }
.stagger > *:nth-child(3) { animation-delay: 200ms; }
.stagger > *:nth-child(4) { animation-delay: 300ms; }
```

---

## Iconography

- **Style:** Outline icons, 2px stroke
- **Color:** Lime for active/accent, Secondary text for default
- **Sizes:** 16px (small), 20px (default), 24px (large)
- **Recommended:** Lucide Icons, Heroicons

---

## Voice in Design

| Trait | Expression |
|-------|------------|
| **Confident** | Bold type, strong contrast, decisive lime accent |
| **Direct** | Clear hierarchy, minimal decoration, sharp edges |
| **Smart** | Data visualization, monospace stats, precision |
| **Real** | Authentic UI, honest data, clear states |
| **High-energy** | Neon accents, dynamic layouts, bold headlines |

---

## Do's and Don'ts

### Do ✓

- Use Bebas Neue for all headlines (uppercase)
- Use lime sparingly—it should pop, not overwhelm
- Keep stat blocks sharp (no border radius)
- Lead with data and bold statements
- Embrace information density
- Use monospace for all statistics and dates

### Don't ✗

- Use light backgrounds or light mode
- Use multiple accent colors together
- Round everything—be selective with radius
- Use decorative elements without purpose
- Make the UI feel "soft" or "approachable"
- Use pastel or muted colors

---

## CSS Custom Properties

```css
:root {
  /* Background */
  --s3-bg-primary: #0A0A0A;
  --s3-bg-secondary: #111111;
  --s3-bg-elevated: #1A1A1A;
  --s3-bg-surface: #222222;
  
  /* Border */
  --s3-border: rgba(255,255,255,0.08);
  --s3-border-hover: rgba(255,255,255,0.15);
  --s3-border-active: rgba(255,255,255,0.25);
  
  /* Text */
  --s3-text-primary: #FFFFFF;
  --s3-text-secondary: #888888;
  --s3-text-muted: #555555;
  --s3-text-inverse: #000000;
  
  /* Lime (Brand) */
  --s3-lime: #BEFF00;
  --s3-lime-hover: #D4FF4D;
  --s3-lime-active: #A8E600;
  --s3-lime-subtle: rgba(190,255,0,0.12);
  --s3-lime-glow: rgba(190,255,0,0.3);
  
  /* Semantic */
  --s3-success: #22C55E;
  --s3-warning: #FACC15;
  --s3-error: #EF4444;
  --s3-info: #3B82F6;
  
  /* Typography */
  --s3-font-display: 'Bebas Neue', sans-serif;
  --s3-font-body: 'DM Sans', sans-serif;
  --s3-font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --s3-space-1: 4px;
  --s3-space-2: 8px;
  --s3-space-3: 12px;
  --s3-space-4: 16px;
  --s3-space-6: 24px;
  --s3-space-8: 32px;
  --s3-space-10: 40px;
  --s3-space-12: 48px;
  --s3-space-16: 64px;
  --s3-space-20: 80px;
  
  /* Radius */
  --s3-radius-none: 0;
  --s3-radius-sm: 4px;
  --s3-radius-md: 8px;
  --s3-radius-lg: 12px;
  --s3-radius-xl: 16px;
  --s3-radius-full: 9999px;
  
  /* Shadows */
  --s3-shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
  --s3-shadow-md: 0 4px 16px rgba(0,0,0,0.4);
  --s3-shadow-lg: 0 8px 30px rgba(0,0,0,0.5);
  --s3-shadow-lime: 0 8px 30px rgba(190,255,0,0.3);
  
  /* Transitions */
  --s3-transition-fast: 0.15s ease;
  --s3-transition-base: 0.2s ease;
  --s3-transition-slow: 0.3s ease;
}
```

---

## Quick Reference Card

```
BRAND:      Sesame3
ACCENT:     #BEFF00 (Lime)
BACKGROUND: #0A0A0A (Near black)
DISPLAY:    Bebas Neue (uppercase)
BODY:       DM Sans
DATA:       JetBrains Mono

LOGO:       SESAME (white) / 3 (lime) — stacked
BUTTONS:    Pill shape, lime primary
CARDS:      Sharp edges (0 radius), lime border on hover
STATS:      Mono font, lime accent, display size
```

---

*This design system defines the Sesame3 marketing aesthetic. The core identity is bold, dark, and high-energy—a confident visual language for students who want to win.*


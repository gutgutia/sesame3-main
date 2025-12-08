# Lando Norris Website Design System

> Extracted from [landonorris.com](https://landonorris.com/) - A premium, high-performance personal brand website for the 2025 McLaren Formula 1 Driver.

---

## Overview

The Lando Norris website exemplifies modern sports/athlete branding with a bold, energetic aesthetic. The design balances high-impact visuals with clean minimalism, using a distinctive neon lime accent color as the signature brand element.

**Key Design Principles:**
- Bold, unapologetic typography
- High-contrast color scheme (dark/light modes)
- Interactive, immersive experiences
- Premium, editorial-quality imagery
- Motion and animation as core elements

---

## Color Palette

### Primary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **Neon Lime** | `#BEFF00` | Primary accent, CTAs, brand signature |
| **Pure Black** | `#000000` | Headlines on light backgrounds |
| **Off-White/Cream** | `#F5F5F0` | Light theme background |
| **Near Black** | `#111111` | Dark theme background |

### Secondary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| **White** | `#FFFFFF` | Text on dark backgrounds |
| **Warm Gray** | `#E8E5DF` | Subtle backgrounds, organic patterns |
| **Dark Gray** | `#2A2A2A` | Card borders, subtle UI elements |
| **Medium Gray** | `#888888` | Secondary text, labels |

### Theme Variants

**Light Theme (Homepage, Off Track)**
```css
--bg-primary: #F5F5F0;
--bg-secondary: #E8E5DF;
--text-primary: #000000;
--text-secondary: #666666;
--accent: #BEFF00;
```

**Dark Theme (On Track)**
```css
--bg-primary: #111111;
--bg-secondary: #1A1A1A;
--text-primary: #FFFFFF;
--text-secondary: #888888;
--accent: #BEFF00;
```

---

## Typography

### Font Families

**Display/Headlines:**
- Custom condensed sans-serif (similar to Monument Extended, Bebas Neue, or custom typeface)
- Extremely bold weight
- Tight letter-spacing
- All-caps for maximum impact

**Body Text:**
- Clean geometric sans-serif (similar to DM Sans, Inter, or Neue Haas)
- Regular and medium weights
- Comfortable reading line-height

**Accent/Signature:**
- Handwritten script for signature elements
- Italic serif for emphasis within body text

### Type Scale

| Element | Size | Weight | Style |
|---------|------|--------|-------|
| Hero Title | 120-200px | 900/Black | Uppercase, condensed |
| Section Title | 48-72px | 700/Bold | Uppercase |
| Subheading | 24-32px | 600/Semi-bold | Sentence case |
| Body Large | 18-22px | 400/Regular | Sentence case |
| Body | 16px | 400/Regular | Sentence case |
| Label/Caption | 12-14px | 500/Medium | Uppercase, tracked |
| Button | 14-16px | 600/Semi-bold | Uppercase |

### Typography Examples

```css
/* Hero Title */
.hero-title {
  font-size: clamp(80px, 15vw, 200px);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 0.85;
}

/* Section Heading */
.section-heading {
  font-size: clamp(36px, 6vw, 72px);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.01em;
}

/* Body Text */
.body-text {
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0.01em;
}

/* Accent/Emphasis */
.accent-text {
  font-style: italic;
  color: var(--accent);
}

/* Label */
.label {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

---

## Components

### Navigation

**Header**
- Fixed position
- Transparent background with backdrop blur on scroll
- Logo left-aligned (stacked "LANDO NORRIS" wordmark)
- Centered monogram/icon
- Store button (accent color) and menu hamburger right-aligned

**Store Button**
```css
.store-button {
  background: #BEFF00;
  color: #000000;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
}
```

**Menu Button**
```css
.menu-button {
  width: 56px;
  height: 56px;
  background: transparent;
  border: 2px solid currentColor;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Cards

**Info Card (Dark Theme)**
```css
.info-card {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0; /* Sharp corners */
  padding: 24px;
}

.info-card-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.info-card-value {
  font-size: 24px;
  font-weight: 600;
}
```

**Stat Card**
```css
.stat-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 48px;
  font-weight: 900;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.7;
}
```

### Buttons

**Primary CTA**
```css
.btn-primary {
  background: #BEFF00;
  color: #000000;
  padding: 16px 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(190, 255, 0, 0.3);
}
```

**Text Link**
```css
.text-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid currentColor;
  padding-bottom: 4px;
}
```

---

## Layout Patterns

### Hero Section
- Full viewport height (100vh)
- Large portrait imagery
- Overlapping/layered elements
- Animated/interactive elements (floating visor)
- Organic background patterns (topographic-style curves)

```css
.hero {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.hero-image {
  position: absolute;
  inset: 0;
  object-fit: cover;
}

.hero-content {
  position: relative;
  z-index: 10;
  padding: 0 5vw;
}
```

### Split Layout
- Two-column asymmetric layouts
- Image on one side, content on other
- Large typography spanning both sections

```css
.split-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  gap: 0;
}

@media (max-width: 768px) {
  .split-section {
    grid-template-columns: 1fr;
  }
}
```

### Marquee/Carousel
- Horizontal scrolling partner logos
- Auto-scrolling with hover pause
- Grayscale logos that colorize on hover

```css
.marquee {
  display: flex;
  gap: 60px;
  animation: scroll 30s linear infinite;
}

.marquee img {
  height: 32px;
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.3s;
}

.marquee img:hover {
  filter: grayscale(0%);
  opacity: 1;
}

@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

---

## Motion & Animation

### Principles
- Smooth, premium-feeling transitions
- Subtle hover states
- Scroll-triggered reveals
- Parallax depth effects
- Interactive elements respond to user input

### Timing Functions
```css
:root {
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-in-out-expo: cubic-bezier(0.87, 0, 0.13, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Common Animations

**Fade In Up**
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.8s var(--ease-out-expo) forwards;
}
```

**Scale In**
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

**Staggered Entry**
```css
.stagger > * {
  animation: fadeInUp 0.6s var(--ease-out-expo) forwards;
  opacity: 0;
}

.stagger > *:nth-child(1) { animation-delay: 0.1s; }
.stagger > *:nth-child(2) { animation-delay: 0.2s; }
.stagger > *:nth-child(3) { animation-delay: 0.3s; }
/* ... */
```

---

## Backgrounds & Textures

### Organic Pattern
The site uses subtle topographic/organic curve patterns as background decoration:

```css
.organic-bg {
  background-image: url("data:image/svg+xml,..."); /* Curved lines SVG */
  background-size: cover;
  background-position: center;
  opacity: 0.15;
}
```

### Gradient Overlays
```css
.gradient-dark {
  background: linear-gradient(
    180deg,
    rgba(17, 17, 17, 0) 0%,
    rgba(17, 17, 17, 0.8) 50%,
    rgba(17, 17, 17, 1) 100%
  );
}

.gradient-light {
  background: linear-gradient(
    180deg,
    rgba(245, 245, 240, 0) 0%,
    rgba(245, 245, 240, 1) 100%
  );
}
```

---

## Iconography

### Style Guidelines
- Line icons with 2px stroke
- Rounded line caps and joins
- Consistent sizing (24px default)
- Match text color

### Custom Icons
- LN4 monogram (center of header)
- Shopping bag icon
- Hamburger menu (two horizontal lines)
- Social media icons (TikTok, Instagram, YouTube, Twitch)
- Arrow indicators

---

## Footer

```css
.footer {
  padding: 80px 5vw;
}

.footer-nav {
  display: flex;
  gap: 32px;
  margin-bottom: 40px;
}

.footer-nav a {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-social {
  display: flex;
  gap: 24px;
}

.footer-legal {
  font-size: 12px;
  opacity: 0.6;
  margin-top: 60px;
}
```

---

## Responsive Breakpoints

```css
/* Mobile First */
:root {
  --container-padding: 20px;
}

/* Tablet */
@media (min-width: 768px) {
  :root {
    --container-padding: 40px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  :root {
    --container-padding: 5vw;
  }
}

/* Large Desktop */
@media (min-width: 1440px) {
  :root {
    --container-padding: 80px;
  }
}
```

---

## Application to College Counseling Platform

Here's how these design principles could be adapted:

### Color Adaptation
| Lando Norris | College Counseling Adaptation |
|--------------|------------------------------|
| Neon Lime `#BEFF00` | Could use a vibrant but more academic tone - Electric Blue `#0066FF`, Coral `#FF6B4A`, or Emerald `#10B981` |
| Black/White contrast | Keep the high-contrast approach for readability |
| Cream background | Warm, welcoming feel works well for education |

### Typography Adaptation
- Use bold condensed display fonts for headlines (creates excitement about college journey)
- Keep clean, readable sans-serif for body (important for lengthy content)
- Consider adding a friendly, approachable serif for quotes/testimonials

### Component Ideas
- **Progress Cards**: Use the card style for tracking application stages
- **University Stats**: Adapt stat cards for acceptance rates, deadlines, etc.
- **Timeline**: Use the horizontal scroll for college application timeline
- **Student Profiles**: Apply the split layout for student success stories

### Motion for Engagement
- Celebrate milestones (submitted applications, acceptances)
- Smooth transitions between application stages
- Progress animations for checklists

---

## Resources & Inspiration

- **Website**: [landonorris.com](https://landonorris.com/)
- **Page Variants**: On Track (dark theme), Off Track (light theme)
- **Key Elements**: Interactive hero, animated visor, partner marquee, helmet gallery

---

*Design system extracted November 2025*


---
version: alpha
name: Apple
description: |
  Apple's design system embodies minimalist elegance paired with human-centered
  warmth. The visual identity centers on clean typography, abundant whitespace,
  and a carefully curated color palette that balances achromatic neutrality with
  a distinctive bright blue accent. The interface prioritizes clarity and
  accessibility, using large, confident typography and generous spacing to
  create an intuitive, premium feel. The system avoids visual noise, instead
  relying on color-blocking and subtle interactions to guide attention. Product
  photography and human imagery play a central role in storytelling, with the
  interface stepping back to showcase content. This creates an environment that
  feels both sophisticated and approachable—professional without being cold.
source:
  url: "https://www.apple.com/"
  pagesAnalyzed: 1
  extractedAt: 2026-09-08
  tokensMeasured: true
colors:
  primary: "#1D1D1F"
  accent: "#2997FF"
  canvas: "#FFFFFF"
  surface: "#F5F5F7"
  on-primary: "#FFFFFF"
  ink: "#000000"
  body: "#1D1D1F"
  muted: "#6E6E73"
  faint: "#F5F5F7"
  accent-1: "#0066CC"
  accent-2: "#0071E3"
  accent-3: "#5E7EAF"
  neutral-1: "#333336"
  neutral-2: "#D2D2D7"
typography:
  display-lg:
    fontFamily: "SF Pro Display"
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.07
    letterSpacing: -0.28px
  display-md:
    fontFamily: "SF Pro Display"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0px
  heading:
    fontFamily: "SF Pro Display"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.14
    letterSpacing: 0.2px
  body-xl:
    fontFamily: "SF Pro Display"
    fontSize: 21px
    fontWeight: 400
    lineHeight: 1.19
    letterSpacing: 0.23px
  body-xl-strong:
    fontFamily: "SF Pro Display"
    fontSize: 21px
    fontWeight: 700
    lineHeight: 1.19
    letterSpacing: 0.23px
  body-lg:
    fontFamily: "SF Pro Text"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.18
    letterSpacing: -0.37px
  body-md:
    fontFamily: "SF Pro Text"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.29
    letterSpacing: -0.22px
  body-sm:
    fontFamily: "SF Pro Text"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.12px
  body-sm-loose:
    fontFamily: "SF Pro Text"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: -0.12px
  button-md:
    fontFamily: "SF Pro Text"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 2.41
    letterSpacing: 0px
  button-md-tight:
    fontFamily: "SF Pro Text"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 2.12
    letterSpacing: 0px
  caption:
    fontFamily: "SF Pro Text"
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: -0.12px
rounded:
  none: 0px
  xs: 8px
  sm: 11px
  full: 9999px
spacing:
  xxs: 8px
  xs: 12px
  sm: 16px
  md: 20px
  lg: 24px
  xl: 28px
  xxl: 32px
  xxxl: 40px
  section: 44px
  band: 48px
elevationStrategy: color-blocking
themes:
  derived: dark   # the other theme is the site's measured palette
  light:
    bg: "#FFFFFF"
    surface: "#F5F5F7"
    surfaceRaised: "#EBEBED"
    text: "#000000"
    textMuted: "#1D1D1F"
    border: "#E0E0E0"
    accent: "#2997FF"
    accentFg: "#000000"
    focusRing: "#2997FF"
    elevation: shadow
  dark:
    bg: "#0A0F15"
    surface: "#191D23"
    surfaceRaised: "#25292F"
    text: "#F6FBFF"
    textMuted: "#9CA1A6"
    border: "#31353A"
    accent: "#2997FF"
    accentFg: "#0B0B0C"
    focusRing: "#2997FF"
    elevation: "border+surface"
components:
  button-filled:
    typography: "{typography.button-md}"
    textColor: "rgba(0, 0, 0, 0.8)"
    border: "3px solid rgba(0, 0, 0, 0.04)"
    height: 42px
    padding: "0px 14px 0px 14px"
    rounded: "{rounded.sm}"
    backgroundColor: "rgb(250, 250, 252)"
  button-filled-sm:
    typography: "{typography.body-lg}"
    textColor: "{colors.ink}"
    height: 20px
    padding: "11px 21px 11px 21px"
    rounded: 980px
    backgroundColor: "{colors.surface}"
  button-primary:
    typography: "{typography.body-md}"
    textColor: "{colors.on-primary}"
    height: 36px
    padding: "8px 15px 8px 15px"
    rounded: "{rounded.xs}"
    backgroundColor: "{colors.primary}"
  button-icon:
    textColor: "rgba(0, 0, 0, 0.48)"
    height: 24px
    fontSize: 17px
    fontFamily: "SF Pro Text"
    fontWeight: 400
    lineHeight: 1.47
    rounded: "50%"
    backgroundColor: "rgba(210, 210, 215, 0.64)"
  card:
    typography: "{typography.body-sm-loose}"
    textColor: "rgba(0, 0, 0, 0.56)"
  navigation:
    textColor: "{colors.body}"
    height: 44px
    fontSize: 17px
    fontFamily: "SF Pro Text"
    fontWeight: 400
    lineHeight: 1.47
    backgroundColor: "rgba(255, 255, 255, 0.8)"
  footer:
    typography: "{typography.body-sm-loose}"
    textColor: "rgba(0, 0, 0, 0.56)"
    backgroundColor: "{colors.surface}"
  link:
    textColor: "{colors.accent}"
    fontSize: 17px
    fontFamily: "SF Pro Text"
    fontWeight: 400
    lineHeight: 1.47
    backgroundColor: "{colors.ink}"
  link-lg:
    textColor: "{colors.accent}"
    fontSize: 17px
    fontFamily: "SF Pro Text"
    fontWeight: 400
    lineHeight: 1.47
states:
  button-focus-visible:
    target: button
    state: focus-visible
    opacity: 1
  link-hover:
    target: link
    state: hover
    textDecoration: none
  link-focus:
    target: link
    state: focus
    outline: none
  nav-hover:
    target: nav
    state: hover
    opacity: 1
  button-hover:
    target: button
    state: hover
    opacity: 1
  button-active:
    target: button
    state: active
    outline: none
  other-hover:
    target: other
    state: hover
    textColor: "{colors.ink}"
  other-focus-visible:
    target: other
    state: focus-visible
    outline: none
  link-focus-visible:
    target: link
    state: focus-visible
    outline: none
  other-focus:
    target: other
    state: focus
    outline: none
  link-disabled:
    target: link
    state: disabled
    textDecoration: none
  card-hover:
    target: card
    state: hover
    textDecoration: none
  other-active:
    target: other
    state: active
    outline: none
breakpoints:
  - width: 375
    containerWidth: 343
    gridColumns: 3
    navLinksVisible: 14
    menuToggleVisible: true
    headingPx: 32
    bodyPx: 17
    sectionPaddingX: 0
  - width: 768
    containerWidth: 736
    gridColumns: 3
    navLinksVisible: 3
    menuToggleVisible: true
    headingPx: 48
    bodyPx: 17
    sectionPaddingX: 12
  - width: 1024
    containerWidth: 980
    gridColumns: 3
    navLinksVisible: 78
    menuToggleVisible: true
    headingPx: 48
    bodyPx: 17
    sectionPaddingX: 12
  - width: 1280
    containerWidth: 980
    gridColumns: 3
    navLinksVisible: 78
    menuToggleVisible: true
    headingPx: 56
    bodyPx: 17
    sectionPaddingX: 12
  - width: 1440
    containerWidth: 980
    gridColumns: 3
    navLinksVisible: 78
    menuToggleVisible: true
    headingPx: 56
    bodyPx: 17
    sectionPaddingX: 12
coverage:
  statesFound: 61
  gradientsFound: 0
  rolesUnassigned: 5
  archetypesUnnamed: 0
  archetypesDetected: 0
  responsiveMeasured: true
  stylesheetsBlocked: false
  semanticRampDeclared: false
---

# Design System Inspired by Apple

## 1. Visual Theme & Atmosphere

Apple's design system embodies minimalist elegance paired with human-centered warmth. The visual identity centers on clean typography, abundant whitespace, and a carefully curated color palette that balances achromatic neutrality with a distinctive bright blue accent. The interface prioritizes clarity and accessibility, using large, confident typography and generous spacing to create an intuitive, premium feel. The system avoids visual noise, instead relying on color-blocking and subtle interactions to guide attention. Product photography and human imagery play a central role in storytelling, with the interface stepping back to showcase content. This creates an environment that feels both sophisticated and approachable—professional without being cold.

**Key Characteristics**
- Minimalist, whitespace-driven layouts with clear visual hierarchy
- Achromatic primary palette anchored by deep charcoal and pure white
- Bright blue accent (`{colors.accent}` — `#2997FF`) used sparingly for CTAs and interactive states
- Large, bold typography in SF Pro typeface family
- Pill-shaped and rounded interactive elements (`{rounded.full}`, `{rounded.sm}`)
- Color-blocking elevation strategy; depth via surface color shifts, not shadows
- Generous padding and spacing (`{spacing.lg}` through `{spacing.band}`)
- Touch-friendly interactive targets and generous hit areas
- Translucent navigation (`{colors.primary}` at 80% opacity)
- Global nav and footer dominate the spatial structure

## 2. Color Palette & Roles

### Primary
- **Primary** (`{colors.primary}` — `#1D1D1F`): Deep charcoal used for body copy, headings, primary CTAs, active states, and the primary navigation bar. Conveys confidence and serves as the brand's visual anchor.

### Accent Colors
- **Brand Accent** (`{colors.accent}` — `#2997FF`): Vibrant blue used for secondary actions, links on dark backgrounds, and to signal interactivity. This is Apple's distinctive call-to-action hue.
- **Accent Decorative 1** (`{colors.accent-1}` — `#0066CC`): Deeper blue; unassigned role, used decoratively on the page.
- **Accent Decorative 2** (`{colors.accent-2}` — `#0071E3`): Mid-tone blue; unassigned role, reserved for focus states in some contexts.
- **Accent Decorative 3** (`{colors.accent-3}` — `#5E7EAF`): Muted blue-gray; unassigned role, appears as a subtle decorative shade.

### Neutral Scale
- **Canvas** (`{colors.canvas}` — `#FFFFFF`): Pure white page background; also used as label color on brand surfaces and primary CTAs.
- **Surface** (`{colors.surface}` — `#F5F5F7`): Very light gray for secondary containers, cards, and tertiary UI elements. Creates visual separation without harsh contrast.
- **Ink** (`{colors.ink}` — `#000000`): Pure black reserved for headings and primary text emphasis in high-contrast contexts.
- **Muted** (`{colors.muted}` — `#6E6E73`): Medium gray for captions, secondary text, and tertiary information. Maintains legibility while signaling reduced emphasis.
- **Neutral 1** (`{colors.neutral-1}` — `#333336`): Dark neutral used for subtle dividers and secondary containers.
- **Neutral 2** (`{colors.neutral-2}` — `#D2D2D7`): Light neutral used for borders and subtle separation lines.

## 3. Typography Rules

### Font Family
**Primary:** SF Pro Display (display and heading sizes)  
**Secondary:** SF Pro Text (body, buttons, captions)  
**Fallback stack:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| Display Large | SF Pro Display | 56px | 400 | auto | 0.004em | Hero and section headlines at 1280px+ |
| Display Medium | SF Pro Display | 48px | 400 | auto | 0.003em | Section headlines at 768px–1024px |
| Display Small | SF Pro Display | 32px | 400 | auto | 0.002em | Mobile section headlines at 375px |
| Heading Large | SF Pro Display | 28px | 400 | auto | 0.002em | Major section dividers |
| Heading Medium | SF Pro Text | 20px | 600 | auto | 0.002em | Card titles and subsection heads |
| Body Large | SF Pro Text | 17px | 400 | 1.47 | 0.007em | Primary body copy; navigation links; CTAs |
| Body Medium | SF Pro Text | 17px | 400 | 1.47 | 0.007em | Inherited body default across most text nodes |
| Body Small | SF Pro Text | 12px | 400 | 1.33 | 0.005em | Captions, secondary metadata, footer text |
| Button | SF Pro Text | 14px | 400 | 1.29 | 0.007em | Primary button labels and inline CTAs |
| Code | SF Pro Text | 12px | 400 | 1.33 | 0.005em | Monospace context (code snippets, SKUs) |

### Principles
- All text uses SF Pro typeface family, which optimizes readability across Apple platforms and maintains visual consistency.
- Display sizes employ tighter line heights (auto/inherit) to maintain visual compactness and elegance.
- Body text uses a consistent 1.47 line height (`25px` for 17px type) to ensure comfortable reading rhythm.
- Letter spacing is minimal, with negative tracking (`0.002em`–`0.007em`) on display sizes to tighten hierarchy and emphasize impact.
- Font weights remain primarily 400 (regular), with 600 (semibold) reserved for emphasis in headings and button text.
- Captions and metadata use smaller sizes (`12px`) at slightly tighter leading to conserve space while maintaining legibility.

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background:** `{colors.primary}` (`#1D1D1F`)
- **Text Color:** `{colors.canvas}` (`#FFFFFF`)
- **Font:** SF Pro Text, 14px, 400 weight
- **Padding:** `8px 15px`
- **Height:** `36px`
- **Border Radius:** `{rounded.xs}` (`8px`)
- **Border:** None
- **Box Shadow:** None
- **Line Height:** `18px`
- **Hover State:** Color lightens (opacity increases on text); border remains transparent
- **Active State:** Outline removed; color darkens further
- **Focus State:** `2px solid {colors.accent-2}` (`#0071E3`) outline
- **Disabled State:** Opacity reduced per disabled opacity scale

#### Secondary/Filled Button
- **Background:** `{colors.surface}` (`#F5F5F7`)
- **Text Color:** `{colors.primary}` (`#1D1D1F`)
- **Font:** SF Pro Text, 17px, 400 weight
- **Padding:** `0px 14px`
- **Height:** `42px`
- **Border Radius:** `{rounded.sm}` (`11px`)
- **Border:** `3px solid rgba(0, 0, 0, 0.04)`
- **Box Shadow:** None
- **Line Height:** `41px`
- **Width:** `349px` (measured; may vary in context)
- **Hover State:** Color and border remain; opacity on hover increases slightly
- **Active State:** Outline none; color transition applied
- **Focus State:** Outline removed or styled per context

#### Pill Button (Small)
- **Background:** `{colors.surface}` (`#F5F5F7`)
- **Text Color:** `{colors.primary}` (`#000000`)
- **Font:** SF Pro Text, 17px, 400 weight
- **Padding:** `11px 21px`
- **Height:** `20px`
- **Border Radius:** `{rounded.full}` (`9999px`)
- **Border:** `1px solid rgba(0, 0, 0, 0)` (transparent)
- **Box Shadow:** None
- **Line Height:** `20px`
- **Hover State:** Background and text respond to hover with color shifts

#### Icon Button
- **Background:** `rgba(210, 210, 215, 0.64)`
- **Text Color:** `rgba(0, 0, 0, 0.48)`
- **Size:** `24px × 24px`
- **Border Radius:** `50%` (circular)
- **Padding:** `0px`
- **Font Size:** 17px
- **Line Height:** `25px`
- **Hover State:** Opacity and color shift
- **No visible border or shadow**

### Cards & Containers

#### Default Card
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `rgba(0, 0, 0, 0.56)` (muted)
- **Font:** SF Pro Text, 12px, 400 weight
- **Padding:** `0px` (no internal spacing)
- **Border Radius:** `{rounded.none}` (`0px`)
- **Border:** None
- **Box Shadow:** None
- **Line Height:** `16px`
- **Width/Height:** Auto
- **Hover State:** Text decoration removed; no visual change

#### Surface Container
- **Background:** `{colors.surface}` (`#F5F5F7`)
- **Border Radius:** `{rounded.none}` (`0px`)
- **No shadow; color blocking provides elevation**
- **Used for footer, secondary panels, and content regions**

### Navigation

#### Global Navigation Bar
- **Background:** `rgba(255, 255, 255, 0.8)` (translucent white)
- **Text Color:** `{colors.primary}` (`#1D1D1F`)
- **Font:** SF Pro Text, 17px, 400 weight
- **Height:** `44px`
- **Padding:** `0px`
- **Border:** None
- **Box Shadow:** None
- **Line Height:** `25px`
- **Width:** Full viewport
- **Link Hover State:** Color changes to context-specific hover color (black on light, white on dark); text-decoration removed in most cases
- **Focus State (Links):** `2px solid {colors.accent-2}` (`#0071E3`) outline
- **Focus State (Links, Alt):** Outline none in some contexts (focus removed)
- **Menu Toggle:** Appears on smaller viewports (768px and below)

### Links

#### Default Link
- **Color:** `{colors.accent}` (`#2997FF`)
- **Font:** SF Pro Text, 17px, 400 weight
- **Text Decoration:** None (underline applied on hover in some contexts)
- **Line Height:** `25px`
- **Hover State:** Color changes to `#0066CC` or remains blue; text-decoration toggles to underline in certain contexts
- **Focus State:** `2px solid {colors.accent-2}` (`#0071E3`) outline
- **Focus State (Alt):** Outline none in some components
- **Disabled State:** Opacity reduced to `0.42`

### Inputs & Forms
- **Focus Outline:** `2px solid {colors.accent-2}` (`#0071E3`)
- **No visible extraction of input styling beyond focus state; refer to Known Gaps**

## 5. Layout Principles

### Spacing System
**Base Unit:** `8px`

**Scale:**
- **XXS:** `{spacing.xxs}` = `8px` — Small gaps between inline elements
- **XS:** `{spacing.xs}` = `12px` — Tight grouping; labels and metadata
- **SM:** `{spacing.sm}` = `16px` — Standard gutters and card padding
- **MD:** `{spacing.md}` = `20px` — Medium section dividers; button grouping
- **LG:** `{spacing.lg}` = `24px` — Section spacing and card margins
- **XL:** `{spacing.xl}` = `28px` — Large block separators
- **XXL:** `{spacing.xxl}` = `32px` — Major section boundaries
- **XXXL:** `{spacing.xxxl}` = `40px` — Dramatic whitespace between hero and content
- **Section:** `{spacing.section}` = `44px` — Vertical separation between major content blocks
- **Band:** `{spacing.band}` = `48px` — Largest spacing unit; used for full-width section padding

### Grid & Container
- **Max Width:** `980px` (content column; measured at 1024px+ breakpoints)
- **Columns:** 3-column grid (measured consistently across all breakpoints)
- **Section Padding (Horizontal):** `12px` at 768px+; `0px` at 375px (full-bleed mobile)
- **Container Strategy:** Centered, max-width constrained content with full-bleed hero sections and backgrounds; navigation and footer span full viewport width.

### Whitespace Philosophy
Apple's spacing strategy prioritizes breathing room and visual clarity. Large vertical gutters (`{spacing.band}` — `48px`) separate major sections, creating rhythm and preventing cognitive overload. Horizontal padding increases slightly at larger viewports (`12px` at 768px+) but disappears at mobile (`0px`), allowing content to stretch edge-to-edge. Inline spacing within components is tight (`{spacing.xs}` — `12px` for labels, `{spacing.sm}` — `16px` for card internals), ensuring dense information feels organized rather than cramped. This creates a hierarchy of emphasis: generous macro spacing draws focus to section shifts, while controlled micro spacing keeps related content cohesive.

### Border Radius Scale
- **None:** `{rounded.none}` = `0px` — Cards, images, overlays, buttons (primary and secondary); sharp edges create geometric crispness
- **Extra Small:** `{rounded.xs}` = `8px` — Primary buttons and small containers; subtle rounding adds approachability
- **Small:** `{rounded.sm}` = `11px` — Secondary/filled buttons; mid-tone rounding bridges sharp and full
- **Full:** `{rounded.full}` = `9999px` — Pill-shaped secondary buttons; maximum roundness for softest affordance

## 6. Depth & Elevation

Apple's design system relies on **color-blocking** rather than shadows for depth. Elevation is communicated through surface color changes—lighter or contrasting backgrounds lift visually without requiring shadow geometry. This approach maintains clarity and simplicity while supporting a hierarchy of visual layers.

| Level | Treatment | Use |
|---|---|---|
| Flat (Base) | `{colors.canvas}` (`#FFFFFF`) or transparent | Default page background, primary interactive elements |
| Lifted (Secondary) | `{colors.surface}` (`#F5F5F7`) or `{colors.neutral-1}` (`#333336`) | Cards, containers, footer, secondary navigation, and panelized content |
| Emphasis (Tertiary) | Accent or primary color with opacity shift | Highlight important sections, call-to-action backgrounds, active states |

**Shadow Philosophy:**  
No drop shadows are used in this system. Depth derives purely from color contrast and foreground/background relationships. This maintains the minimalist aesthetic and ensures the interface remains clean and flat, with emphasis placed on typography and color as the primary depth cues.

### Opacity Levels
- **36%:** `0.36` — Used for muted text and secondary information (e.g., `rgba(0, 0, 0, 0.36)` for reduced-emphasis text)
- **80%:** `0.80` — Applied to translucent surfaces (e.g., navigation bar at `rgba(255, 255, 255, 0.8)`)

### Z-index / Layering

| Layer | Z-Index | Use |
|---|---|---|
| Base | 1–5 | Default content, cards, body elements |
| Modal | 9998–9999 | Overlays, dialogs, expanded menus; sits above all base content |
| Toast | 10000 | Notifications and alerts; topmost layer |

## 7. Do's and Don'ts

### Do
- **Use the SF Pro typeface family** (Display for headlines, Text for body) to maintain Apple's visual identity and platform integration.
- **Prioritize whitespace.** Generous padding (`{spacing.lg}` — `{spacing.band}`) separates sections and improves scannability.
- **Apply color-blocking for elevation.** Shift surface colors (`{colors.surface}`) rather than adding shadows to create depth.
- **Keep border-radius sharp on primary components** (`{rounded.none}` for cards and images) but embrace pills (`{rounded.full}`) for secondary actions.
- **Reserve the bright accent** (`{colors.accent}` — `#2997FF`) for interactive elements and CTAs; use sparingly to maintain impact.
- **Stack focus states consistently:** `2px solid {colors.accent-2}` (`#0071E3`) outline for keyboard navigation.
- **Design for touch:** Ensure buttons and interactive targets measure at least `36px` × `36px` for comfortable tapping on mobile.
- **Use translucent surfaces** (e.g., nav at `80%` opacity) to create sophistication without visual weight.
- **Center content on larger screens** within the `980px` max-width container.
- **Test responsively:** Mobile is full-bleed (`0px` padding), tablet and desktop add `12px` horizontal padding.

### Don't
- **Avoid multiple shadow layers.** This system uses none; depth comes from color alone.
- **Don't use heavy drop shadows** or glow effects; they conflict with the minimalist aesthetic.
- **Avoid cluttering the navigation bar.** Keep text items concise and spacing generous.
- **Don't round primary buttons** beyond `{rounded.xs}` (`8px`); primary actions remain geometric.
- **Avoid semantic status colors** (error red, success green, warning yellow). This system provides none; use neutral tones and clear iconography instead.
- **Don't use the accent color** on neutral backgrounds; it reads as broken or disabled. Reserve it for interactive CTAs.
- **Avoid mixing font families.** Stick to SF Pro Display and SF Pro Text; fallback to system fonts if needed.
- **Don't apply borders to buttons** unless specified in a variant; rely on background color for definition.
- **Avoid centering all text.** Body copy remains left-aligned (`text-align: left`) for optimal readability.
- **Don't force fixed heights** on text containers; allow line-height and padding to define space.

## 8. Responsive Behavior

### Breakpoints

| Viewport | Content Width | Grid Columns | Nav Links Visible | Menu Toggle | Display Heading | Body Text | Section Padding-X |
|---|---|---|---|---|---|---|---|
| 375px (Mobile) | 343px | 3 | 14 | Yes | 32px (`{typography.display-small}`) | 17px (`{typography.body-medium}`) | 0px (full-bleed) |
| 768px (Tablet) | 736px | 3 | 3 | Yes | 48px (`{typography.display-medium}`) | 17px (`{typography.body-medium}`) | 12px |
| 1024px (Small Desktop) | 980px | 3 | 78 | Yes (available) | 48px (`{typography.display-medium}`) | 17px (`{typography.body-medium}`) | 12px |
| 1280px (Desktop) | 980px | 3 | 78 | No | 56px (`{typography.display-large}`) | 17px (`{typography.body-medium}`) | 12px |
| 1440px (Large Desktop) | 980px | 3 | 78 | No | 56px (`{typography.display-large}`) | 17px (`{typography.body-medium}`) | 12px |

**Breakpoint Definition:**
- **375px:** Mobile first; no horizontal padding, full-bleed content.
- **768px:** Tablet; horizontal padding introduced (`12px`), navigation collapses to 3 visible links.
- **1024px–1440px:** Desktop; max-width container (`980px`), all navigation visible; display sizes shift from 48px to 56px at 1280px+.

### Touch Targets
- **Minimum interactive size:** `36px × 36px` for buttons, links, and form controls
- **Icon buttons:** Measure `24px × 24px` (measured); wrapped in padding to reach `36px` zone
- **Button padding:** `8px` vertical, `15px` horizontal (primary); `11px` vertical, `21px` horizontal (pill-shaped secondary)
- **Spacing between targets:** Minimum `8px` (`{spacing.xxs}`) to prevent accidental activation

### Collapsing Strategy
- **Mobile (375px):** Full-width content; navigation menu collapses to icon toggle; headlines reduce to `32px`; no horizontal padding (edge-to-edge bleed).
- **Tablet (768px):** Horizontal padding introduced (`12px`); headline size increases to `48px`; navigation shows 3 critical links with menu toggle available.
- **Desktop (1024px+):** Content constrained to `980px` max-width and centered; all navigation visible; display sizes increase to `56px` at 1280px+; generous section padding (`{spacing.band}` — `48px`).
- **Transition points:** Media queries trigger at viewport width changes; layout reflows but component styling (border-radius, font-weight) remains consistent.

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA:** Primary (`{colors.primary}` — `#1D1D1F`, text on white; or white text on primary background)
- **Interactive Accent:** Brand Accent (`{colors.accent}` — `#2997FF` for links and secondary actions)
- **Background (Default):** Canvas (`{colors.canvas}` — `#FFFFFF`)
- **Background (Secondary):** Surface (`{colors.surface}` — `#F5F5F7`)
- **Heading Text:** Primary or Ink (`{colors.primary}` — `#1D1D1F` or `{colors.ink}` — `#000000`)
- **Body Text:** Primary (`{colors.primary}` — `#1D1D1F`) at full opacity
- **Secondary Text:** Muted (`{colors.muted}` — `#6E6E73`)
- **Focus Outline:** Accent Decorative 2 (`{colors.accent-2}` — `#0071E3`, `2px solid`)
- **Focus Color (Alternate):** Brand Accent (`{colors.accent}` — `#2997FF`)

### Iteration Guide

1. **Use SF Pro typeface exclusively.** SF Pro Display for headlines (`{typography.display-*}`), SF Pro Text for body and buttons (`{typography.body-*}`, `{typography.button}`). Fallback to system fonts if unavailable.

2. **Apply color-blocking for visual hierarchy.** Surfaces use `{colors.surface}` (`#F5F5F7`) to lift above `{colors.canvas}` (`#FFFFFF`). No shadows; use color only.

3. **Respect border-radius roles.** Primary buttons and cards: `{rounded.xs}` (`8px`). Secondary buttons: `{rounded.sm}` (`11px`). Pill-shaped actions: `{rounded.full}` (`9999px`). Images and overlays: `{rounded.none}` (`0px`).

4. **Spacing hierarchy:** Micro spacing (`{spacing.xs}` — `12px`, `{spacing.sm}` — `16px`) binds components; macro spacing (`{spacing.lg}` — `24px` through `{spacing.band}` — `48px`) separates sections. Maintain 1.5–2× scale between levels.

5. **Typography hierarchy via size, not weight.** Headings range from `32px` (mobile) to `56px` (desktop); body remains `17px`. Font-weight stays `400` (regular) except emphasized headings (`600`). Use letter-spacing (`0.002em`–`0.007em` negative) on display sizes.

6. **Interactive states:** Focus states apply `2px solid {colors.accent-2}` (`#0071E3`) outline. Hover states shift opacity or color slightly (e.g., text color to `rgb(0, 102, 204)` or background to lighter shade). Active states reduce opacity or scale. Disabled states use reduced opacity.

7. **Responsive content:** Mobile layout is full-bleed (`0px` padding), single-column. Tablet introduces `12px` horizontal padding; desktop constrains to `980px` max-width. Navigation collapses to toggle at 768px. Display headline size increases to `56px` at 1280px+.

8. **Navigation bar styling:** Background is translucent white (`rgba(255, 255, 255, 0.8)`), height `44px`, text color `{colors.primary}` (`#1D1D1F`). Links hover with color shift; focus outlines are `2px solid {colors.accent-2}` (`#0071E3`).

9. **Opacity scales:** Use `0.36` for muted elements, `0.80` for translucent surfaces (e.g., navigation). Disabled states reduce to `0.42` or lower per component.

10. **Z-index layering:** Base content at 1–5, modals at 9998–9999, toasts at 10000. Ensure modals and notifications appear above all other content.

## 10. Known Gaps

- **No semantic status colors** (error red, success green, warning yellow, info blue) were extracted; the site does not expose a semantic ramp. Use neutral tones and clear iconography for feedback instead.
- **Interaction states (hover, active, focus, disabled)** are partially extracted (buttons, links, navigation); however, card hover states, input disabled states, and form validation styling were not fully captured. Refer to section 8 for provided states.
- **Form input styling** beyond focus outline was not extracted (e.g., placeholder text color, border colors, background on active/disabled states). Apply primary text color (`{colors.primary}`) and focus outline (`2px solid {colors.accent-2}`) as defaults.
- **Gradient or decorative mesh backgrounds** were not found. The system uses solid colors and color-blocking exclusively.
- **Dark mode or theme variants** were not measured. Only a single light theme is documented here.
- **5 accent colors** (`{colors.accent-1}`, `{colors.accent-2}`, `{colors.accent-3}`, plus two primary and accent neutrals) have no measurable role in the design; they are described as decorative only. Their exact usage may vary across other pages or contexts not captured in this extraction.
- **Animation and transition timing** (duration, easing, keyframes) were not extracted. Hover and active state CSS is present, but motion design specifics are not available.
- **Surfaces behind authentication** (login pages, account settings, checkout flows) were not visited and may employ different styling.
- **Component state combinations** (e.g., button disabled + focused, input error + focused) were not exhaustively captured. Apply state styles sequentially when combining conditions.
- **Shadow / depth treatment** beyond color-blocking was not extracted. The system appears to use color changes exclusively; if additional elevation is needed, refer to the color palette and avoid introducing shadows.
- **Grid column count** remains `3` across all measured breakpoints; no evidence of 2-column or 4-column layouts at larger viewports.
- **Letter-spacing values** on body sizes (`0.007em`) appear minimal; verify against rendered output to confirm no optical adjustments are needed beyond the stated values.

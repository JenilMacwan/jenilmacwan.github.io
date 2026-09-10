---
name: Jenil Macwan Portfolio
description: Native Android apps, built screen by screen.
colors:
  primary: "#56A8F5"
  primary-dim: "#4B93D6"
  primary-soft: "rgba(86, 168, 245, 0.15)"
  accent: "#F2A25C"
  accent-soft: "rgba(242, 162, 92, 0.15)"
  bg: "#1E1F22"
  surface: "#2B2D30"
  surface-dim: "#393B40"
  ink: "#DFE1E5"
  ink-soft: "#A9B0B7"
  ink-faint: "#6F737A"
  line: "#43454A"
typography:
  display:
    fontFamily: "'JetBrains Mono', monospace"
  body:
    fontFamily: "'Manrope', sans-serif"
  label:
    fontFamily: "'JetBrains Mono', monospace"
rounded:
  xl: "34px"
  lg: "20px"
  md: "14px"
  sm: "8px"
  xs: "2px"
  round: "999px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.round}"
    padding: "13px 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.round}"
    padding: "13px 24px"
  glass-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
---

# Design System: Jenil Macwan Portfolio

## Overview

**Creative North Star: "The Engineering Portfolio"**

Professional, crisp, and highly technical. The UI stays out of the way of the content and embraces a native IDE-inspired aesthetic. It relies on clean lines, a dark, coding-centric palette, and a structured layout to present native Android development skills.

**Key Characteristics:**
- Clean, structured, precise
- Professional and technical voice
- Highly legible monospace-forward typography
- JetBrains IDE-inspired dark theme

## Colors

The palette is professional and grounded, inspired by the dark themes of modern IDEs like Android Studio and IntelliJ.

### Primary
- **IDE Blue** (#56A8F5): The main brand color, used for primary actions, buttons, and text highlights.
- **IDE Blue Dim** (#4B93D6): Used for hover states on primary buttons.
- **IDE Blue Soft** (rgba(86, 168, 245, 0.15)): Used for backgrounds on chips and status pills.

### Secondary
- **IDE Orange** (#F2A25C): The accent color, used for mono text highlights, warnings, and active states.
- **IDE Orange Soft** (rgba(242, 162, 92, 0.15)): Used for backgrounds on supporting skill icons.

### Neutral
- **Background** (#1E1F22): The main page background.
- **Surface** (#2B2D30): The background for cards and panels.
- **Surface Dim** (#393B40): Used for secondary backgrounds and project icon containers.
- **Ink** (#DFE1E5): Primary text color.
- **Ink Soft** (#A9B0B7): Secondary text color for descriptions.
- **Ink Faint** (#6F737A): Tertiary text color for meta information.
- **Line** (#43454A): Used for borders and dividers.

### Named Rules
**The Content-First Rule.** The UI should never overshadow the work. Use accent colors sparingly to draw attention to interactive elements, not to decorate the page.

## Typography

**Display Font:** 'JetBrains Mono', monospace
**Body Font:** 'Inter', sans-serif
**Label/Mono Font:** 'JetBrains Mono', monospace

**Character:** A highly legible, technical pairing. JetBrains Mono provides a coding-centric, engineered feel for headlines and metadata, while Inter ensures maximum readability for body copy.

### Hierarchy
- **Display** (600, clamp(34px, 4.6vw, 54px), 1.08): Hero headlines.
- **Title** (600, clamp(24px, 3vw, 32px), normal): Section headings.
- **Body** (400, 17px / 15px, 1.65): Standard paragraph text.
- **Label** (normal, 12px / 10.5px, uppercase): Eyebrows, tags, and metadata.

### Named Rules
**The Mono Metadata Rule.** All metadata, tags, headings and technical details should use the monospace font to reinforce the developer aesthetic.

## Layout

**Container:** 1080px maximum width.
**Grid:** CSS Grid for structural layout (e.g., hero split, contact section).
**Spacing:** Generous vertical padding between sections (64px).

## Animation

**Philosophy:** Utilitarian and direct.
Animations are kept to an absolute minimum. We use quick transitions for hover states and simple reveals, mimicking the snappy response of native applications.

## Component Specifications

### Buttons
- **Primary:** Solid IDE Blue background, white text, fully rounded (999px).
- **Ghost:** Transparent background, Line color border, Ink color text, fully rounded (999px).

### Chips
- Used for technologies (e.g., Kotlin, Compose).
- Background: Surface Dim.
- Text: Ink Soft.
- Border radius: 8px (sm).

### Status Pill
- Used for availability ("Open to work").
- Background: Primary Soft.
- Text: Primary.
- Border radius: 999px (round).
- (Pulsing dot removed for a quieter UI)

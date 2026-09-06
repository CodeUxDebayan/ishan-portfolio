# Ishan Portfolio Web Application Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a world-class, high-performance 3D/2D graphic design portfolio web application for Ishan featuring a 3D Helical Spiral Slider, dynamic list view with autoplaying thumbnail previews, an interactive About hero with SVG gap-filling icons, interactive cursor icon trails, and seamless "Next Up" project sheet reveal physics.

**Architecture:** Next.js (App Router) with Tailwind CSS for high-end styling, Three.js / Canvas / Framer Motion for the 3D Helical Spiral Slider and fluid modal animations, and a local WebP optimized asset pipeline stored in `/public/projects/` for zero-lag 60fps rendering.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Three.js / @react-three/fiber / @react-three/drei, Lucide React, Lenis Smooth Scroll.

---

## Task 1: WebP Asset Optimization Pipeline

**Files:**

- Create: `scripts/optimize_assets.py`

- Output Directory: `public/projects/`

- Modify: `portfolio_db.json`

### Step 1: Write asset optimization script
Create `scripts/optimize_assets.py` to recursively scan `Portfolio/`, convert all 517 images to WebP format at 85% quality, save them in `/public/projects/`, and update `portfolio_db.json` relative paths to `/projects/...`.

### Step 2: Execute asset conversion
Run: `python scripts/optimize_assets.py`  
Expected: Converted WebP files generated in `public/projects/` with total size reduced from 937MB to ~60-90MB.

### Step 3: Commit asset optimization
Commit optimized assets and updated `portfolio_db.json`.

---

## Task 2: Next.js Project Scaffolding & Dependencies

**Files:**

- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`

- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

### Step 1: Initialize Next.js app in root
Configure Next.js 15 App Router project in root directory `e:\ISHAN PORTFOLIO`.

### Step 2: Install UI & 3D dependencies
Run: `npm install framer-motion three @react-three/fiber @react-three/drei lucide-react clsx tailwind-merge lenis`

### Step 3: Verify build setup
Run: `npm run build`  
Expected: Successful initial build without errors.

---

## Task 3: Design Tokens & Global Dark Grid Canvas

**Files:**

- Create/Modify: `src/app/globals.css`

- Create: `src/components/ui/GridBackground.tsx`

### Step 1: Define CSS Variables & Dark Mode Aesthetic
Setup background `#100F0C`, text color `#F2EEE5`, subtle grid lines overlay, font imports (Inter / Outfit), and custom scrollbars.

### Step 2: Build GridBackground component
Implement fixed canvas grid background matching reference site `pacomepertant.com`.

---

## Task 4: Header & View Toggle Component

**Files:**

- Create: `src/components/Header.tsx`

### Step 1: Implement Header component

- Logo: `ishan.` (minimalist white text, top-left).

- Center pill toggle: `spiral • list` controlling main view mode.

- Right button pill: `menu •` triggering Menu Modal overlay.

---

## Task 5: Expandable Menu Modal Component

**Files:**

- Create: `src/components/MenuOverlay.tsx`

### Step 1: Build MenuOverlay component

- Smooth scale/easing animation from button into full-screen white rounded card.

- Top-right close button `close (x)`.

- Large bold navigation links (`works`, `about`, `contact`).

- Bottom-left contact email (`hello@Ishan.design`).

- Bottom-right circular social media buttons (Instagram, X, Behance, LinkedIn).

---

## Task 6: 3D Helical Spiral Slider Component (`spiral` view)

**Files:**

- Create: `src/components/SpiralSlider.tsx`

- Create: `src/components/3d/HelixCanvas.tsx`

### Step 1: Implement 3D spatial helical curve calculation
Arrange project preview cards along a 3D cylindrical helix ($x = R \cos \theta$, $y = h \cdot \theta$, $z = R \sin \theta$).

### Step 2: Implement auto-play & scroll velocity physics

- Constant downward drift velocity.

- Mouse wheel / scroll velocity handling:
  - Scroll down $\rightarrow$ Accelerates downward flow.
  - Scroll up $\rightarrow$ Reverses flow upwards and accelerates.

- Card click handler $\rightarrow$ Opens Project Detail Modal.

---

## Task 7: List View Component (`list` view)

**Files:**

- Create: `src/components/ProjectListView.tsx`

### Step 1: Implement centered project list

- Vertical list of project names / categories.

- Hover state dims non-hovered items and highlights active item in crisp white.

### Step 2: Implement floating mouse-following autoplay thumbnail preview

- Floating rounded image card following cursor position.

- Auto-plays through project images (1 image per project cycling smoothly on hover).

---

## Task 8: Interactive About Page & Icon Trail

**Files:**

- Create: `src/app/about/page.tsx`

- Create: `src/components/AboutHero.tsx`

- Create: `src/components/IconTrail.tsx`

- Create: `src/components/WorkSlider.tsx`

### Step 1: Build About Hero with gap-filling icons
Bio text with spatial gaps that fill on hover with 3D/SVG icons (torus, hourglass, web sphere, star, arrow, cube).

### Step 2: Build Mouse Icon Trail component
Trailing arc of colorful 3D/SVG icons following mouse movement around social stacked links.

### Step 3: Build Horizontal Work Slider
Horizontal carousel below hero with hover overlay "View project" trigger button.

---

## Task 9: Project Detail Modal & "Next Up" Sheet Reveal Physics

**Files:**

- Create: `src/components/ProjectModal.tsx`

- Create: `src/components/NextProjectReveal.tsx`

### Step 1: Implement Project Modal Card
Light-themed card overlay over dark canvas displaying project hero title, description, metadata tags (`play !`, `see the case •`), and gallery grid.

### Step 2: Implement "Next Up" Sheet Reveal Physics

- Scrolling past modal bottom translates white card upwards, uncovering dark canvas underneath.

- Unveils Next Project preview card with badges: `next up...`, `keep scrolling !`, and `back to home`.

- Continued scrolling lifts and transitions seamlessly into the next project modal.

---

## Task 10: Final Verification & Production Build

**Files:**

- Audit: All components & pages

### Step 1: Run production build & linter
Run: `npm run build`  
Expected: Clean compilation with 0 errors.

### Step 2: Verify runtime performance
Validate 60fps animations, WebP image load speed, and responsive layout across desktop and mobile viewports.

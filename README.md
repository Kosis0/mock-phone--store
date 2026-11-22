# Specwise — Mock iPhone Store & Technical Index

A Next.js (App Router) web application showcasing iPhone models, technical specifications, hardware identifiers, and an interactive side-by-side comparison matrix.

Built for deployment on [Vercel](https://vercel.com).

## Features

- **Device Catalog**: Filter devices by series (Standard, Plus, Pro, Pro Max, SE, mini), refresh rate (60Hz vs 120Hz ProMotion), connector type (USB-C vs Lightning), and Apple Intelligence support.
- **Hardware Profile Pages (`/iphone/[slug]`)**: Deep-dive specification breakdown covering display, performance, camera array, battery, wireless standards, and regional model numbers.
- **Comparison Engine (`/compare`)**: Side-by-side spec comparison for up to 4 devices with dynamic differences highlighting and best-in-class performance badges.
- **Interactive Device Renders**: 3D CSS procedural device renders with customizable color finishes and Dynamic Island / notch details.
- **Fast Search**: Instant header lookup for iPhone names, chipsets, and model identifiers.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & custom design system
- **Hosting**: Vercel

## Local Development

```bash
# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deploying to Vercel

1. Push this repository to GitHub: `git push origin main`
2. Go to [vercel.com/new](https://vercel.com/new)
3. Select and import the `mock-phone--store` repository
4. Vercel will automatically detect Next.js framework settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install` or `pnpm install`
5. Click **Deploy**

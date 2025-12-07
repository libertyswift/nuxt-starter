# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt 3 starter project with shadcn-vue UI components, Tailwind CSS, and i18n internationalization. The project uses TypeScript and follows Nuxt 4 conventions with the `app/` directory structure.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate

# Lint code
npx eslint .
```

## Architecture

### Directory Structure

- `app/` - Main application directory (Nuxt 4 convention)
  - `app/components/` - Vue components
    - `app/components/ui/` - shadcn-vue UI components (Button, Input, etc.)
  - `app/layouts/` - Layout components
  - `app/pages/` - File-based routing pages
  - `app/lib/` - Utility functions (e.g., `cn()` for Tailwind class merging)
  - `app/assets/css/` - Global CSS including Tailwind
- `i18n/` - Internationalization configuration
  - `i18n/locales/` - Translation files (en.ts, ru.ts)
  - `i18n/i18n.config.ts` - i18n configuration

### Key Modules

The project uses these Nuxt modules:
- `@nuxtjs/i18n` - Internationalization (default: Russian, with English support)
- `@nuxtjs/tailwindcss` - Tailwind CSS integration
- `shadcn-nuxt` - shadcn-vue component library (New York style)
- `@nuxt/icon` - Icon component (uses Lucide icons)
- `@nuxt/image` - Image optimization
- `@nuxt/content` - Content management
- `@nuxt/eslint` - ESLint integration
- `@vueuse/nuxt` - VueUse composables

### Theming

The project uses:
- CSS variables for theming (HSL color format)
- Dark mode via `useColorMode()` composable
- Tailwind `dark:` class applied to `<html>` element (managed in default layout)
- shadcn color system (border, input, ring, background, foreground, primary, secondary, etc.)

### Internationalization

- Default locale: Russian (`ru`)
- Supported locales: English (`en`), Russian (`ru`)
- Strategy: `no_prefix` (no locale prefix in URLs)
- Access translations via `$t()` in templates or `t()` in composables
- Add new translations to `i18n/locales/en.ts` and `i18n/locales/ru.ts`

### shadcn-vue Components

- Component directory: `app/components/ui/`
- Configuration: `components.json`
- Utility function: `cn()` in `app/lib/utils.ts` for merging Tailwind classes
- Icon library: Lucide (use via `<Icon name="lucide:icon-name" />`)

### Alias Configuration

- `@/` → `./app/`
- Import example: `import { Button } from '~/components/ui/button'`

## Working with Components

When adding new shadcn-vue components:
1. Components are installed to `app/components/ui/`
2. Import from `~/components/ui/component-name`
3. Use the `cn()` utility for dynamic class merging

## Color Mode

The default layout (`app/layouts/default.vue`) manages dark mode by:
1. Watching `useColorMode()` value
2. Adding/removing `dark` class on `document.documentElement`
3. Tailwind applies `dark:` variants based on this class
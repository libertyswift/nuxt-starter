# Nuxt 3 Starter Kit

Modern Nuxt 3 starter project with shadcn-vue, Tailwind CSS, and internationalization support.

## Features

- **UI Framework**: shadcn-vue components with Tailwind CSS
- **Dark Mode**: Dark mode support with theme toggle
- **Internationalization**: i18n with Russian and English support
- **TypeScript**: Full TypeScript support
- **Nuxt 4**: Using new directory structure with `app/` folder
- **SEO**: Built-in SEO and meta tags support
- **Testing**: Vitest for unit tests, Playwright for E2E
- **Docker**: Ready-to-use containerization setup
- **ESLint**: Configured code linting
- **Icons**: Lucide icons via @nuxt/icon
- **VueUse**: Collection of useful composables

## Quick Start

### Requirements

- Node.js 18+ or 20+
- npm or pnpm

### Installation

```bash
# Clone repository
git clone git@github.com:libertyswift/nuxt-starter.git
cd nuxt-starter

# Install dependencies
npm install
```

### Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` as needed:

```env
# Site URL
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Getting Started

```bash
# Development mode (http://localhost:3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate

# Run linter
npx eslint .
```

## Project Structure

```
nuxt-starter/
├── app/                          # Main application directory (Nuxt 4)
│   ├── api/                      # API routes
│   │   └── hello.ts              # Example API endpoint
│   ├── assets/
│   │   └── css/
│   │       └── tailwind.css      # Tailwind base styles
│   ├── components/               # Vue components
│   │   └── ui/                   # shadcn-vue UI components
│   │       ├── button/           # Button component
│   │       ├── input/            # Input component
│   │       ├── label/            # Label component
│   │       └── ...               # Other UI components
│   ├── composables/              # Vue composables
│   ├── layouts/                  # Layouts
│   │   └── default.vue           # Default layout with dark mode
│   ├── lib/
│   │   └── utils.ts              # Utilities (cn function)
│   ├── pages/                    # Pages (file-based routing)
│   │   ├── index.vue             # Home page
│   │   ├── test.vue              # Test page
│   │   ├── posts.vue             # Examples with API requests
│   │   ├── posts-clean.vue       # Clean version
│   │   └── posts-mutations.vue   # With mutations
│   ├── plugins/                  # Nuxt plugins
│   ├── stores/                   # Pinia stores
│   ├── utils/                    # Utilities
│   └── app.vue                   # Root component
├── config/                       # Configuration files
├── i18n/                         # Internationalization
│   ├── locales/
│   │   ├── en.ts                 # English translations
│   │   └── ru.ts                 # Russian translations
│   └── i18n.config.ts            # i18n config
├── public/                       # Static files
├── server/                       # Server-side code
│   ├── api/                      # Server API routes
│   └── middleware/               # Server middleware
├── test/                         # Tests
│   ├── unit/                     # Unit tests
│   └── e2e/                      # E2E tests
├── .github/                      # GitHub Actions
│   └── workflows/
│       └── ci.yml                # CI/CD pipeline
├── components.json               # shadcn-vue config
├── nuxt.config.ts                # Nuxt configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── vitest.config.ts              # Vitest configuration
├── playwright.config.ts          # Playwright configuration
├── docker-compose.yml            # Docker Compose
├── Dockerfile                    # Docker image
└── package.json                  # Dependencies
```

## shadcn-vue Components

### Using Components

All UI components are located in `app/components/ui/` and are auto-imported:

```vue
<template>
  <div>
    <Button>Click me</Button>
    <Input v-model="value" placeholder="Enter text" />
  </div>
</template>
```

### Installing New Components

shadcn-vue components are installed into `app/components/ui/`:

```bash
npx shadcn-vue@latest add button
```

### Styling Components

Use the `cn()` function to merge Tailwind classes:

```vue
<script setup lang="ts">
import { cn } from '~/lib/utils'

const buttonClass = cn(
  'bg-primary text-white',
  'hover:bg-primary/90',
  props.variant === 'outline' && 'bg-transparent border'
)
</script>
```

## Dark Theme

### Theme Toggle

Dark theme is managed via `useColorMode()` composable:

```vue
<script setup>
const colorMode = useColorMode()

// Toggle theme
const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
```

### How It Works

1. `app/layouts/default.vue` watches for `useColorMode()` changes
2. Adds/removes `dark` class on `<html>` element
3. Tailwind applies `dark:` variants based on this class

### Styling for Dark Theme

```vue
<template>
  <div class="bg-white dark:bg-gray-900 text-black dark:text-white">
    Content with dark theme support
  </div>
</template>
```

## Internationalization (i18n)

### Current Settings

- **Default Language**: Russian (`ru`)
- **Supported Languages**: Russian (`ru`), English (`en`)
- **Strategy**: `no_prefix` (no locale prefix in URLs)

### Using Translations

In template:

```vue
<template>
  <h1>{{ $t('welcome') }}</h1>
  <p>{{ $t('description') }}</p>
</template>
```

In script:

```vue
<script setup>
const { t, locale } = useI18n()

console.log(t('welcome'))

// Switch language
locale.value = 'en'
</script>
```

### Adding Translations

Edit files in `i18n/locales/`:

```typescript
// i18n/locales/ru.ts
export default {
  welcome: 'Добро пожаловать',
  description: 'Это описание'
}

// i18n/locales/en.ts
export default {
  welcome: 'Welcome',
  description: 'This is a description'
}
```

### Language Switcher

```vue
<script setup>
const { locale, locales } = useI18n()

const switchLanguage = (newLocale: string) => {
  locale.value = newLocale
}
</script>

<template>
  <div>
    <button
      v-for="loc in locales"
      :key="loc.code"
      @click="switchLanguage(loc.code)"
    >
      {{ loc.name }}
    </button>
  </div>
</template>
```

## API Routes

### Creating API Endpoints

Create a file in `app/api/` or `server/api/`:

```typescript
// app/api/users.ts
export default defineEventHandler(async (event) => {
  return {
    users: [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ]
  }
})
```

### Using API

```vue
<script setup>
const { data, pending, error } = await useFetch('/api/users')
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <ul v-else>
    <li v-for="user in data.users" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>
```

## Composables

### Creating a Composable

```typescript
// app/composables/useCounter.ts
export const useCounter = () => {
  const count = ref(0)

  const increment = () => {
    count.value++
  }

  const decrement = () => {
    count.value--
  }

  return {
    count: readonly(count),
    increment,
    decrement
  }
}
```

### Usage

```vue
<script setup>
const { count, increment, decrement } = useCounter()
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <Button @click="increment">+</Button>
    <Button @click="decrement">-</Button>
  </div>
</template>
```

## Icons

### Using Lucide Icons

```vue
<template>
  <Icon name="lucide:check" class="w-4 h-4" />
  <Icon name="lucide:x-circle" class="w-6 h-6 text-red-500" />
  <Icon name="lucide:loader-2" class="w-4 h-4 animate-spin" />
</template>
```

All icons are available at [lucide.dev](https://lucide.dev)

## Testing

### Unit Tests (Vitest)

Create a test in `test/unit/`:

```typescript
// test/unit/example.test.ts
import { describe, it, expect } from 'vitest'

describe('Example Test', () => {
  it('should work', () => {
    expect(1 + 1).toBe(2)
  })
})
```

Running tests:

```bash
npm run test              # Watch mode
npm run test:unit         # Run once
npm run test:coverage     # With coverage
```

### E2E Tests (Playwright)

Create a test in `test/e2e/`:

```typescript
// test/e2e/example.spec.ts
import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Nuxt/)
})
```

Running E2E tests:

```bash
npm run test:e2e          # Run tests
npm run test:e2e:ui       # With UI
```

## Docker

### Docker Compose

```bash
# Start
docker-compose up

# Run in background
docker-compose up -d

# Stop
docker-compose down
```

### Docker (without Compose)

```bash
# Build image
docker build -t nuxt-starter .

# Run container
docker run -p 3000:3000 nuxt-starter
```

## CI/CD

GitHub Actions workflow is configured in `.github/workflows/ci.yml`:

### Pipeline Includes:

1. **Linting**: Code checking with ESLint
2. **Unit Tests**: Running Vitest tests
3. **E2E Tests**: Running Playwright tests
4. **Build**: Verifying successful build

## Path Aliases

The project has the following aliases configured:

- `~/` → `./app/`
- `@/` → `./app/`

```typescript
// Both work
import { Button } from '~/components/ui/button'
import { Button } from '@/components/ui/button'
```

## Tailwind CSS

### Configuration

Tailwind is configured with:
- CSS variables for theming (HSL format)
- Dark mode via `dark` class on `<html>`
- shadcn-vue color system
- Custom utilities

### Usage

```vue
<template>
  <div class="container mx-auto p-4">
    <div class="bg-background text-foreground rounded-lg p-6">
      <h1 class="text-2xl font-bold">Heading</h1>
    </div>
  </div>
</template>
```

### Color System

- `background` / `foreground` - Base background and text
- `primary` / `primary-foreground` - Primary color
- `secondary` / `secondary-foreground` - Secondary color
- `muted` / `muted-foreground` - Muted colors
- `accent` / `accent-foreground` - Accent colors
- `destructive` / `destructive-foreground` - Destructive actions
- `border` - Borders
- `input` - Input fields
- `ring` - Focus ring

## Deployment

### Node.js Server

```bash
# Build
npm run build

# Run
node .output/server/index.mjs
```

### Static Hosting

```bash
# Generate static files
npm run generate

# Upload .output/public to hosting
```

### Vercel / Netlify

Project is ready to deploy on Vercel or Netlify - just connect the repository.

### Docker

```bash
# Build and push
docker build -t your-registry/nuxt-starter .
docker push your-registry/nuxt-starter

# Deploy on server
docker pull your-registry/nuxt-starter
docker run -d -p 3000:3000 your-registry/nuxt-starter
```

## Scripts

```bash
# Development
npm run dev               # Start dev server on :3000

# Production
npm run build             # Build for production
npm run preview           # Preview production build
npm run generate          # Generate static site

# Testing
npm run test              # Unit tests (watch mode)
npm run test:unit         # Unit tests (run once)
npm run test:coverage     # Unit tests with coverage
npm run test:e2e          # E2E tests
npm run test:e2e:ui       # E2E tests with UI

# Code Quality
npx eslint .              # Lint code
npx eslint . --fix        # Auto-fix linting issues
```

## Tech Stack

### Core
- **Framework**: Nuxt 4
- **Vue**: Vue 3 with Composition API
- **TypeScript**: Full type support

### UI & Styling
- **UI Components**: shadcn-vue (New York style)
- **CSS Framework**: Tailwind CSS v3
- **Icons**: Lucide Icons via @nuxt/icon
- **Images**: @nuxt/image for optimization

### Features
- **i18n**: @nuxtjs/i18n for internationalization
- **SEO**: @nuxtjs/seo with sitemap
- **Content**: @nuxt/content for markdown
- **Utilities**: VueUse composables

### Development
- **Testing**: Vitest (unit), Playwright (E2E)
- **Linting**: ESLint with @nuxt/eslint
- **Formatting**: Prettier
- **Git Hooks**: .editorconfig

### DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Node Version**: 20.x (recommended)

## Nuxt Modules

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',          // Internationalization
    '@nuxtjs/tailwindcss',   // Tailwind CSS
    'shadcn-nuxt',           // shadcn-vue components
    '@nuxt/icon',            // Icons
    '@nuxt/image',           // Image optimization
    '@nuxt/content',         // Content management
    '@nuxt/eslint',          // ESLint integration
    '@vueuse/nuxt',          // VueUse composables
  ]
})
```

## Useful Links

### Documentation
- [Nuxt 3](https://nuxt.com/docs)
- [Vue 3](https://vuejs.org/)
- [shadcn-vue](https://www.shadcn-vue.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [VueUse](https://vueuse.org/)

### Tools
- [Lucide Icons](https://lucide.dev/)
- [Nuxt i18n](https://i18n.nuxtjs.org/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

## Recommendations

### Adding New Features

1. **Components**: Create in `app/components/`
2. **Pages**: Add to `app/pages/` (file-based routing)
3. **API**: Create in `app/api/` or `server/api/`
4. **Composables**: Add to `app/composables/`
5. **Utilities**: Place in `app/utils/`
6. **Types**: TypeScript types in respective files

### Best Practices

- Use TypeScript for all new files
- Follow Composition API
- Use `<script setup>` syntax
- Leverage Nuxt auto-imports
- Add tests for critical logic
- Use i18n for all text content
- Follow shadcn-vue structure for UI components

## Support

If you have questions or issues:

1. Check [Nuxt documentation](https://nuxt.com/docs)
2. Browse [shadcn-vue examples](https://www.shadcn-vue.com/examples)
3. Create an issue in the repository

## License

MIT

---

Built with Nuxt 3 ✨
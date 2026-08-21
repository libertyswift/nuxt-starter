# Nuxt Starter

Стартер на Nuxt 4: shadcn-vue, Tailwind CSS 4, i18n, Pinia, тесты и Docker.

## Стек

| Слой        | Чем закрыт                                                    |
| ----------- | ------------------------------------------------------------- |
| Фреймворк   | Nuxt 4 (структура с каталогом `app/`), Vue 3, TypeScript      |
| Стили       | Tailwind CSS 4 через `@tailwindcss/vite`                      |
| Компоненты  | shadcn-vue (стиль new-york) на reka-ui                        |
| Иконки      | Lucide через `@nuxt/icon` + локальный `@iconify-json/lucide`  |
| Тема        | `@nuxtjs/color-mode` (класс `dark` на `<html>`, без FOUC)     |
| Локализация | `@nuxtjs/i18n`, ru (по умолчанию) и en, стратегия `no_prefix` |
| Состояние   | Pinia + `pinia-plugin-persistedstate`                         |
| Данные      | встроенные `useAsyncData` / `useFetch` и `$fetch`             |
| Формы       | vee-validate + zod                                            |
| SEO         | `@nuxtjs/seo` (sitemap, robots, og-image, canonical)          |
| Тесты       | Vitest в окружении Nuxt, Playwright для e2e                   |

## Быстрый старт

Нужен Node.js 22+ (в CI и Docker — 24).

```bash
git clone git@github.com:libertyswift/nuxt-starter.git
cd nuxt-starter
npm install
cp .env.example .env
npm run dev            # http://localhost:3000
```

## Команды

```bash
npm run dev              # dev-сервер
npm run dev:staging      # dev-сервер с .env.staging
npm run build            # прод-сборка
npm run build:staging    # сборка с .env.staging
npm run build:production # сборка с .env.production
npm run preview          # предпросмотр прод-сборки
npm run generate         # статическая генерация

npm run lint             # eslint
npm run lint:fix         # eslint --fix
npm run format           # prettier
npm run typecheck        # vue-tsc через nuxt typecheck
npm run design:check     # токены tailwind.css соответствуют DESIGN.md

npm run test             # vitest в watch-режиме
npm run test:unit        # vitest один прогон
npm run test:coverage    # покрытие
npm run test:e2e         # playwright
npm run test:e2e:ui      # playwright в UI-режиме
```

## Структура

```
app/
├── assets/css/tailwind.css   # Tailwind 4: @theme inline и токены темы
├── components/
│   ├── ui/                   # shadcn-vue, генерируется CLI (из-под eslint исключён)
│   ├── forms/
│   ├── AppHeader.vue
│   └── LanguageSwitcher.vue
├── composables/              # useForm, useSeo, useDate, useToast
├── layouts/
├── lib/                      # cn() и zod-схемы
├── pages/
├── stores/                   # Pinia
└── utils/                    # хелперы поверх es-toolkit

i18n/locales/                 # en.ts, ru.ts
server/                       # Nitro-роуты
test/unit/                    # Vitest
test/e2e/                     # Playwright
```

Код, который нужен и в `app/`, и в `server/`, кладите в каталог `shared/` —
напрямую импортировать `app/` из `server/` нельзя, это разные окружения сборки.

## Окружения и переменные

Конфигурация живёт в `runtimeConfig` внутри `nuxt.config.ts`. Значения оттуда
переопределяются переменными окружения **на рантайме**, без пересборки:

| Ключ в `runtimeConfig.public` | Переменная                        |
| ----------------------------- | --------------------------------- |
| `siteUrl`                     | `NUXT_PUBLIC_SITE_URL`            |
| `apiBaseUrl`                  | `NUXT_PUBLIC_API_BASE_URL`        |
| `environment`                 | `NUXT_PUBLIC_ENVIRONMENT`         |
| `features.analytics`          | `NUXT_PUBLIC_FEATURES_ANALYTICS`  |
| `features.debugMode`          | `NUXT_PUBLIC_FEATURES_DEBUG_MODE` |

Приватные ключи объявляйте в `runtimeConfig` без секции `public` — они не
попадут в клиентский бандл и переопределяются переменными `NUXT_*`.

В репозитории лежат шаблоны `.env.example`, `.env.staging.example` и
`.env.production.example`. Сами `.env*` в git не попадают.

```bash
cp .env.staging.example .env.staging
npm run build:staging
```

## Дизайн-система

`DESIGN.md` в корне — источник правды по дизайну проекта. Блоки `:root` и
`.dark` в `app/assets/css/tailwind.css` производны от него.

Рабочий цикл: правите `DESIGN.md` → просите агента привести проект в
соответствие → `npm run design:check` подтверждает, что CSS не разъехался.
Проверка падает при расхождении в любую сторону, в том числе если в CSS
появился токен, не описанный в `DESIGN.md`. В CI она включена.

Формат опирается на [DESIGN.md от Google Labs](https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-design-md/),
но токены записаны как CSS custom properties, а не DTCG: так значения
совпадают с `tailwind.css` один в один и проверяются автоматически.

## Компоненты shadcn-vue

```bash
npx shadcn-vue@latest add card
```

Компоненты попадают в `app/components/ui/` и подключаются авто-импортом.
Каталог исключён из eslint: правки делаются через CLI, а не руками.

Тема задаётся CSS-переменными в `app/assets/css/tailwind.css` — в Tailwind 4
нет `tailwind.config.ts`, палитра и радиусы описаны в блоках `:root`, `.dark`
и `@theme inline`.

## Тесты

Unit-тесты идут в настоящем окружении Nuxt (`environment: 'nuxt'`), поэтому
внутри доступны авто-импорты, `#app` и `mockNuxtImport`.

E2E кликают по `data-testid`, а не по тексту — интерфейс переводится.
Страница отдаётся SSR, и до окончания гидратации клик уходит «в статичный
HTML», поэтому взаимодействия в `test/e2e/homepage.spec.ts` обёрнуты в
идемпотентный `expect(...).toPass()`.

## Docker

```bash
docker compose up --build
```

Сборка многослойная: рантайм-образ содержит только `.output` и работает от
непривилегированного пользователя `node`. Переменные окружения передаются
через `env_file` или `environment` — в образ они не вшиты.

## CI

`.github/workflows/ci.yml` на каждый push и PR гоняет lint, typecheck,
unit-тесты, сборку, e2e и `npm audit`.
`.github/workflows/dependencies.yml` раз в неделю печатает отчёт об
обновлениях; сами обновления приносит Dependabot.

## Известные ограничения

- **zod зафиксирован на 3.25.** `@vee-validate/zod` требует zod 3. Как только
  выйдет стабильная vee-validate 5, обёртка `toTypedSchema` уйдёт (схема
  передаётся напрямую через Standard Schema) и можно будет перейти на zod 4.
- **`strategy: 'no_prefix'`** держит один URL на все языки, поэтому
  `@nuxtjs/seo` не сгенерирует hreflang и локализованный sitemap. Если
  языковые версии нужны в поиске — переключите на `prefix_except_default`.

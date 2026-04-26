# Founder CRM

Production-ready PWA CRM для фаундеров с локальным хранением данных, AI-анализом контактов и геймификацией.

## Стек

- Next.js (App Router) + TypeScript (strict)
- Zustand (persist) + Local storage
- TailwindCSS + shadcn-like UI components
- PWA (`next-pwa`)
- AI: OpenRouter/Groq (только free models)

## Основные возможности

- CRUD контактов с заметками, болями и каналами связи
- AI анализ: pain points, мотивации, entry strategy, 3 message variants
- Telegram Intelligence через Funstat (`/api/funstat/analyze`)
- Генерация ручного промпта для внешних LLM
- Follow-up напоминания и авто-автоматизация после создания контакта
- Аналитика: pain aggregation, network map, insights
- Геймификация: XP, уровни, цели
- Экспорт в JSON/CSV
- Offline indicator, error boundaries, темная/светлая/системная тема

## Локальный запуск

1. Установить зависимости:

```bash
npm ci
```

2. Подготовить окружение:

```bash
cp .env.example .env.local
```

3. Запустить dev-сервер:

```bash
npm run dev -- --webpack
```

4. Проверить качество:

```bash
npm run lint
npm run build
```

## Подготовка к деплою на Vercel

Проект уже содержит `vercel.json` с конфигурацией сборки.

### В Vercel Project Settings -> Environment Variables добавьте:

- `NEXT_PUBLIC_APP_NAME` (например, `Founder CRM`)
- `NEXT_PUBLIC_APP_URL` (домен продакшн-приложения)
- `NEXT_PUBLIC_SUPABASE_URL` (опционально для server-side БД)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (опционально для server-side БД)
- `SUPABASE_SERVICE_ROLE_KEY` (обязательно для server route handlers записи/обновления)
- (опционально) `NEXT_PUBLIC_OPENROUTER_API_KEY`
- (опционально) `NEXT_PUBLIC_GROQ_API_KEY`

> Рекомендуемый сценарий: ключи вводятся пользователем в UI (`/settings/api`) и хранятся локально в браузере.

## Быстрый деплой

1. Импортируйте репозиторий в [Vercel](https://vercel.com/new)
2. Framework Preset: `Next.js`
3. Build Command: `npm run build`
4. Install Command: `npm ci`
5. Нажмите Deploy

### Подключение Supabase (production persistence)

1. Выполните SQL из `supabase/schema.sql` в SQL Editor проекта Supabase.
2. Добавьте env-переменные `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
3. После этого `/api/contacts` автоматически перейдет с in-memory fallback на Supabase.

## Проверка после деплоя

- Открывается `/contacts`
- Работают роуты:
  - `/analysis/network-map`
  - `/analysis/insights`
  - `/settings/api`
  - `/settings/preferences`
  - `/settings/export`
  - `/learn/*`
- Работает Telegram-анализ на карточке контакта (если у контакта указан `telegram`)
- PWA manifest доступен по `/manifest.json`
- Service worker регистрируется в production

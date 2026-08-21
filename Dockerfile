# syntax=docker/dockerfile:1

# ---------- build ----------
FROM node:24-alpine AS builder

# Версия pnpm берётся из поля packageManager в package.json
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# ---------- runtime ----------
FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

# .output самодостаточен — node_modules в рантайме не нужны
COPY --from=builder --chown=node:node /app/.output /app/.output

USER node

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]

FROM oven/bun:latest

# Stage 1: Build
FROM node:lts-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN bun install --frozen-lockfile
COPY . .
RUN bunx nx run api:build:production

# Stage 2: Production
FROM node:lts-alpine
ENV NODE_ENV production

WORKDIR /usr/src/app
COPY package*.json ./
RUN bun install --frozen-lockfile
COPY --from=builder /usr/src/app/dist/apps/api ./build

CMD ["bun", "build/main.js"]

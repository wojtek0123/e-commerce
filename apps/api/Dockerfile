FROM oven/bun:latest

# Stage 1: Build
FROM node:lts-alpine AS builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN bun install
COPY . .
RUN bunx nx run yourNestAppName:build:production

# Stage 2: Production
FROM node:lts-alpine
ENV NODE_ENV production

WORKDIR /usr/src/app
COPY package*.json ./
RUN bun install
COPY --from=builder /usr/src/app/dist/apps/api ./build

CMD ["node", "build/main.js"]

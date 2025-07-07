# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY ../../package.json ../../bun.lockb ./
COPY ../../nx.json ../../workspace.json* ../../project.json* ./
COPY ../../tsconfig.base.json ./
COPY ../../libs ./libs
COPY . .
RUN bun install --frozen-lockfile
RUN bunx nx build api --configuration=production

# --- Run Stage ---
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/api ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/.env* ./
COPY --from=builder /app/apps/api/src/assets ./dist/assets
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]

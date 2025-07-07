# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY ../../package.json ../../bun.lockb ./
COPY ../../nx.json ../../workspace.json* ../../project.json* ./
COPY ../../tsconfig.base.json ./
COPY ../../libs ./libs
COPY . .
RUN bun install --frozen-lockfile
RUN bunx nx build client-web --configuration=production

# --- Run Stage ---
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/client-web ./dist
COPY --from=builder /app/apps/client-web/package.json ./package.json
COPY --from=builder /app/apps/client-web/node_modules ./node_modules
COPY --from=builder /app/apps/client-web/.env* ./
ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/server/main.js"]

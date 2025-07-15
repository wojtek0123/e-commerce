# -------- Stage 1: Build --------
FROM oven/bun:latest AS builder

WORKDIR /app

COPY . .

RUN bun install
RUN bunx nx reset

RUN cd apps/api && bunx prisma generate
RUN NX_DAEMON=false bunx nx build api --exclude=admin-dashboard-e2e,client-web-e2e --verbose

ENV PORT=3000
ENV NODE_ENV=production
CMD ["bun", "/app/dist/apps/api/main.js"]
EXPOSE 3000

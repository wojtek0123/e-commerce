# -------- Stage 1: Build --------
FROM oven/bun:latest AS builder

WORKDIR /app

COPY . .

RUN bun install
RUN bunx nx reset
RUN bunx prisma generate

RUN NX_DAEMON=false bunx nx build api

ENV PORT=3000
ENV NODE_ENV=production
CMD ["bun", "/app/dist/apps/api/main.js"]
EXPOSE 3000

# -------- Stage 2: Run --------
# FROM oven/bun:1.1.3 AS runner
#
# WORKDIR /app
#
#
# # Copy build output
# COPY --from=builder /app/dist/apps/api ./dist
# COPY --from=builder /app/package.json ./
# COPY --from=builder /app/bun.lockb ./
#
# RUN bun install --production
#
# # Expose port
# EXPOSE 3000
#
# CMD ["bun", "dist/main.js"]

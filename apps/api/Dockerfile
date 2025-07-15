
# -------- Stage 1: Build --------
FROM oven/bun:latest AS builder

WORKDIR /app

COPY . .

RUN bun install
RUN bunx nx reset
RUN NX_DAEMON=false bunx nx build api

# -------- Stage 2: Run --------
FROM oven/bun:1.1.3 AS runner

WORKDIR /app


# Copy build output
COPY --from=builder /app/dist/apps/api ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb ./

RUN bun install --production

# Expose port
EXPOSE 3000

CMD ["bun", "dist/main.js"]

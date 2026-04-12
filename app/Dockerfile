FROM node:22-slim AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate

# --- Build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src/generated ./src/generated
COPY . .
RUN npm run build

# --- Production ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy prisma schema + migrations for runtime migrations
COPY --from=builder /app/prisma ./prisma
RUN npm install -g prisma && ln -s /usr/local/lib/node_modules/prisma /app/node_modules/prisma
# Production prisma config (avoids dotenv/TS imports, Docker provides env vars)
RUN printf 'module.exports = {\n  schema: "prisma/schema.prisma",\n  migrations: { path: "prisma/migrations" },\n  datasource: { url: process.env.DATABASE_URL },\n};\n' > prisma.config.js

# Create uploads directories
RUN mkdir -p public/uploads/images public/uploads/audio
RUN chown -R nextjs:nodejs public/uploads

# Copy entrypoint
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./entrypoint.sh"]

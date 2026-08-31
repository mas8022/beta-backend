# =========================
# 1. Dependencies
# =========================
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

# =========================
# 2. Build
# =========================
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS
RUN npm run build


# =========================
# 3. Production dependencies
# =========================
FROM node:22-alpine AS prod-deps

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

# Prisma Client generation needs Prisma CLI
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma


# =========================
# 4. Production
# =========================
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Compiled NestJS application
COPY --from=builder /app/dist ./dist

# Prisma schema/migrations
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/main.js"]

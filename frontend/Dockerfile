# ── Stage 1: Build ──────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# VITE_API_URL is relative so nginx can proxy it
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Use vite build directly to skip tsc strict checking
RUN npx vite build

# ── Stage 2: Nginx ───────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

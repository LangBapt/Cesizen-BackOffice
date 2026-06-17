# ─── Stage 1 : build ────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# VITE_API_URL est injectée AU BUILD (Vite compile les variables VITE_* en dur dans le JS)
ARG VITE_API_URL
ARG VITE_BASE_PATH
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_BASE_PATH=${VITE_BASE_PATH}

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─── Stage 2 : runtime (serveur statique nginx) ─────────────────────
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Health check : vérifie que nginx répond
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
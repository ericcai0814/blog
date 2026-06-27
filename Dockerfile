FROM node:22-slim AS builder

WORKDIR /app/next-site

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm install -g pnpm@10

COPY next-site/package.json next-site/pnpm-lock.yaml next-site/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY next-site/ ./
RUN pnpm build

FROM node:22-slim AS runner

WORKDIR /app/next-site

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm install -g pnpm@10

COPY --from=builder /app/next-site ./

EXPOSE 3000

CMD ["sh", "-c", "pnpm exec next start --hostname 0.0.0.0 --port ${PORT:-3000}"]

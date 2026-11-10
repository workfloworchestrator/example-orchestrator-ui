FROM node:24-alpine AS builder

# ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Use the pnpm version pinned in package.json's "packageManager" field
RUN corepack enable

WORKDIR /app
COPY . .

RUN pnpm install --frozen-lockfile && pnpm update --no-save @orchestrator-ui/orchestrator-ui-components
RUN pnpm run build


FROM node:24-alpine AS runner

# ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/.next/standalone /app
COPY --from=builder /app/.next/static /app/.next/static
COPY --from=builder /app/public /app/public

WORKDIR /app
USER node
EXPOSE 3000
CMD ["node", "server.js"]

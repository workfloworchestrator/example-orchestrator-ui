FROM node:24-alpine AS builder

# ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app
RUN npm install -g pnpm@11.15.1
COPY . .

RUN pnpm install && pnpm update @orchestrator-ui/orchestrator-ui-components @orchestrator-ui/eslint-config-custom @orchestrator-ui/jest-config @orchestrator-ui/tsconfig
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

FROM node:18-alpine AS builder

# ENV NODE_ENV=production

WORKDIR /build
COPY . .
RUN npm install && npm update @orchestrator-ui/orchestrator-ui-components && npm update @orchestrator-ui/eslint-config-custom && npm update @orchestrator-ui/jest-config && npm update @orchestrator-ui/tsconfig
RUN npm run build


FROM node:18-alpine AS runner

# ENV NODE_ENV=production

WORKDIR /app
COPY --chown=node --from=builder /build .

USER node
EXPOSE 3000
CMD npm start



FROM node:15-alpine AS node
RUN chmod 777 /home/node
USER 1000
WORKDIR /app

FROM node AS builder

COPY yarn.lock .yarnrc.yml ./
COPY --chown=1000:1000 .yarn .yarn
RUN yarn fetch --immutable && yarn cache clean

COPY --chown=1000:1000 . .
RUN yarn build
RUN yarn workspaces focus --production

FROM node AS runner
ENV NODE_ENV=production
ENTRYPOINT ["node","dist/src/app.js"]
COPY --from=builder /app /app

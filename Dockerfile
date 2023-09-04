FROM node:15-alpine AS node
WORKDIR /app
RUN chown 1000:1000 /app
USER 1000

FROM node AS builder

COPY yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn fetch --immutable && yarn cache clean

COPY . .
RUN yarn build
RUN yarn workspaces focus --production

FROM node AS runner
ENV NODE_ENV=production
ENTRYPOINT ["yarn", "start"]
COPY --from=builder /app /app

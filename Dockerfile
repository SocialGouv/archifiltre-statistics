FROM node:14.11.0-alpine

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn --production --frozen-lockfile --cache-folder /dev/shm/yarn

COPY ./dist /app/dist

USER node

ENV NODE_ENV=production

CMD ["yarn", "start:prod"]

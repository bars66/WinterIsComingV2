FROM node:10.21.0-alpine3.9 AS builder
ADD ./ /app
WORKDIR /app
RUN apk add --no-cache --virtual .build-deps make gcc g++ python linux-headers udev && yarn install --frozen-lockfile && yarn babel && yarn install --frozen-lockfile --prod

FROM node:10.21.0-alpine3.9
WORKDIR /app
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/packages/ /app/packages/
CMD NODE_ENV=production node /app/packages/bridge/build/index.js
FROM node:10.21.0-alpine3.9 AS builder
ADD ./ /app
WORKDIR /app
RUN apk add --no-cache --virtual .build-deps make gcc g++ python linux-headers udev && yarn install && yarn babel && yarn install --frozen-lockfile --prod

FROM mhart/alpine-node:slim-10
WORKDIR /app
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/packages/ /app/packages/
CMD cd packages/$PROJECTNAME/ && NODE_ENV=production node build/index.js
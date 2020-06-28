FROM node:10.21.0-alpine3.9
ADD ./ /app
WORKDIR /app
RUN apk add --no-cache --virtual .build-deps make gcc g++ python linux-headers udev && yarn install --frozen-lockfile && yarn babel && apk del .build-deps && yarn install --frozen-lockfile --prod
CMD NODE_ENV=production node /app/packages/bridge/build/index.js
FROM node:10.21.0-alpine3.9
ADD ./ /app
WORKDIR /app
RUN apk add --no-cache make gcc g++ python linux-headers udev
RUN yarn install --prod --frozen-lockfile
CMD node /app/packages/bridge/build/index.js
FROM node:10.21.0-buster as build
ADD ./ /app
WORKDIR /app

RUN yarn install --frozen-lockfile && node clear_monorepo_packages.js winteriscomingv2-bridge && yarn babel && yarn install --frozen-lockfile --prod
RUN mkdir -p /wic-bridge/opt/wic-bridge/ && cp -r /app/sys/systemd/ /wic-bridge/opt/wic-bridge/systemd/ && cp -r /app/sys/wic-bridge/DEBIAN/ /wic-bridge/DEBIAN/  && cp -r /app/node_modules /wic-bridge/opt/wic-bridge/node_modules && cp -r /app/packages /wic-bridge/opt/wic-bridge/packages/ && cd / && dpkg-deb --build wic-bridge

FROM scratch
COPY --from=build /wic-bridge.deb /wic-bridge.deb

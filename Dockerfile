# syntax=docker/dockerfile:1.10-labs
FROM node:22.4.1 as build

ENV NODE_ENV="production"

ADD --link --exclude=packages/mobile . /builddir

WORKDIR /builddir

RUN corepack yarn install

WORKDIR /builddir/packages/common

RUN corepack yarn build

# Server build
FROM build as server-build

WORKDIR /builddir/packages/server

RUN corepack yarn prisma generate

RUN corepack yarn build

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN,required \
  corepack yarn sentry-cli sourcemaps inject --org ukdanceblue --project server ./dist && \
  corepack yarn sentry-cli sourcemaps upload --org ukdanceblue --project server ./dist

# Portal build
FROM build as portal-build

WORKDIR /builddir/packages/portal

ENV VITE_API_BASE_URL=""

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN,required \
  corepack yarn build

# Server
FROM node:22.4.1 as server

ENV MS_OIDC_URL="https://login.microsoftonline.com/2b30530b-69b6-4457-b818-481cb53d42ae/v2.0/.well-known/openid-configuration"
ENV APPLICATION_PORT="8000"

RUN mkdir -p /app/packages/server
RUN mkdir -p /app/packages/common
RUN mkdir -p /app/.yarn
RUN mkdir -p /app/node_modules

COPY --from=server-build /builddir/packages/server/dist /app/packages/server/dist
COPY --from=server-build /builddir/packages/server/prisma /app/packages/server/prisma
COPY --from=server-build /builddir/packages/server/package.json /app/packages/server/package.json
COPY --from=server-build /builddir/packages/common/dist /app/packages/common/dist
COPY --from=server-build /builddir/packages/common/package.json /app/packages/common/package.json
COPY --from=server-build /builddir/node_modules /app/node_modules
COPY --from=server-build /builddir/package.json /app/package.json
COPY --from=server-build /builddir/yarn.lock /app/yarn.lock

WORKDIR /app/packages/server

CMD corepack yarn dlx prisma migrate deploy && node .

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [[ "$(curl -fs http://localhost:8000/api/healthcheck)" == "OK" ]] || exit 1

# Portal
FROM nginx:stable-alpine as portal

COPY --from=portal-build /builddir/packages/portal/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [[ "$(curl -fs http://localhost:80)" == "OK" ]] || exit 1
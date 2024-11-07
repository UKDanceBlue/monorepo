# syntax=docker/dockerfile:1.10-labs
FROM node:22.4.1 AS build

ENV NODE_ENV="production"

ADD --link --exclude=packages/mobile . /builddir

WORKDIR /builddir

RUN corepack yarn install

WORKDIR /builddir/packages/common

RUN corepack yarn run build

WORKDIR /builddir/packages/portal

RUN corepack yarn run build

WORKDIR /builddir/packages/server

RUN corepack yarn prisma generate

RUN corepack yarn build

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN,required \
  corepack yarn sentry-cli sourcemaps inject --org ukdanceblue --project server ./dist && \
  corepack yarn sentry-cli sourcemaps upload --org ukdanceblue --project server ./dist

# Server
FROM node:22.4.1 AS server

ENV MS_OIDC_URL="https://login.microsoftonline.com/2b30530b-69b6-4457-b818-481cb53d42ae/v2.0/.well-known/openid-configuration"
ENV APPLICATION_PORT="8000"

RUN mkdir -p /app/packages/portal
RUN mkdir -p /app/packages/server
RUN mkdir -p /app/packages/common
RUN mkdir -p /app/.yarn
RUN mkdir -p /app/node_modules

COPY --from=build /builddir/packages/server/dist /app/packages/server/dist
COPY --from=build /builddir/packages/server/prisma /app/packages/server/prisma
COPY --from=build /builddir/packages/server/package.json /app/packages/server/package.json
COPY --from=build --chmod=777 /builddir/packages/server/docker-entrypoint.sh /app/packages/server/docker-entrypoint.sh
COPY --from=build /builddir/packages/portal/dist /app/packages/portal/dist
COPY --from=build /builddir/packages/portal/package.json /app/packages/portal/package.json
COPY --from=build /builddir/packages/common/dist /app/packages/common/dist
COPY --from=build /builddir/packages/common/package.json /app/packages/common/package.json
COPY --from=build /builddir/node_modules /app/node_modules
COPY --from=build /builddir/package.json /app/package.json
COPY --from=build /builddir/yarn.lock /app/yarn.lock

WORKDIR /app/packages/server

ENTRYPOINT ["/app/packages/server/docker-entrypoint.sh"]
CMD [ "node", "." ]

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD bash -c '[[ "$(curl -fs http://localhost:8000/api/healthcheck)" == "OK" ]] || exit 1'

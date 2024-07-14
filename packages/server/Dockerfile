FROM node:22 as build

RUN corepack enable

RUN mkdir -p /builddir
ADD . /builddir
WORKDIR /builddir

RUN yarn install --immutable

RUN yarn run gql:build

WORKDIR /builddir/packages/common

RUN yarn build

WORKDIR /builddir/packages/server

RUN yarn build

RUN yarn workspaces focus @ukdanceblue/server --production

FROM node:22

ENV NODE_ENV="production"
ENV APPLICATION_PORT="8000"
ENV APPLICATION_HOST="0.0.0.0"

EXPOSE ${APPLICATION_PORT}

# ENV COOKIE_SECRET=""
# ENV JWT_SECRET=""

ENV MS_OIDC_URL="https://login.microsoftonline.com/2b30530b-69b6-4457-b818-481cb53d42ae/v2.0/.well-known/openid-configuration"
# ENV MS_CLIENT_ID=""
# ENV MS_CLIENT_SECRET=""

RUN mkdir -p /app/packages/server
RUN mkdir -p /app/packages/common
RUN mkdir -p /app/node_modules

COPY --from=build /builddir/packages/server/dist /app/packages/server/dist
COPY --from=build /builddir/packages/server/package.json /app/packages/server/package.json
COPY --from=build /builddir/packages/server/yarn.lock /app/packages/server/yarn.lock
COPY --from=build /builddir/packages/server/node_modules /app/packages/server/node_modules
COPY --from=build /builddir/packages/common/dist /app/packages/common/dist
COPY --from=build /builddir/packages/common/package.json /app/packages/common/package.json
COPY --from=build /builddir/packages/common/yarn.lock /app/packages/common/yarn.lock
COPY --from=build /builddir/node_modules /app/node_modules

WORKDIR /app/packages/server

CMD corepack yarn run migrate-and-start

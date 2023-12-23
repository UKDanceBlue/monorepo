# Context needs to be the root of the repository

# Stage 1: Build the app in image 'builder'
FROM node:18-alpine as builder

WORKDIR /app

COPY . .

RUN yarn install --immutable

RUN yarn run server:build

# Stage 2: Copy the app from 'builder' to 'node'

FROM node:18

ENV NODE_ENV="production"
ENV APPLICATION_PORT="8000"
ENV APPLICATION_HOST="0.0.0.0"

EXPOSE ${APPLICATION_PORT}

# ENV COOKIE_SECRET=""
# ENV JWT_SECRET=""

ENV DB_HOST="app-database"
ENV DB_PORT="5432"
ENV DB_NAME="danceblue"
ENV DB_UNAME="danceblue"
# ENV DB_PWD=""

ENV MS_OIDC_URL="https://login.microsoftonline.com/2b30530b-69b6-4457-b818-481cb53d42ae/v2.0/.well-known/openid-configuration"
# ENV MS_CLIENT_ID=""
# ENV MS_CLIENT_SECRET=""

RUN mkdir -p /usr/src/app/packages/server
RUN mkdir -p /usr/src/app/packages/common

COPY  --from=builder /app/packages/server/package.json /usr/src/app/packages/server
COPY  --from=builder /app/packages/server/.yarnrc.yml /usr/src/app/packages/server
COPY  --from=builder /app/packages/server/dist/ /usr/src/app/packages/server/dist
COPY  --from=builder /app/packages/server/node_modules/ /usr/src/app/packages/server/node_modules

COPY  --from=builder /app/packages/common/package.json /usr/src/app/packages/common
COPY  --from=builder /app/packages/common/.yarnrc.yml /usr/src/app/packages/common
COPY  --from=builder /app/packages/common/dist/ /usr/src/app/packages/common/dist
COPY  --from=builder /app/packages/common/node_modules/ /usr/src/app/packages/common/node_modules

COPY  --from=builder /app/package.json /usr/src/app
COPY  --from=builder /app/yarn.lock /usr/src/app
COPY  --from=builder /app/.yarnrc.yml /usr/src/app
COPY  --from=builder /app/node_modules/ /usr/src/app/node_modules
COPY  --from=builder /app/.yarn/ /usr/src/app/.yarn

WORKDIR /usr/src/app/packages/server

CMD ["node", "dist/index.js", "--migrate-db"]

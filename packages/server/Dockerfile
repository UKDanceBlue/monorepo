# Needs to be run with the context set to project root, i.e. docker build -t app-server ../.. -f Dockerfile

FROM node:18
EXPOSE ${APPLICATION_PORT}

ENV NODE_ENV="production"
ENV APPLICATION_PORT="8000"
ENV APPLICATION_HOST="localhost"

ENV COOKIE_SECRET=""
ENV JWT_SECRET=""

ENV DB_HOST="app-database"
ENV DB_PORT="5432"
ENV DB_NAME="danceblue"
ENV DB_UNAME="danceblue"
ENV DB_PWD=""

ENV MS_OIDC_URL="https://login.microsoftonline.com/2b30530b-69b6-4457-b818-481cb53d42ae/v2.0/.well-known/openid-configuration"
ENV MS_CLIENT_ID=""
ENV MS_CLIENT_SECRET=""

RUN mkdir -p /usr/src/app/packages/server
RUN mkdir -p /usr/src/app/packages/common

COPY packages/server/package.json /usr/src/app/packages/server
COPY packages/server/.yarnrc.yml /usr/src/app/packages/server
COPY packages/server/dist/ /usr/src/app/packages/server/dist
COPY packages/server/node_modules/ /usr/src/app/packages/server/node_modules

COPY packages/common/package.json /usr/src/app/packages/common
COPY packages/common/.yarnrc.yml /usr/src/app/packages/common
COPY packages/common/dist/ /usr/src/app/packages/common/dist
COPY packages/common/node_modules/ /usr/src/app/packages/common/node_modules

COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
COPY .yarnrc.yml /usr/src/app
COPY node_modules/ /usr/src/app/node_modules
COPY .yarn/ /usr/src/app/.yarn

WORKDIR /usr/src/app/packages/server

CMD ["node", "dist/main.js"]

# Needs to be run with the context set to project root, i.e. docker build -t app-server ../.. -f Dockerfile

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

COPY --chown=node:node yarn.lock /app
COPY --chown=node:node package.json /app
COPY --chown=node:node node_modules /app/node_modules
COPY --chown=node:node packages/server /app/packages/server
COPY --chown=node:node packages/common /app/packages/common

WORKDIR /app/packages/server

CMD yarn dlx prisma generate && yarn dlx prisma migrate deploy && yarn start

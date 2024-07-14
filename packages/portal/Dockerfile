FROM node:22 as build

RUN corepack enable

RUN mkdir -p /builddir
ADD . /builddir/
WORKDIR /builddir

RUN yarn install --immutable

RUN yarn run gql:build

WORKDIR /builddir/packages/common

RUN yarn build

WORKDIR /builddir/packages/portal

ENV VITE_API_BASE_URL=""

RUN yarn build

FROM nginx:stable-alpine

COPY --from=build /builddir/packages/portal/dist /usr/share/nginx/html

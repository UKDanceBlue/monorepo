# Dockerfile to clone and prepare to build the project
FROM node:22

ARG BRANCH

RUN mkdir -p /builddir
WORKDIR /builddir

RUN git clone --single-branch --branch ${BRANCH} .

RUN corepack enable

RUN yarn workspaces focus @ukdanceblue/common

RUN yarn run gql:build

WORKDIR /builddir/packages/common

RUN yarn build


#!/bin/sh
corepack yarn dlx prisma migrate deploy
exec node --import ./dist/src/entry/server/initSentry.js --enable-source-maps ./dist/src/index.js "$@"
#!/bin/sh
yarn dlx prisma migrate deploy
exec "$@"
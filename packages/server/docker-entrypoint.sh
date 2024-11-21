#!/bin/sh
corepack yarn dlx prisma migrate deploy
exec "$@"
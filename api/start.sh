#!/bin/sh

pnpm prisma generate

pnpm prisma migrate deploy

node dist/prisma/seeds/seed.js

pnpm start:prod

#!/bin/sh

pnpm prisma generate

pnpm prisma migrate deploy

pnpm start:prod

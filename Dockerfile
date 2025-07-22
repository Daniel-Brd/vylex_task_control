FROM node:20.17 AS builder
WORKDIR /app
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm prisma generate
RUN pnpm build

FROM node:20.17
WORKDIR /app

RUN npm i -g pnpm

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

COPY start.sh .

RUN pnpm prune --prod

RUN chmod +x ./start.sh

EXPOSE 3000
CMD ["./start.sh"]

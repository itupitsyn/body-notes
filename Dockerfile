FROM bitnami/node:18-debian-12 as dependencies
WORKDIR /body-notes
COPY package.json package-lock.json ./
RUN npm ci

FROM bitnami/node:18-debian-12 as builder
WORKDIR /body-notes
COPY . .
COPY --from=dependencies /body-notes/node_modules ./node_modules
RUN npx prisma generate
RUN npm run build

FROM bitnami/node:18-debian-12 as runner
WORKDIR /body-notes
ENV NODE_ENV production

COPY --from=builder /body-notes/.next/standalone .
COPY --from=builder /body-notes/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]

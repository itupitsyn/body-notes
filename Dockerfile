ARG node_version=20.9.0
ARG node_image=node:${node_version}-alpine3.18

FROM $node_image as dependencies
WORKDIR /body-notes
COPY package.json package-lock.json ./
RUN npm ci

FROM $node_image as builder
WORKDIR /body-notes
COPY . .
COPY --from=dependencies /body-notes/node_modules ./node_modules
RUN npx prisma generate
RUN npm run build

FROM $node_image as runner
WORKDIR /body-notes
ENV NODE_ENV production

COPY --from=builder /body-notes/.next/standalone .
COPY --from=builder /body-notes/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]

ARG bun_image=oven/bun:alpine

FROM $bun_image AS builder
WORKDIR /body-notes
COPY . .
RUN bun i --frozen-lockfile
RUN bunx prisma generate
RUN bunx prisma migrate deploy
RUN bun run build

FROM $bun_image AS runner
WORKDIR /body-notes
ENV NODE_ENV=production

COPY --from=builder /body-notes/.next/standalone .
COPY --from=builder /body-notes/.next/static ./.next/static

EXPOSE 3000
CMD ["bun", "server.js"]

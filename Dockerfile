FROM oven/bun:1.0

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install

COPY index.ts checkIfLive.ts ./

CMD [ "bun", "run", "index.ts" ]
FROM node:21-slim AS builder 

RUN apt-get update && apt-get install -y \
    build-essential \
    make \
    g++ \
    python3 \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . ./

RUN npm rebuild bcrypt --build-from-source

RUN npm prune --production

FROM node:21-slim AS runtime

WORKDIR /app

COPY --from=builder /app /app

CMD ["node", "index.js"]

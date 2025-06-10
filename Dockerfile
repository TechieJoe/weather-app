# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org
RUN npm install --legacy-peer-deps || npm install --legacy-peer-deps # retry once

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm config set registry https://registry.npmjs.org
RUN npm install --omit=dev --legacy-peer-deps || npm install --omit=dev --legacy-peer-deps

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/views ./views

EXPOSE 3000

CMD ["node", "dist/main.js"]

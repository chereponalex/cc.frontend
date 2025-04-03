FROM node:18.17.0-bullseye-slim AS builder
ARG BACKEND_URL
#ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
RUN yarn install

COPY . .
RUN yarn build

FROM node:18.17.0-bullseye-slim AS release
ENV BACKEND_URL=$BACKEND_URL
ENV NODE_ENV=production
#USER node
WORKDIR /app

COPY --from=builder /app/build /app/build
COPY --from=builder /app/node_modules /app/node_modules
# Нужно добавить volume 'vite-static-volume' при docker run 

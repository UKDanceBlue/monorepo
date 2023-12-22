# Context needs to be the root of the repository

# Stage 1: Build the app in image 'builder'
FROM node:18-alpine as builder

WORKDIR /app

COPY . .

RUN yarn install --immutable

ARG VITE_APP_API_BASE_URL

RUN yarn run portal:build

# Stage 2: Copy the app from 'builder' to 'nginx-spa'

FROM steebchen/nginx-spa:stable

COPY --from=builder /app/packages/portal/dist /app

CMD ["nginx"]

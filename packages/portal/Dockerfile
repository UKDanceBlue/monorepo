FROM build as build

ENV VITE_API_BASE_URL=""

WORKDIR /builddir/packages/portal

RUN yarn workspaces focus @ukdanceblue/portal

RUN yarn build

FROM nginx:stable-alpine

COPY --from=build /builddir/packages/portal/dist /usr/share/nginx/html

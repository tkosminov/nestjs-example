FROM node:22-alpine AS base

ENV DOCKER_DEPLOY=true
ENV ALLOW_CONFIG_MUTATIONS=true

RUN apk add --update --no-cache tzdata \
                                nano \
                                bash \
                                htop \
                                nginx \
                                nginx-mod-http-lua \
    && cp /usr/share/zoneinfo/UTC /etc/localtime \
    && echo "UTC" > /etc/timezone \
    && mkdir -p /run/nginx

COPY ./nginx.conf /etc/nginx/http.d/default.conf

RUN nginx -t

FROM base AS build

WORKDIR /build

COPY package.json package-lock.json ./

RUN npm ci

COPY tsconfig.json tsconfig.build.json ./
COPY config ./config
COPY src ./src

RUN npm run build

FROM base

WORKDIR /server

ARG env
ENV NODE_ENV=${env}

COPY --from=build /build/package.json /build/package-lock.json ./

RUN npm ci --omit=dev

COPY --from=build /build/config ./config
COPY --from=build /build/dist ./dist

CMD nginx; npm run start:build

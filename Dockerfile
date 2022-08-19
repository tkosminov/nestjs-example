FROM mhart/alpine-node:14
# FROM node:16-alpine

# Env

ARG env

ARG commit_short_sha
ARG pipeline_created_at

# RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories

# Timezone

RUN apk update
RUN apk add --update tzdata && \
                     cp /usr/share/zoneinfo/UTC /etc/localtime && \
                     echo "UTC" > /etc/timezone

# Nginx

RUN apk add --update --no-cache nginx && \
                                mkdir -p /run/nginx

# Apk

RUN apk add --update --no-cache --virtual runtime-deps \
                                          nano \
                                          postgresql-client \
                                          readline \
                                          bash \
                                          htop

WORKDIR /server

COPY package.json package-lock.json ./

RUN HUSKY_SKIP_INSTALL=true npm ci

COPY . .

COPY nginx.conf /etc/nginx/conf.d/default.conf

ENV NODE_ENV ${env}

RUN npm run build

ENV COMMIT_SHORT_SHA ${commit_short_sha}
ENV PIPELINE_CREATED_AT ${pipeline_created_at}

RUN touch build_info.txt
RUN echo "env: ${env}" >> build_info.txt
RUN echo "commit_short_sha: ${commit_short_sha}" >> build_info.txt
RUN echo "pipeline_created_at: ${pipeline_created_at}" >> build_info.txt

EXPOSE 80

CMD nginx; node -r ts-node/register -r tsconfig-paths/register ./dist/main.js

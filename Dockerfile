FROM mhart/alpine-node:12 as builder

# Env

ARG env

RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories

# Timezone

RUN apk update
RUN apk add --update tzdata && \
                     cp /usr/share/zoneinfo/UTC /etc/localtime && \
                     echo "UTC" > /etc/timezone

# Nginx

RUN apk add --update --no-cache nginx && \
                                mkdir -p /run/nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Apk

RUN apk add --update --no-cache --virtual runtime-deps \
                                          nano \
                                          postgresql-client \
                                          readline \
                                          bash \
                                          htop

WORKDIR /server

COPY . .

RUN HUSKY_SKIP_INSTALL=true npm install

ENV NODE_ENV ${env}

RUN npm run build

EXPOSE 80

CMD nginx; node ./dist/main.js

FROM mhart/alpine-node:12.14.1

ARG env
ENV NODE_ENV ${env}

RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories

RUN apk update

RUN apk add --update tzdata && \
                     cp /usr/share/zoneinfo/Europe/London /etc/localtime && \
                     echo "Europe/Moscow" > /etc/timezone

RUN apk add --update --no-cache --virtual build-dependencies \
                                          build-base \
                                          gcc \
                                          wget \
                                          git \
                                          g++ \
                                          make \
                                          python python3 \
                                          linux-headers

RUN apk add --update nginx \
                     py3-unoconv \
                     ttf-droid-nonlatin \
                     ttf-droid \
                     ttf-dejavu \
                     ttf-freefont \
                     ttf-liberation && \
                     mkdir -p /run/nginx

RUN apk add --update --virtual runtime-deps nano postgresql-client libffi-dev readline bash

COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /server

COPY . .

RUN npm install
RUN npm run build

EXPOSE 80

CMD nginx; ( unoconv --listener & ); node dist/main.js

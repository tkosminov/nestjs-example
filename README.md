# NestJS-Example

NestJS example with using GraphQL (schema stitching, schema reload, dataloader, upload files, subscriptions, response cache), RabbitMQ, Redis, Websocket, JWT authentication, ESLint 9

## Dependencies

* [NodeJS 22](https://nodejs.org/download/release/latest-v22.x/)
* [Redis 7](https://redis.io/download/)
* [PostgreSQL 13+](https://www.postgresql.org/download/)
* [RabbitMQ](https://www.rabbitmq.com/download.html)

## Run locally

### Installation

```bash
npm ci
```

### Run

```bash
npm run start:dev
```

### REPL

```bash
npm run repl:dev
```

## Run with Docker on host

### Build

```bash
sudo docker build -t nestjs-example . --build-arg env=development
```

### Run

```bash
sudo docker run -d --network host nestjs-example:latest
```

### Get CONTAINER_ID

```bash
sudo docker ps -a | grep nestjs-example
```

### Open container

```bash
sudo docker exec -it $CONTAINER_ID sh
```

### Show logs

```bash
sudo docker logs $CONTAINER_ID
```

### Stop container

```bash
sudo docker stop $CONTAINER_ID
```

### Remove container

```bash
sudo docker rm $CONTAINER_ID
```

## Run with Docker Compose

### Create network

```bash
sudo docker network create nestjs-example-network
```

### Run

```bash
sudo docker compose up --build
```

## Dependencies graph

### Full

```bash
npm run madge:full
```

### Circular

```bash
npm run madge:circular
```

## Typeorm

### Creating a migration file from modified entities

```bash
npm run typeorm:generate
```

### Create an empty migration file

```bash
npm run typeorm:create
```

### Run migrations

#### Development

```bash
npm run typeorm:run:dev
```

#### Build

```bash
npm run typeorm:run:build
```

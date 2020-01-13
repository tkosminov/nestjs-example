# NestJS

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

# NestJS-Example

## Dependencies

* [PostgresSQL 11](https://computingforgeeks.com/install-postgresql-11-on-ubuntu-18-04-ubuntu-16-04/)
* [RabbitMQ](https://computingforgeeks.com/how-to-install-latest-rabbitmq-server-on-ubuntu-18-04-lts/)
* [NodeJS 12.14.1](https://www.ubuntuupdates.org/ppa/nodejs_12.x?dist=bionic)

## Installation

```bash
npm i
```

## Running the app

### development

```bash
npm run start:dev
```

### beta

```bash
npm run build
npm run start:beta
```

### prod

```bash
npm run build
npm run start:prod
```

## Running the app with docker

```bash
docker network create nestjs_example_network
```

#### Update config.json:

```json
  "DB_SETTINGS": {
    "host": "db", // service name from docker-compose.yml
    "port": 5432, // service port from docker-compose.yml
    ...
  },
```

#### Build and run container

```bash
docker-compose -f docker-compose.yml build
```

```bash
docker-compose -f docker-compose.yml exec db sh

createdb nestjs_example_$ENV -U postgres
```

```bash
docker-compose -f docker-compose.yml up
```
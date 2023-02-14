## Description

Service that replays events on start to construct in-memory projection  

[Event store](https://github.com/LeroyChristopherDunn/event-store-nestjs)  
[Nest framework](https://github.com/nestjs/nest)

## Performance
(via rest)  
(MacBook Pro 13-inch, M1, 2020)  
(100k events ~ 30mb in json format)

**Event Replay (page size = 500)**  
100k events = 16s = 0.16ms / event

## Installation

```bash
$ yarn install
```

## Environment Configuration
```
CAT_SERVICE_MIKRO_ORM_TYPE=sqlite
CAT_SERVICE_MIKRO_ORM_DB_NAME=:memory:
CAT_SERVICE_MIKRO_ORM_USER=
CAT_SERVICE_MIKRO_ORM_PASSWORD=
CAT_SERVICE_MIKRO_ORM_DEBUG=0

EVENT_STORE_URL=http://localhost:5000
NUM_SEED_ITERATIONS=0 # seed event store with events
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Nest CLI Commands

```bash
# generate resource 
$ nest generate resource cat

# generate resource 
$ nest generate module cat

# generate controller 
$ nest generate controller cat

# generate service 
$ nest generate service cat
```
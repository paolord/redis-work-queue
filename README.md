# Redis Work Queue
[![Travis](https://travis-ci.org/paolord/redis-work-queue.svg?maxAge=2592000)](https://travis-ci.org/paolord/redis-work-queue) [![npm](https://img.shields.io/npm/v/redis-work-queue.svg?maxAge=2592000)](https://www.npmjs.com/package/redis-work-queue) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/paolord/redis-work-queue/master/LICENSE)

dead-simple distributed work queues in node.js using redis

Status: WIP

Try it: turn on a redis-server and on the same machine run these scripts.

```
// consumer.js
const Queue = require('redis-work-queue');

const queue = new Queue();

consumer.dispatch('recs_service', { query: 'movies' }, (error, response) => {
  console.log(response);
});
```

```
// producer.js
const Queue = require('redis-work-queue');

const queue = new Queue();

queue.subscribe('recs_service', (request, reply) => {
  // request === { query: 'movies' }

  // do some computation/data store access/work

  reply(['comedy', 'action', 'sci-fi']); // return output through a callback
});
```
### Usage

The example above is a simple demonstration of using Redis as a message queue to pass RPC-like calls to services.

### Installation

```
npm install --save redis-work-queue
```
### Tests

Running locally, make sure to have a running redis-server on `127.0.0.1:6379`:

```
$ npm run test:local
```

Using Docker and Docker-Compose:
```
$ npm test
```

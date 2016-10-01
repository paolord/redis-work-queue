# Redis Work Queue
[![Travis](https://travis-ci.org/paolord/redis-work-queue.svg?maxAge=2592000)](https://travis-ci.org/paolord/redis-work-queue) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/paolord/redis-work-queue/master/LICENSE)

dead-simple distributed work queues in node.js using redis (WIP)

Install with:
```
npm install redis-work-queue
```

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

'use strict';

const Redis = require('ioredis');

const md5 = require('crypto').createHash('md5');

class WorkQueue {
  constructor() {
    const args = Array.prototype.slice.call(arguments);
    this.REDIS_HOST = args[0] || '127.0.0.1';
    this.REDIS_PORT = args[1] || 6379;
    this.expireTime = 3;

    this.redis = new Redis(this.REDIS_PORT, this.REDIS_HOST);

    process
      .once('SIGINT', this.shutdown)
      .once('SIGTERM', this.shutdown);
  }

  shutdown() {
    this.redis.quit();
  }

  dispatch(key, request, callback) {
    let returnId = Date.now().toString();
    returnId = md5.update(returnId).digest('hex').substring(0, 8);
    const data = {returnId, request};
    this.redis.lpush(key, JSON.stringify(data));
    this.redis.expire(returnId, this.expireTime);
    this.redis.brpop(returnId, 0, (err, result) => {
      if (err) {
        console.log(err);
        callback('response error');
      }
      callback(null, JSON.parse(result[1]));
    });
  }

  subscribe(key, callback) {
    this.redis.brpop(key, 0, (err, result) => {
      if (err) { return; }
      const data = JSON.parse(result[1]);
      const returnId = data.returnId;
      const request = data.request;
      callback(request, (reply) => {
        this.redis.lpush(returnId, JSON.stringify(reply));
      });
      // process.nextTick(this.subscribe(key, callback));
    });
  }
}

module.exports = WorkQueue;

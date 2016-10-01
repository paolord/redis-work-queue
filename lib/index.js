'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Redis = require('ioredis');

var md5 = require('crypto').createHash('md5');

var WorkQueue = function () {
  function WorkQueue() {
    _classCallCheck(this, WorkQueue);

    var args = Array.prototype.slice.call(arguments);
    this.REDIS_HOST = args[0] || '127.0.0.1';
    this.REDIS_PORT = args[1] || 6379;
    this.expireTime = 3;

    this.redis = new Redis(this.REDIS_PORT, this.REDIS_HOST);

    process.once('SIGINT', this.shutdown).once('SIGTERM', this.shutdown);
  }

  _createClass(WorkQueue, [{
    key: 'shutdown',
    value: function shutdown() {
      this.redis.quit();
    }
  }, {
    key: 'dispatch',
    value: function dispatch(key, request, callback) {
      var returnId = Date.now().toString();
      returnId = md5.update(returnId).digest('hex').substring(0, 8);
      var data = { returnId: returnId, request: request };
      this.redis.lpush(key, JSON.stringify(data));
      this.redis.expire(returnId, this.expireTime);
      this.redis.brpop(returnId, 0, function (err, result) {
        if (err) {
          console.log(err);
          callback('response error');
        }
        callback(null, JSON.parse(result[1]));
      });
    }
  }, {
    key: 'subscribe',
    value: function subscribe(key, callback) {
      var _this = this;

      this.redis.brpop(key, 0, function (err, result) {
        if (err) {
          return;
        }
        var data = JSON.parse(result[1]);
        var returnId = data.returnId;
        var request = data.request;
        callback(request, function (reply) {
          _this.redis.lpush(returnId, JSON.stringify(reply));
        });
        // process.nextTick(this.subscribe(key, callback));
      });
    }
  }]);

  return WorkQueue;
}();

module.exports = WorkQueue;
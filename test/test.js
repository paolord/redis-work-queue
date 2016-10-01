'use strict';

const expect = require('chai').expect;

const RedisWQ = require('../lib/index');

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

let consumer;
let producer;
let queueKey;

describe('Redis Work Queue', () => {
  before(() => {
    queueKey = 'RECOMMENDATION_SERVICE';
  });
  describe('#Consumer', () => {
    before(() => {
      consumer = new RedisWQ(REDIS_HOST, REDIS_PORT);
    });
    it('should receive the correct response from the producer', () => {
      const query = 'movies';
      consumer.dispatch(queueKey, { query }, (error, response) => {
        expect(response).to.equal(['comedy', 'action', 'sci-fi']);
      });
    });
  });
  describe('#Producer', () => {
    before(() => {
      producer = new RedisWQ(REDIS_HOST, REDIS_PORT);
    });
    it('should receive the correct request from the consumer', () => {
      producer.subscribe(queueKey, (request, reply) => {
        expect(request).to.deep.equal({query: 'movies'});
        reply(['comedy', 'action', 'sci-fi']);
      });
    });
  });
});

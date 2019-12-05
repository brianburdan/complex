const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

function fib(index) {
  let a = 0, b = 1, c = 0;
  if (index == 0) {
    return a;
  }
  for(let i = 2; i <= index; i++) {
    c = a + b;
    a = b;
    b = c;
  }
  return b;
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');
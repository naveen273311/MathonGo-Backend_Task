// middlewares/rateLimiter.js
const rateLimit = require("express-rate-limit");
const RedisStoreImport = require("rate-limit-redis"); 
const redisClient = require("../redis/redisClient");

const RedisStore = RedisStoreImport.default; 

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

module.exports = limiter;

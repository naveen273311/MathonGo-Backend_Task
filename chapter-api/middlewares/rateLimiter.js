const rateLimit = require("express-rate-limit");
const Redis = require("ioredis");
const RedisStoreImport = require("rate-limit-redis"); // <-- Import here

require("dotenv").config();

const RedisStore = RedisStoreImport.default || RedisStoreImport; // fallback if .default undefined

const redisClient = new Redis(process.env.REDIS_URL, {
  tls: true,
});

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});

module.exports = limiter;

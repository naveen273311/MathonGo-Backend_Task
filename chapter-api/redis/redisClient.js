const redis = require("redis");
require("dotenv").config();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL, // e.g., rediss://user:password@host:port
  socket: {
    tls: process.env.REDIS_URL.startsWith("rediss://"), // enables TLS only when using rediss
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log("Redis client connected");
  } catch (err) {
    console.error("Redis connection failed:", err);
  }
})();

module.exports = redisClient;

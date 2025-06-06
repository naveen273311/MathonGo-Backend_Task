const redis = require("redis");

const redisClient = redis.createClient({
  url: "redis://localhost:6379", // adjust if needed
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.connect();

module.exports = redisClient;

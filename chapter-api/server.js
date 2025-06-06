const mongoose = require("mongoose");
const { createClient } = require("redis");
const app = require("./app");

const PORT = process.env.PORT || 1000;
const MONGO_URI = process.env.MONGO_URI;
const REDIS_URL = process.env.REDIS_URL;

const startServer = async () => {
  try {
    // MongoDB connection
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Redis connection
    const redisClient = createClient({ url: REDIS_URL });
    await redisClient.connect();
    console.log("Connected to Redis");

    // Make Redis globally available
    app.locals.redis = redisClient;

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();

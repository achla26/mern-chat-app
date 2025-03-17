import Redis from "ioredis";

const redisClient = new Redis({
    port: process.env.REDIS_PORT, // Redis port
    host:  process.env.REDIS_HOST, // Redis host 
    password: process.env.REDIS_PASSWORD, // Redis password 
});
 

redisClient.on("connect", () => {
    console.log("Connected to Redis Server");
});

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

export default redisClient;

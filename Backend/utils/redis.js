
/**
 * Redis utility functions for caching
 * This file provides functions for interacting with Redis cache
 */
const { Redis } = require('@upstash/redis');

/**
 * Create Redis client
 * @returns {RedisClient} Redis client instance
 */
const redis = new Redis({
  url: process.env.REDIS_UPLOAD_URL,
  token: process.env.REDIS_TOKEN,
});

/**
 * Cache data in Redis
 * @param {string} key - Cache key
 * @param {string} value - Value to cache
 * @returns {Promise<void>}
 */
async function redisUtil(key,value){
    try {
        await redis.setex(key,300,value);
    } catch (error) {
        console.error("Error setting value in Redis:", error);
    }
}

/**
 * Get data from Redis cache
 * @param {string} key - Cache key
 * @returns {Promise<string|null>} Cached value or null if not found
 */
async function redisUtilGet(key){
    try {
        const data = await redis.get(key);
        return data;
    } catch (error) {
        console.error("Error getting value in Redis:", error);
    }
}

module.exports = { redisUtil, redisUtilGet };
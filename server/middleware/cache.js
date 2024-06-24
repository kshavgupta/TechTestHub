// middleware/cache.js
import { request } from "express";
import redis from "../database/redis.js";

// Middleware to check the cache
const getCache = (key) => {
  return new Promise((resolve, reject) => {
    redis.get(key, (err, data) => {
      if (err) {
        reject(err); // Reject the Promise with an error if `redis.get` encounters an error
        return;
      }
      resolve(data); // Resolve the Promise with data retrieved from Redis
    });
  });
};
const checkCache = (prefix) => {
  return async (req, res, next) => {
    const key = req.params.Topic || req.params.Company || req.user._id; // Assuming your route param matches your prefix
    const cacheKey = `${prefix}:${key}`;

    try {
      const cachedData = await getCache(cacheKey);
      if (cachedData) {
        console.log(`Retrieving ${key} data from cache...`);
        res.json({ questions: JSON.parse(cachedData) });
      } else {
        console.log(
          `Data for ${key} not found in cache. Proceeding to fetch from database...`
        );
        // Proceed to controller function to fetch from database
        next();
      }
    } catch (error) {
      console.error(
        `Error fetching ${prefix} data from cache: ${error.message}`
      );
      // Proceed to controller function even if cache retrieval fails
      next();
    }
  };
};

// Function to set the cache with a TTL
const setCache = (prefix, key, data, expiration = 3600) => {
  const cacheKey = `${prefix}:${key}`;
  redis.setex(cacheKey, expiration, JSON.stringify(data));
};

// Function to invalidate the cache
const invalidateCache = (prefix, key) => {
  const cacheKey = `${prefix}:${key}`;
  redis.del(cacheKey, (err, response) => {
    if (response === 1) {
      console.log(`Cache for key ${cacheKey} invalidated`);
    } else {
      console.log(`Cache for key ${cacheKey} not found`);
    }
  });
};

export { checkCache, setCache, invalidateCache };

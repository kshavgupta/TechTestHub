import redis from "../database/redis.js";

const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data;
  } catch (err) {
    throw err;
  }
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
        next();
      }
    } catch (error) {
      console.error(
        `Error fetching ${prefix} data from cache: ${error.message}`
      );
      next();
    }
  };
};

const setCache = async (prefix, key, data, expiration = 3600) => {
  const cacheKey = `${prefix}:${key}`;
  try {
    await redis.setEx(cacheKey, expiration, JSON.stringify(data));
    console.log(
      `Cache set for key ${cacheKey} with expiration ${expiration} seconds`
    );
  } catch (err) {
    console.error(`Error setting cache for key ${cacheKey}: ${err.message}`);
  }
};

const invalidateCache = async (prefix, key) => {
  const cacheKey = `${prefix}:${key}`;
  try {
    const response = await redis.del(cacheKey);
    if (response === 1) {
      console.log(`Cache for key ${cacheKey} invalidated`);
    } else {
      console.log(`Cache for key ${cacheKey} not found`);
    }
  } catch (err) {
    console.error(
      `Error invalidating cache for key ${cacheKey}: ${err.message}`
    );
  }
};

export { checkCache, setCache, invalidateCache };

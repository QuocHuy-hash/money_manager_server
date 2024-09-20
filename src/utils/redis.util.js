// lay ip user
const redisClient = require('../config/redis.config');
const path = require('path');
// Check Redis connection
redisClient.on('connect', function () {
    console.log('Connected to Redis');
});

redisClient.on('error', err => console.log('Redis Client Error', err)
);

const get = async (key) => {
    return new Promise((resolve, reject) => {
        redisClient.get(key, (err, data) => {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    })
}

// co the set nhieu lan
const set = async (key, value) => {
    return new Promise((resolve, reject) => {
        redisClient.set(key, value, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data);
        });
    })
}

// set 1 lan duy nhat
const setnx = async (key, value) => {
    return new Promise((resolve, reject) => {
        redisClient.setnx(key, value, (err, data) => {
            if (err) {
                return reject(err);
            }

            resolve(data);
        });
    })
}

// cache tu dong tang with redis
const incr = key => {
    return new Promise((resolve, reject) => {
        // method tu dong tang trong redis
        redisClient.incr(key, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

const decrby = async (key, count) => {
    return new Promise((resolve, reject) => {
        // method tu dong tang trong redis
        redisClient.decrby(key, count, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

// expire key redis
const expire = (key, ttl) => {
    return new Promise((resolve, reject) => {
        // method tu dong tang trong redis
        redisClient.expire(key, ttl, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

// get ttl thoi gian het han con lai
const ttl = (key) => {
    return new Promise((resolve, reject) => {
        // method tu dong tang trong redis
        redisClient.ttl(key, (err, ttl) => {
            if (err) return reject(err);
            resolve(ttl);
        });
    });
}

const exists = async (key) => {
    return new Promise((resolve, reject) => {
        // method tu dong tang trong redis
        redisClient.exists(key, (err, data) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}
const del = async (key) => {
    return new Promise((resolve, reject) => {
        redisClient.del(key, (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}
module.exports = {
    get,
    set,
    setnx,
    incr,
    decrby,
    expire,
    exists,
    ttl,
    del
}
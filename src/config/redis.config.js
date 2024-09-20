
const { createClient } = require('redis');

const redisClient = createClient({
    legacyMode: true,

    socket: {
        port: 6379,
        host: '127.0.0.1',
    },

});




module.exports = redisClient;

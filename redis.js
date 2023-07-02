const redis = require('redis');
const client = redis.createClient({
    // host: process.env.REDIS_HOST || 'localhost',
    host: '127.0.0.1',
    port: 6378,
    // port: process.env.REDIS_PORT || 6378,
    // password: process.env.REDIS_PASSWORD || null,
    // password: process.env.REDIS_PASSWORD || null,
});

client.on('error', function (error) {
    console.error('Redis error', error);
});
client.on('connection', function (results) {
    console.log('Connected to the Redis database. on port ' + process.env.REDIS_PORT)
})

const tes = async () => {
    client.on('error', err => console.log('Redis Client Error', err));

    await client.connect();

    await client.set('key', 'value');
    const value = await client.get('key');
    await client.disconnect();
}


module.exports = client;

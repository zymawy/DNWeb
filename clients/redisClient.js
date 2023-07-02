
class RedisClient {
    get(key) {

        if (redis.connected) {
            console.log(redis.connected)
            // client.get('mykey', (err, value) => { /* ... */ });
        } else {
            console.error('Client is not connected');
        }
       // redis.get(key, function(error, result) {
       //     if (error) {
       //         console.error('Redis get error', error);
       //         // res.status(500).send('Error getting visit count');
       //         return;
       //     }

           // console.log(result)
           // let visitCount = Number(result);
           // if (isNaN(visitCount)) {
           //     // This is the first visit
           //     visitCount = 0;
           // }
           //
           // // Increment the count
           // visitCount++;
           //
           // // Save the new count to Redis
           // redisClient.set(redisKey, visitCount, function(error, result) {
           //     if (error) {
           //         console.error('Redis set error', error);
           //         res.status(500).send('Error saving visit count');
           //         return;
           //     }
           //
           //     // Continue with your existing logic, e.g. render the page
           //     res.render('post', {
           //         postId: postId,
           //         visitCount: visitCount
           //     });
           // });
       // });

       // console.log(result)
    }
}

module.exports = RedisClient
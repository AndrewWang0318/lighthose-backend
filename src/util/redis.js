/* 连接redis数据库 */
const config = require('../../config');
const redis = require('redis');
const client = redis.createClient({
  socket:{
    host:config.redis_setting.host,
    port:config.redis_setting.port,
  }
});

client.connect();
client.on('ready', () => {
  console.log('\x1b[32m%s\x1b[0m','Redis数据库已成功连接...')
});
client.on('error', (err) => {
  console.log('\x1b[33m%s\x1b[0m',`Redis数据库发生错误:\n${err}`)
});

class RedisTool {
  async set(key, val, timeout = 60*60){ // 存储一条数据
    if(typeof val == 'object') val = JSON.stringify(val)
    await client.set(key, val)
    await client.expire(key,timeout)
  }
  async get(key){ // 取出一条数据
    let data = await client.get(key);
    return data
  }
  async destroy(key){ // 销毁一条数据
    client.del(key)
  }
}

module.exports = new RedisTool()
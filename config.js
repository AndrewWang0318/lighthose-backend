const path = require('path'); // 引入path
const mode = process.env.npm_lifecycle_event.includes(':dev') ? 'develop' : 'production'; // 通过npm启动环境判断是生产环境还是开发环境
module.exports = {
  environment: mode, // 环境
  protocol:'http://', // 网络协议
  netWorkAddress:mode == "production" ? '101.35.193.41' : '127.0.0.1', // ip
  port:3000, // 端口
  staticPath: path.join(__dirname, './static'), // 静态服务地址
  should_mysql_association: true, // mysql是否需要关联外键
  mysql_setting:{ // mysql数据库配置
    database: "lighthouse_db",
    user: "root",
    password: "root",
    host: "localhost",
    port: 3306,
    timezone: '08:00'
  },
  redis_setting:{ // redis数据库配置
    host: '127.0.0.1',
    port: 6379
  },
  email_setting:{ // 邮箱服务配置
    name:'绿灯官方',
    user:"3598906343@qq.com",// 邮箱账户
    pass:"metmcscgsbqadbif",// smtp 的授权码
  },
  jwt_secret:'jwtSecretAndrew2021127101',// jwt加密密钥
  md5_secret:'md5SecretAndrew2022020901',// md5加密密钥
  session_redis_secret:'sessionRedisSecretAndrew2022041301',// redis加密密钥
}
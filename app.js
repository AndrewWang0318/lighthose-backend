const Koa = require('koa'); // 引入koa2
const static = require('koa-static') // 引入koa静态资源模块
const range = require('koa-range') // 引入范围请求
const koaBody = require('koa-body') // 引入koa-body
const cors = require("@koa/cors"); // 解决跨域的中间件 koa2-cors
const logger = require('koa-logger'); // koa2日志
// 自定义中间件及配置
const app = new Koa(); // 实例化koa
const config = require('./config.js') // 引入配置文件
const router = require('./src/route/index') // 引入路由文件

const checkToken = require('./src/middleware/checktoken') // 引入自定义验证token中间件
const catchError = require('./src/middleware/catcherror') ; // 全局异常处理

app.use(catchError); // 全局异常捕获[需要在最顶部]
app.use(logger()); // logger用于记录请求日志[需要在中间件顶部]

app.use(cors()); // @koa/cors允许跨域
app.use(range);// 范围请求让静态文件以流方式输出[需要在开启静态资源访问前]
app.use(static(config.staticPath));//启动静态资源访问
app.use(koaBody({ // 支持文件上传
  multipart:true,// 允许多文件上传
  formidable:{
    maxFileSize:8 * 1024 * 1024 * 1024 // 上传文件最大8g，默认2M
  }
}));
app.use(checkToken);// 校验token[需要在访问路由前]
app.use(router.routes(), router.allowedMethods());// 启动路由访问
app.listen(config.port,()=>{// 启动服务
  console.log('\x1B[36m%s\x1B[0m',`Koa2服务运行在: ${config.protocol}${config.netWorkAddress}:${config.port}`);
});
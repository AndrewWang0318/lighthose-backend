const jwt = require('../util/jwt') // 引入封装的jsonwebtoken
const HttpException = require('../util/httpexception');
const passed_route = ['login','register','verify'];
/* 验证token的中间件 */
let checkToken = async (ctx,next)=>{
  const route = ctx.url.toLocaleLowerCase();
  let should_pass = false;
  for (let item of passed_route) if(route.indexOf(item) !== -1) should_pass = true; // 包含该项路由不检查token
  if(should_pass){
    await next();// 进入下一个中间件
  }else{
    let authorization = ctx.request.header['authorization'];
    if(!authorization) throw new HttpException('token不存在,请重登录',401,1401)
    let token = authorization.split(' ')[1]
    let res = jwt.verifyToken(token) // 验证token的结果,res包含用户的uid[未加密]
    await next();
  }
}

module.exports = checkToken
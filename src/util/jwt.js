/* token相关操作 */
const jwt = require("jsonwebtoken"); // 引入jwt
const HttpException = require('./httpexception.js');

const config = require('../../config');
const secret = config.jwt_secret // 密钥 | 加密的时候混淆
class Token {
  createToken = (payload = {}) =>{ // 创建token
    return jwt.sign(payload,secret,{expiresIn:"1day"}) // token签名 有效期为1天
  }
  verifyToken = (token) => { // 验证token
    return jwt.verify(token,secret,(err,decoded) => {
      if(err){ // 错误返回
        switch (err.name) {
          case "TokenExpiredError":// token 过期
            throw new HttpException('token已过期,请重新登录!',401,1401)
          case "JsonWebTokenError":// token 错误
            throw new HttpException('token错误,请重新登录!',401,1401)
          default:
            throw new HttpException(err.message,401,1401);
        }
      } else { // 正确返回
        return { ...decoded };
      }
    })
  }
}

const jwt_token = new Token()
module.exports = jwt_token
const HttpException = require("../util/httpexception.js");
let catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HttpException) {
      // 判断返回的error错误是否是HttpException的子类
      console.log(error);
      ctx.response.body = { msg: error.msg, code: error.code };
      ctx.status = error.status;
    } else {
      // 如果不是则手动返回服务器的错误
      console.log(error.message);
      ctx.response.body = { msg: error.message, code: 9999 };
      ctx.status = 500;
    }
  }
};

module.exports = catchError;

/* 数据库报错操作 */
class HttpException extends Error{ // 继承js的Error类
  constructor(msg ='服务器异常',status = 500,code = 9999){
    super();
    this.msg = msg;
    this.code = code;
    this.status = status;
  }
}

module.exports = HttpException
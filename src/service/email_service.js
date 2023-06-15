const config = require('../../config'); // 引入配置文件
const HttpException = require('../util/httpexception'); // 引入错误抛出工具
const redistool = require('../util/redis'); // 引入redis工具
const $COMMON = require('../util/common'); // 引入公用方法
class EmailSerVice {
  // 存储邮箱验证码
  async setEmailCode( user_key,rondom_code ){
    let key = $COMMON.base64(`${config.session_redis_secret}_${user_key}`);
    let redis_data = { code:rondom_code,status:0 }
    let redis_str = JSON.stringify(redis_data)
    await redistool.set(key,redis_str,60 * 10);// 储存redis 1800秒
  }
  // 校验邮箱验证码
  async verifyEmailCode( user_key,verify_code ){ 
    
    const key = $COMMON.base64(`${config.session_redis_secret}_${user_key}`);
    const str_data = await redistool.get(key);
    let obj_data = str_data ? JSON.parse(str_data) : {};
    if(verify_code == obj_data.code){
      obj_data.status = 1;// 验证成功后修改key的状态为1
      let redis_str = JSON.stringify(obj_data)
      redistool.set(key,redis_str,60 * 10);// 储存redis
    }else{
      throw new HttpException('验证失败',200,1400);
    }
  }
}

module.exports = new EmailSerVice()
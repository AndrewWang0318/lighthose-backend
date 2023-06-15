const md5 = require('md5'); // md5加密
const config = require('../../config'); // 引入配置文件
const { sendEmailCode,verifyEmailCode } = require('../service/email_service'); // 邮箱操作

class EmailController {
  // 发送邮箱验证码
  async sendEmailCode(ctx,next){
    const { user_email } = ctx.request.body;
    const email_type = 'err';
    const user_key =  md5(config.md5_secret + user_email);
    sendEmailCode( email_type,user_email,user_key );
    ctx.response.body = { code: 0, msg:'邮件发送成功' }
  }
  // 验证注册邮箱验证码
  async verifyEmailCode(ctx,next){
    const { user_email,verify_code } = ctx.request.body;
    const email_type = 'err';
    const user_key =  md5(config.md5_secret + user_email);
    await verifyEmailCode( email_type,user_key,verify_code );
    // 验证成功后修改key的状态为1


    ctx.response.body = { code: 0, msg:'验证成功' }
  }
}

module.exports = new EmailController()
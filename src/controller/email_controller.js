const md5 = require('md5'); // md5加密
const config = require('../../config'); // 引入配置文件
const { setEmailCode,verifyEmailCode } = require('../service/email_service'); // 邮箱操作
const $COMMON = require('../util/common'); // 引入公用方法
const nodemailer = require('../util/nodemailer'); // 引入邮件发送工具
class EmailController {
  // 发送邮箱验证码
  async sendEmailCode(ctx,next){
    const { user_email,user_nickname } = ctx.request.body;
    let rondom_code = $COMMON.rondomString(4);
    const { email_title,email_html } = $COMMON.emailHtmlTemplate( rondom_code,user_nickname );
    let res = await nodemailer.sendMail(user_email,email_title,email_html);
    if(res.response.indexOf('OK') == -1) throw new HttpException('验证码发送失败',200,1400);
    const user_key =  md5(config.md5_secret + user_email);
    console.log(user_key)
    await setEmailCode( user_key,rondom_code );
    ctx.response.body = { code: 0, msg:'邮件发送成功' }
  }
  // 验证注册邮箱验证码
  async verifyEmailCode(ctx,next){
    const { user_email,verify_code } = ctx.request.body;
    const user_key =  md5(config.md5_secret + user_email);
    await verifyEmailCode( user_key,verify_code );
    ctx.response.body = { code: 0, msg:'验证成功' }
  }
}

module.exports = new EmailController()
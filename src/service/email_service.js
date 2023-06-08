const config = require('../../config'); // 引入配置文件
const $COMMON = require('../util/common'); // 引入公用方法
const HttpException = require('../util/httpexception'); // 引入错误抛出工具
const nodemailer = require('../util/nodemailer'); // 引入邮件发送工具
const redistool = require('../util/redis'); // 引入redis工具

class EmailSerVice {
  // 发送邮箱验证码
  // err:email_register(通过邮箱注册);upd:update_password(修改密码);voel:verify_old_email(验证旧邮箱);vnel:verify_new_email(验证新邮箱);
  async sendEmailCode( email_type,user_email,user_key,user_nickname ){
    const allow_operate = ['err','upd','voel','vnel'];
    if(!allow_operate.includes(email_type)) throw new HttpException('未授权的操作',400,1400);
    let rondom_code = $COMMON.rondomString(4);
    const { email_title,email_html } = $COMMON.emailHtmlTemplate( email_type,rondom_code,user_nickname );
    let res = await nodemailer.sendMail(user_email,email_title,email_html);
    let key = $COMMON.base64(`${config.session_redis_secret}_${user_key}_${email_type}`);
    redistool.set(key,rondom_code,1800);// 储存redis
    if(res.response.indexOf('OK') == -1) throw new HttpException('验证码发送失败',200,1400);
  }
  // 校验邮箱验证码
  async verifyEmailCode( email_type,user_key,verify_code ){ 
    const key = $COMMON.base64(`${config.session_redis_secret}_${user_key}_${email_type}`);
    const code = await redistool.get(key);
    if(verify_code !== code) throw new HttpException('验证失败',200,1400);
  }
}

module.exports = new EmailSerVice()
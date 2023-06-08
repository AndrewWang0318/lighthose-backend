
const config = require('../../config'); // 引入配置文件
const comMethod = require('../util/common'); // 引入公用方法
const HttpException = require('../util/httpexception'); // 引入错误抛出工具
const nodemailer = require('../util/nodemailer'); // 引入邮件发送工具
const redistool = require('../util/redis'); // 引入redis工具
const { retrieveFromUserName,retrieveFromUserEmail } = require('../service/user_service');
class CommonController {
  // 发送邮箱验证码
  async getEmailCode(ctx,next){
    const { user_email,email_type } = ctx.request.body; // 获取上传参数 
    if(!['eln','upd','voel','vnel'].includes(email_type)) throw new HttpException('未授权的操作',400,1400); // 不属于当前可允许的操作则返回未授权
    /* 
      eln:email_login(邮箱登录);
      upd:update_password(修改密码);
      voel:verify_old_email(验证旧邮箱);
      vnel:verify_new_email(验证新邮箱);
    */
    let user = null
    if(['vnel'].includes(email_type)){ // 如果是验证新邮箱，则新邮箱在用户数据中不存在,需要通过user_name查询用户数据
      const { user_name } = ctx.request.body;
      user = await retrieveFromUserName(user_name);
    }else{
      user = await retrieveFromUserEmail(user_email);
    }
    if(!user) throw new HttpException('该用户不存在',400,1400);
    let rondom_string = comMethod.rondomString(6); // 6位随机字符串,用于验证码
    const user_info = user.dataValues; // 解析出当前用户的信息
    const { email_title,email_html } = htmlTemplate(email_type,user_info.user_nickname,rondom_string);
    let res = await nodemailer.sendMail(user_email,email_title,email_html);

    let key = comMethod.base64(`${config.session_redis_secret}_${user_info.user_id}_${email_type}`);
    let content = {code:rondom_string,email:user_email};// 储存进redis的内容
    redistool.setItem(key,content,1800);
    if(res.response.indexOf('OK') !== -1){
      ctx.response.body = { code: 0, msg:'邮件发送成功' }
    }else{
      ctx.response.body = { code: 400,msg:'邮件发送失败' }
    }
  }
  // 校验邮箱验证码
  async checkEmailCode(ctx,next){
    const { user_email,email_code,email_type } = ctx.request.body; // 获取上传参数
    let user = null
    if(['vnel'].includes(email_type)){ // 如果是验证新邮箱，则新邮箱在用户数据中不存在,需要通过user_name查询用户数据
      const { user_name } = ctx.request.body;
      user = await retrieveFromUserName(user_name);
    }else{
      user = await retrieveFromUserEmail(user_email);
    }
    if(!user) throw new HttpException('该用户不存在',400,1400);
    let user_info = user.dataValues
    let key = comMethod.base64(`${config.session_redis_secret}_${user_info.user_id}_${email_type}`);
    let redis_data = await redistool.getItem(key);
    const { code } = JSON.parse(redis_data) 
    if(email_code === code){
      ctx.response.body = { code: 0, msg:'验证成功' }
    }else{
      ctx.response.body = { code: 400, msg:'验证失败' }
    }
  }
}

// 返回email的html内容
function htmlTemplate(email_type,user_nickname,code){
  let email_title,operate_text,email_html; // 发送邮件的标题,执行的操作,返回的内容
  switch (email_type) { // 规则:最后一个单词取首位两个字母,其他单词取首字母
    case 'eln':
      email_title = '生态圈账号安全中心-登录操作提醒'
      operate_text = '邮箱验证登录'
      break;
    case 'upd':
      email_title = '生态圈账号安全中心-改密操作提醒'
      operate_text = '修改登录密码'
      break;
    case 'voel':
      email_title = '生态圈账号安全中心-验证旧邮箱操作提醒'
      operate_text = '验证旧邮箱'
      break;
    case 'vnel': 
      email_title = '生态圈账号安全中心-确认新邮箱操作提醒'
      operate_text = '确认新邮箱'
      break;
    default:
      break;
  }
  email_html = `<div>
  <div>尊敬的生态圈用户${user_nickname}您好:</div>
    <div style="text-indent: 16px;">您正在进行${operate_text}的操作,本次请求的邮件验证码是:
      <span style="color: blue;">${code}</span>
      (为了保证您的账号安全性,请您在30分钟内完成设置)
    </div>
  </div>
  <div>本验证码30分钟内有效,请及时输入。</div>
  <p>为了保证账号安全,请勿泄漏此验证码</p>`
  return {
    email_title,
    email_html,
  }
}

module.exports = new CommonController()
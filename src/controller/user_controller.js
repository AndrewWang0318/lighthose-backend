const md5 = require('md5'); // md5加密
const nodemailer = require('../util/nodemailer'); // 引入邮件发送工具
const config = require('../../config'); // 引入配置文件
const $COMMON = require('../util/common'); // 引入公用方法
const jwt = require('../util/jwt'); // 引入jwt封装的token
const HttpException = require('../util/httpexception'); // 引入错误抛出工具
const redis = require('../util/redis'); // 引入redis工具
const Mock = require('mockjs'); // 引入mock用来随机生成用户部分信息
const { 
  createUser,
  createUserByEmail,
  retrieveFromUserName,
  retrieveFromUserEmail,
  retrieveFromUserId,
  updateUser,
  updateUserAvatar,
  updateUserPassword,
  updateUserEmail 
} = require('../service/user_service');
const { writeFiles } = require('../util/filedeal'); // 写入文件
const { sendEmailCode,verifyEmailCode } = require('../service/email_service'); // 邮箱操作
const validator = require('validator'); // 正则判断
class UserController {
  // 通过用户名注册
  async register(ctx,next){
    const { user_name,user_password  } = ctx.request.body;
    let user_password_encrypt = md5(config.md5_secret + user_password); // md5加密密码
    let user_nickname = Mock.Random.name(); // 随机昵称
    let user_avatar = `${config.protocol}${config.netWorkAddress}:${config.port}/avatar/default_avatar${Math.floor(Math.random()*12) + 1}.jpeg`; // 随机默认头像
    const res = await createUser(user_name,user_password_encrypt,user_nickname,user_avatar);
    if(res.dataValues) ctx.response.body = { code:0,msg:'注册成功' };
  }
  // 通过邮箱注册
  async registerByEmail(ctx,next){
    const { user_email,email_code,user_password  } = ctx.request.body;
    const email_type = 'err';
    const user_key =  md5(config.md5_secret + user_email);
    await verifyEmailCode( email_type,user_key,email_code ); // 验证验证码是否正确
    const timestamp = new Date().getTime(); // 获取时间戳,用于不重复命名
    const user_name = $COMMON.rondomString(2) + timestamp; // 自定义用户名
    const user_password_encrypt = md5(config.md5_secret + user_password); // md5加密密码
    const user_nickname = Mock.Random.name(); // 随机昵称
    const user_avatar = `${config.protocol}${config.netWorkAddress}:${config.port}/avatar/default_avatar${Math.floor(Math.random()*12) + 1}.jpeg`; // 随机默认头像
    const res = await createUserByEmail( user_name,user_password_encrypt,user_nickname,user_avatar,user_email );
    if(res.dataValues) ctx.response.body = { code:0,msg:'注册成功' };
  }
  // 发送注册邮箱验证码
  async sendRegisterByEmailCode(ctx,next){
    const { user_email } = ctx.request.body;
    const email_type = 'err';
    const user_key =  md5(config.md5_secret + user_email);
    sendEmailCode( email_type,user_email,user_key );
    ctx.response.body = { code: 0, msg:'邮件发送成功' }
  }
  // 验证注册邮箱验证码
  async verifyRegisterByEmailCode(ctx,next){
    const { user_email,verify_code } = ctx.request.body;
    const email_type = 'err';
    const user_key =  md5(config.md5_secret + user_email);
    await verifyEmailCode( email_type,user_key,verify_code );
    ctx.response.body = { code: 0, msg:'验证成功' }
  }
  // 是否重名验证,邮箱或用户名
  async repeatVerify(ctx,next){
    const { verify_type,verify_string } = ctx.request.body;
    let res = null;
    if(verify_type == 'user_name') res = await retrieveFromUserName(verify_string);
    if(verify_type == 'user_email') res = await retrieveFromUserEmail(verify_string);
    if(res && res !== null)  throw new HttpException('用户已存在',200,1400);
    ctx.response.body = { code: 0, msg:'用户不存在' }
  }
  // 登录
  async login(ctx,next){
    const { user_name,user_password } = ctx.request.body;
    let res = null;
    if(validator.isEmail(user_name)){
      res = await retrieveFromUserEmail(user_name);
      if(!res) throw new HttpException('邮箱不存在',200,1400);
    }else{
      res = await retrieveFromUserName(user_name);
      if(!res) throw new HttpException('用户名不存在',200,1400);
    }
    let user_info = res.dataValues;
    let user_password_encrypt = md5(config.md5_secret + user_password);
    if(user_info.user_password !== user_password_encrypt) throw new HttpException('密码错误',400,1400);
    let token = jwt.createToken({ user_id:user_info.user_id })
    ctx.response.body = { code:0,msg:'登录成功',user_info,token }
  }

  // 修改用户基础信息[昵称,性别,生日,签名,地址]
  async update(ctx,next){
    const { user_id,user_name,user_nickname,user_sex,user_birth,user_signature,user_locat } = ctx.request.body// 如果不修改某项可不上传
    let user = await retrieveFromUserName(user_name);
    if(!user) throw new HttpException('该用户不存在',400,1400);
    await updateUser(user_id,user_name,user_nickname,user_sex,user_birth,user_signature,user_locat); 
    ctx.response.body = { msg:'修改成功',code:0 }
  }
   // 修改用户头像
   async updateAvatar(ctx,next){
    const { user_id,user_name,avatar_type } = ctx.request.body; // 获取上传参数 
    let user = await retrieveFromUserName(user_name);
    if(!user) throw new HttpException('该用户不存在',400,1400);
    if(avatar_type == 1){ // 文件上传方式
      const { avatar_file } = ctx.request.files; // 获取上传文件
      let file_res = await writeFiles(avatar_file);
      if(file_res.code !== 0) throw new HttpException('文件上传失败',412,1412);
      let user_avatar = file_res.data[0].file_url;
      let res = await updateUserAvatar(user_id,user_name,user_avatar);
      ctx.response.body = { msg:'头像修改成功',code:0 }
    }else{ // 随机头像方式
      let randomNum = Math.floor(Math.random()*12) + 1; // 随机1-12
      let user_avatar = `${config.protocol}${config.netWorkAddress}:${config.port}/avatar/default_avatar${randomNum}.jpeg`; // 设置文件的线上目录和文件名
      let res = await updateUserAvatar(user_id,user_name,user_avatar);
      ctx.response.body = { msg:'头像修改成功',code:0 }
    }
  }
  // 注册用户首次添加邮箱
  async addUserEmail(ctx,next){
    const { user_name,user_email,email_code } = ctx.request.body; // 获取上传参数
    const token_user_info = ctx.user_info;
    let user = await retrieveFromUserId(token_user_info.user_id);
    if(!user) throw new HttpException('用户不存在',400,1400);
    let user_info = user.dataValues;
    let key = $COMMON.base64(`${config.session_redis_secret}_${user_info.user_id}_vnel`); // 用于记录验证码
    let email_key = $COMMON.base64(`${config.session_redis_secret}_${user_info.user_id}_inel`); // 用于记录获得验证码的邮箱

    let code = await redis.get(key);
    let email = await redis.get(email_key);
    if(email_code !== code) throw new HttpException('修改失败,验证码错误',400,1400); // 验证码如果错误则不让修改
    if(user_email !== email) throw new HttpException('当前邮箱与验证邮箱不符',400,1400);
    let res = await updateUserEmail(user_info.user_id,user_name,user_email); // 修改
    redis.destroy(key); // 修改完成后删除redis中数据
    redis.destroy(email_key);
    ctx.response.body = { msg:'修改成功',code:0 }
  }
  // 修改用户密码
  async updatePassword(ctx,next){
    const { user_name,user_password,email_code } = ctx.request.body; // 获取上传参数
    let user_password_encrypt = md5(config.md5_secret + user_password); // md5加密密码
    let user = await retrieveFromUserName(user_name);
    if(!user) throw new HttpException('该用户不存在',400,1400);
    let user_info = user.dataValues
    if(!user_info.user_email) throw new HttpException('当前用户邮箱不存在,请先绑定邮箱~',400,1400);
    let key = $COMMON.base64(`${config.session_redis_secret}_${user_info.user_id}_pd`);
    let code = await redis.get(key);
    if(email_code !== code) throw new HttpException('修改失败,验证码错误',400,1400); // 验证码如果错误则不让修改
    let res = await updateUserPassword(user_info.user_id,user_name,user_password_encrypt); // 修改
    redis.destroy(key);
    ctx.response.body = { msg:'修改成功',code:0 }
  }
  // 修改用户邮箱
  async updateEmail(ctx,next){
    const { user_name,user_email,email_code,nemail_code } = ctx.request.body; // 获取上传参数
    let user = await retrieveFromUserName(user_name);
    if(!user) throw new HttpException('该用户不存在',400,1400);
    let user_info = user.dataValues
    let key = $COMMON.base64(`${config.session_redis_secret}_${user_info.user_id}_el`);
    let nkey = $COMMON.base64(`${config.session_redis_secret}_${user_info.user_id}_nel`);
    let code = await redis.get(key);
    let ncode = await redis.get(nkey);
    if(email_code !== code || nemail_code !== ncode) throw new HttpException('修改失败,验证码错误',400,1400); // 验证码如果错误则不让修改
    let res = await updateUserEmail(user_info.user_id,user_name,user_email); // 修改
    redis.destroy(key);
    redis.destroy(nkey);
    ctx.response.body = { msg:'修改成功',code:0 }
  }
}

module.exports = new UserController()
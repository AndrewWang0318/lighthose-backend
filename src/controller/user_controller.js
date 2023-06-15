const md5 = require('md5'); // md5加密
const config = require('../../config'); // 引入配置文件
const $COMMON = require('../util/common'); // 引入公用方法
const jwt = require('../util/jwt'); // 引入jwt封装的token
const HttpException = require('../util/httpexception'); // 引入错误抛出工具
const redis = require('../util/redis'); // 引入redis工具
const redistool = require('../util/redis'); // 引入redis工具
const Mock = require('mockjs'); // 引入mock用来随机生成用户部分信息
const { createUser, checkUserFromName,updateUserInfo,updateUserAvatar,updateUserPassword, updateUserEmail } = require('../service/user_service');
const { writeFiles } = require('../util/filedeal'); // 写入文件
const validator = require('validator'); // 正则判断
class UserController {
  // 登录
  async login(ctx,next){
    const { user_name,user_password } = ctx.request.body;
    let res = await checkUserFromName(user_name);
    if(!res) throw new HttpException('用户不存在',200,1400);
    let user_info = res.dataValues;
    let user_password_encrypt = md5(config.md5_secret + user_password);
    if(user_info.user_password !== user_password_encrypt) throw new HttpException('密码错误',400,1400);
    let token = jwt.createToken({ user_info:{user_id:user_info.user_id} })
    ctx.response.body = { code:0,msg:'登录成功',user_info,token }
  }
  // 注册
  async register(ctx,next){
    const { user_name,user_password  } = ctx.request.body;
    let user_password_encrypt = md5(config.md5_secret + user_password); // md5加密密码
    let user_nickname = Mock.Random.name(); // 随机昵称
    let user_avatar = `${config.protocol}${config.netWorkAddress}:${config.port}/image/avatar/default_avatar${Math.floor(Math.random()*12) + 1}.jpeg`; // 随机头像
    const res = await createUser(user_name,user_password_encrypt,user_nickname,user_avatar);
    if(res.dataValues) ctx.response.body = { code:0,msg:'注册成功' };
  }
  // 修改基本信息
  async updateInfo(ctx,next){
    const { user_id,user_name,user_nickname,user_sex,user_birth,user_signature,user_locat } = ctx.request.body// 如果不修改某项可不上传
    await updateUserInfo(user_id,user_name,user_nickname,user_sex,user_birth,user_signature,user_locat);
    ctx.response.body = { msg:'修改成功',code:0 }
  }
  // 修改密码
  async updatePassword(ctx,next){
    const { user_id,user_name,user_old_password,user_new_password } = ctx.request.body; // 获取上传参数
    let user_old_password_encrypt = md5(config.md5_secret + user_old_password); // md5加密后的旧密码
    let user_user_new_password = md5(config.md5_secret + user_new_password); // md5加密后的新密码
    await updateUserPassword(user_id,user_name,user_old_password_encrypt,user_user_new_password); // 修改
    ctx.response.body = { msg:'修改成功',code:0 }
  }
  // 修改头像
  async updateAvatar(ctx,next){
    const { user_id,avatar_type } = ctx.request.body; // 获取上传参数
    let user_avatar = ""
    if(avatar_type == 1){ // 文件上传方式
      const { avatar_file } = ctx.request.files; // 获取上传文件
      let file_res = await writeFiles(avatar_file);
      if(file_res.code !== 0) throw new HttpException('文件上传失败',412,1412);
      user_avatar = file_res.data[0].file_url;
    }else{ // 随机头像方式
      let randomNum = Math.floor(Math.random()*12) + 1; // 随机1-12
      user_avatar = `${config.protocol}${config.netWorkAddress}:${config.port}/image/avatar/default_avatar${randomNum}.jpeg`; // 设置文件的线上目录和文件名
    }
    await updateUserAvatar(user_id,user_avatar);
    ctx.response.body = { msg:'头像修改成功',code:0 }
  }
  // 修改邮箱
  async updateEmail(ctx,next){
    const { user_id,user_email } = ctx.request.body; // 获取上传参数
    const user_key =  md5(config.md5_secret + user_email);
    let key = $COMMON.base64(`${config.session_redis_secret}_${user_key}`);
    let str_data = await redistool.get(key);
    let obj_data = str_data ? JSON.parse(str_data) : {};
    if(obj_data.status != 1) throw new HttpException('修改失败,验证码未验证',400,1400); // 验证码如果错误则不让修改
    await updateUserEmail(user_id,user_email); // 修改
    redis.destroy(key);// 验证成功后删除key
    ctx.response.body = { msg:'修改成功',code:0 }
  }
}

module.exports = new UserController()
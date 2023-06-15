const { User } = require('../model');
const HttpException = require('../util/httpexception');

class UserSerVice {
  // 根据用户名查询用户是否存在
  async checkUserFromName(user_name){
    return await User.findOne({
      where: { user_name }
    })
  }
  // 新增用户
  async createUser(user_name,user_password,user_nickname,user_avatar){
    const data = await User.create({
      user_name,
      user_password,
      user_nickname,
      user_avatar
    }).catch((err)=>{
      throw new HttpException(err.errors[0].message)
    })
    return data
  }
  // 修改用户基本资料
  async updateUserInfo(user_id,user_name,user_nickname,user_sex,user_birth,user_signature,user_locat){
    const data = await User.update({
      user_name,
      user_nickname,
      user_sex,
      user_birth,
      user_signature,
      user_locat,
    },{
      where: { user_id }
    }).catch((err)=>{
      throw new HttpException(err.message)
    })
    return data
  }
  // 修改用户头像
  async updateUserAvatar(user_id,user_avatar){
    const data = await User.update({
      user_avatar
    },{
      where: { user_id }
    }).catch((err)=>{
      throw new HttpException(err.message)
    });
    return data
  }
  // 修改用户密码
  async updateUserPassword(user_id,user_old_password,user_new_password){
    const data = await User.update({
        user_password:user_new_password
      },{
        where: { user_id,user_password:user_old_password }
      }).catch((err)=>{
        throw new HttpException(err.message)
      }
    );
    return data
  }
  // 修改用户邮箱
  async updateUserEmail(user_id,user_email){
    const data = await User.update({
      user_email
    },{
      where: { user_id }
    }).catch((err)=>{
      throw new HttpException(err.message)
    });
    return data
  }
}

// 报错信息不应该在service层处理,应转向controller层

module.exports = new UserSerVice()
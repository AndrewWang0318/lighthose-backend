const { User } = require('../model');
const HttpException = require('../util/httpexception');
class UserSerVice {
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
  // 通过邮箱新增用户
  async createUserByEmail(user_name,user_password,user_nickname,user_avatar,user_email){
    const data = await User.create({
      user_name,
      user_password,
      user_nickname,
      user_avatar,
      user_email,
    }).catch((err)=>{
      throw new HttpException(err.errors[0].message)
    })
    return data
  }

  // 根据用户名查询用户
  async retrieveFromUserName(user_name){
    return await User.findOne({
      where: { user_name }
    })
  }
  // 根据邮箱查询用户
  async retrieveFromUserEmail(user_email){
    return await User.findOne({
      where: { user_email }
    })
  }
  // 根据用户id查询用户
  async retrieveFromUserId(user_id){
    return await User.findOne({
      where: { user_id }
    })
  }
  
  
  // 修改用户基本资料
  async updateUser(user_id,user_name,user_nickname,user_sex,user_birth,user_signature,user_locat){
    const data = await User.update({
      user_nickname,
      user_sex,
      user_birth,
      user_signature,
      user_locat,
    },{
      where: { user_id, user_name }
    }).catch((err)=>{
      throw new HttpException(err.message)
    })
    return data
  }
  // 修改用户头像
  async updateUserAvatar(user_id,user_name,user_avatar,user_avatar_id){
    const data = await User.update({
      user_avatar,
      user_avatar_id
    },{
      where: { user_id, user_name }
    }).catch((err)=>{
      throw new HttpException(err.message)
    });
    return data
  }
  // 修改用户密码
  async updateUserPassword(user_id,user_name,user_password){
    const data = await User.update({
        user_password
      },{
        where: { user_id,user_name }
      }).catch((err)=>{
        throw new HttpException(err.message)
      }
    );
    return data
  }
  // 修改用户邮箱
  async updateUserEmail(user_id,user_name,user_email){
    const data = await User.update({
      user_email
    },{
      where: { user_id,user_name }
    }).catch((err)=>{
      throw new HttpException(err.message)
    });
    return data
  }
}

module.exports = new UserSerVice()
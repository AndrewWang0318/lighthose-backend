const { Like } = require('../model');
const HttpException = require('../util/httpexception'); // 引入错误抛出工具
class LikeService {
  // 新增赞
  async createLike(like_dynamic_id,like_user_id){
    const data = await Like.create({
      like_dynamic_id,
      like_user_id,
    }).catch((err)=>{
      throw new HttpException(err.errors[0].message)
    })
    return data
  }
  // 删除赞
  async deleteLike(like_id,like_user_id){
    const data = await Like.destroy({
      where: {
        like_id,
        like_user_id
      },
    }).catch((err)=>{
      throw new HttpException(err.message)
    })
    return data
  }
  
  // 查询点赞(用于判断是否已经点过赞)
  async retrieveLike(like_dynamic_id,like_user_id){
    const data = await Like.findAll({
      where: {
        like_dynamic_id,
        like_user_id,
      }
    }).catch((err)=>{
      throw new HttpException(err.message)
    })
    return data
  }
}
module.exports = new LikeService()
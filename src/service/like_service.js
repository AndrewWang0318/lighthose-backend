const { Like } = require('../models/model');
const HttpException = require('../utils/httpexception');
class LikeService {
  // 新增赞
  async createLike(like_user_id,like_guide_id,module_id){
    const data = await Like.create({
      like_user_id,
      like_guide_id,
      module_id
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
  // 查询点赞[模块引导id及模块id]
  async retrieveLike(like_guide_id,module_id){
    const data = await Like.findAll({
      attributes: { exclude: [ 'module_id','like_guide_id','like_user_id','updatedAt' ] }, // 排除部分属性
      include:[
        {
          association: 'like_user',
          attributes: ['user_id','user_nickname','user_avatar' ], // 只需要某些属性
        }
      ],
      where: {
        like_guide_id,
        module_id,
      }
    }).catch((err)=>{
      throw new HttpException(err.message)
    })
    return data
  }
}
module.exports = new LikeService()
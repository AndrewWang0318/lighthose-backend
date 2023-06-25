const { Dynamic } = require('../model');
const { Op } = require("sequelize");
const HttpException = require('../util/httpexception'); // 引入错误抛出工具
class DynamicSerVice {
  // 新增动态
  async createDynamic(dynamic_user_id,dynamic_content,dynamic_media){
    const data = await Dynamic.create({
      dynamic_user_id,
      dynamic_content,
      dynamic_media,
    }).catch((err)=>{
      throw new HttpException(err.errors[0].message)
    })
    return data
  }
  // 查询动态
  async retrieveDynamic(limit,offset){
    const data = await Dynamic.findAll({
      attributes: { exclude: [ 'dynamic_user_id','type','updatedAt' ] }, // 排除部分属性
      include: [
        {
          association: 'dynamic_user', // 关联用户表,只需要一个关联键
          attributes: ['user_nickname','user_avatar','user_id']// 只需要某些属性
        },
        // {
        //   association: 'dynamic_comment',// 关联评论表
        //   attributes: [ 'comment_id','createdAt' ],
        //   where:{ 
        //     'comment_guide_id': { [Op.col]: 'Dynamic.dynamic_id' } 
        //   },
        //   required: false,
        //   include:[ // 内部仍需要关联,需要继续include,以及attributes
        //     {
        //       association: 'comment_user',
        //       attributes: ['user_id','user_nickname','user_avatar' ],
        //     },
        //     {
        //       association: 'comment_parent',
        //       attributes: ['user_id','user_nickname','user_avatar' ],
        //     },
        //   ],
        // },
        // {
        //   association: 'dynamic_like',// 管理点赞表,存在多个键关联需要使用Op.col关联查询
        //   attributes: [ 'like_id','createdAt' ],
        //   where:{
        //     'like_guide_id': { [Op.col]: 'Dynamic.dynamic_id' }, 
        //   },
        //   required: false, // 查询方式修改为LEFT OUTER JOIN
        //   include:[ // 内部仍需要关联,需要继续include,以及attributes
        //     {
        //       association: 'like_user',
        //       attributes: ['user_id','user_nickname','user_avatar' ],
        //     }
        //   ],
        // }
      ],
      // include: { all: true, nested: true }, // 递归获取与用户及其嵌套关联关联的所有模型[但同时两个外键指引无法处理会将所有关联的返回在实例上]
      order:[
        ['created_at', 'DESC'] // 按照添加的顺序倒叙排列
      ],
      offset:Number(offset),// 偏移[跳过]多少条
      limit:Number(limit),// 限制每次显示几条
    }).catch((err)=>{
      throw new HttpException(err.message)
    })
    return data
  }
  // 删除动态
  async deleteDynamic(dynamic_id){
    const data = await Dynamic.destroy({
      where: {
        dynamic_id,
      },
    }).catch((err)=>{
      throw new HttpException(err.message)
    })
    return data
  }
}
module.exports = new DynamicSerVice()
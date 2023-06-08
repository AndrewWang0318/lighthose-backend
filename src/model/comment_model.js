const { DataTypes } = require('sequelize');
const sequelize = require('../util/sequelize');

// 创建评论数据模型
const Comment = sequelize.define('Comment',{
  comment_id:{ type:DataTypes.INTEGER(8), allowNull:false, unique:true, autoIncrement:true, primaryKey:true,comment:'评论id' },
  comment_text:{ type:DataTypes.TEXT,comment:'评论的内容' },
  comment_from_user_id:{ type:DataTypes.INTEGER(8),comment:'评论的用户id' },
  comment_to_user_id:{ type:DataTypes.INTEGER(8),defaultValue: 0,comment:'评论目标用户id' }, // 大于0为首个回复
  comment_parent_id:{ type:DataTypes.INTEGER(8),defaultValue: 0,comment:'目标评论id' }, // 评论的回复
  comment_guide_id:{ type:DataTypes.INTEGER(8),comment:'其他模块的主键id'},
  module_id:{ type:DataTypes.INTEGER(8),comment:'评论的模块id' },
},{
  underscored: true 
})

module.exports = Comment
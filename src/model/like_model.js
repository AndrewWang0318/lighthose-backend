const { DataTypes } = require('sequelize');
const sequelize = require('../util/sequelize');

// 创建点赞数据模型
const Like = sequelize.define('Like',{
  like_id:{ type:DataTypes.INTEGER(8), allowNull:false, unique:true, autoIncrement:true, primaryKey:true,comment:'点赞的id' },
  like_user_id:{ type:DataTypes.INTEGER(8),comment:'点赞的用户id' },

  like_dynamic_id:{ type:DataTypes.INTEGER(8),comment:'评论表主键id'}, // 评论

},{
  underscored: true 
})

module.exports = Like
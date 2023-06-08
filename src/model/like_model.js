const { DataTypes } = require('sequelize');
const sequelize = require('../util/sequelize');

// 创建点赞数据模型
const Like = sequelize.define('Like',{
  like_id:{ type:DataTypes.INTEGER(8), allowNull:false, unique:true, autoIncrement:true, primaryKey:true,comment:'点赞的id' },
  like_user_id:{ type:DataTypes.INTEGER(8),comment:'点赞的用户id' },


  like_guide_id:{ type:DataTypes.INTEGER(8),comment:'其他模块的主键id'},
  module_id:{ type:DataTypes.INTEGER(8),comment:'点赞属于的模块id' },// 1.视频 2.音乐 3.图书 4.动态
},{
  underscored: true 
})

module.exports = Like
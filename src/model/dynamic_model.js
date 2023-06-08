const { DataTypes } = require('sequelize');
const sequelize = require('../util/sequelize');

// 创建文章数据模型
const Dynamic = sequelize.define('Dynamic',{
  dynamic_id:{ type:DataTypes.INTEGER(8), allowNull:false, unique:true, autoIncrement:true, primaryKey:true,comment:'文章id' },
  dynamic_text:{type:DataTypes.TEXT, comment:'文章内容'},
  dynamic_media_url:{ type:DataTypes.TEXT,comment:'分享的媒体文件地址'},

  dynamic_user_id:{ type:DataTypes.INTEGER(8),comment:'发布者id' },
  dynamic_module_id:{ type:DataTypes.INTEGER(8),defaultValue: 4,comment:'评论的模块id' },
},{
  underscored: true 
})

module.exports = Dynamic
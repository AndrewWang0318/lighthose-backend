const { DataTypes } = require("sequelize");
const sequelize = require("../util/sequelize");

// 创建文章数据模型
const Dynamic = sequelize.define(
  "Dynamic",
  {
    dynamic_id: { type: DataTypes.INTEGER(8),allowNull: false,unique: true,autoIncrement: true,primaryKey: true,comment: "文章id"},
    dynamic_user_id: { type: DataTypes.INTEGER(8), comment: "发布者id" },
    dynamic_content: { type: DataTypes.TEXT, comment: "文章内容" },
    dynamic_media: { type: DataTypes.TEXT, comment: "分享的媒体文件地址" },
    type: { type: DataTypes.INTEGER(2), defaultValue: 1, comment: "类型" }// 用于区分属于哪个模块:1.动态
  },
  {
    underscored: true,
  }
);

module.exports = Dynamic;

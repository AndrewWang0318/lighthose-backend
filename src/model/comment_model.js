const { DataTypes } = require("sequelize");
const sequelize = require("../util/sequelize");

// 创建评论数据模型
const Comment = sequelize.define(
  "Comment",
  {
    comment_id: {
      type: DataTypes.INTEGER(8),
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
      comment: "评论id",
    },
    comment_dynamic_id:{
      type: DataTypes.INTEGER(8),
      comment: "评论的动态id",
    },
    comment_user_id: {
      type: DataTypes.INTEGER(8),
      comment: "评论的用户id",
    },

    comment_father_id: {
      type: DataTypes.INTEGER(8),
      comment: "评论的目标id",
    },
    comment_to_user_id: {
      type: DataTypes.INTEGER(8),
      comment: "向谁评论用户id",
    },

    comment_content: {
      type: DataTypes.TEXT,
      comment: "评论的内容",
    },
    type: {
      type: DataTypes.INTEGER(2),
      defaultValue: 1,
      comment: "评论的类型",
    }, // 用于区分属于哪个模块:1.动态
  },
  {
    underscored: true,
  }
);

module.exports = Comment;

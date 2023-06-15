const { DataTypes } = require('sequelize')
const sequelize = require('../util/sequelize');

// 创建用户数据模型
const User = sequelize.define('User',{ // Sequelize 会自动将模型名复数并将其用作表名
  user_id:{ type:DataTypes.INTEGER(8), allowNull:false, unique:true, autoIncrement:true, primaryKey:true, comment:'id' }, // 自定义主键,如果当前没有主键,Sequelize 会自动创建和管理id字段
  user_name:{type:DataTypes.STRING(16), allowNull:false, unique:true, comment:'用户名' },
  user_password:{ type:DataTypes.STRING(64), allowNull:false, comment:'密码' },
  user_nickname:{ type:DataTypes.STRING(16), allowNull:false, comment:'昵称' },
  user_sex:{ type:DataTypes.INTEGER(2), defaultValue: 0, comment:'性别'},
  user_birth:{ type:DataTypes.DATEONLY, comment:'出生年月'},
  user_signature:{type:DataTypes.TEXT, comment:'个性签名'},
  user_email:{ type:DataTypes.STRING(32),unique:true, comment:'邮箱' },
  user_phone:{ type:DataTypes.STRING(16), comment:'电话' },
  user_locat:{ type:DataTypes.STRING(128), comment:'地址' },
  user_avatar:{ type:DataTypes.STRING(255), comment:'头像地址' },
  user_authority:{ type:DataTypes.INTEGER(2), defaultValue: 0, comment:'权限' }
},{
  timestamps: true, // 创建时间和更新时间,默认为开启状态,这意味着直接 SQL 查询(例如,通过任何其他方式在不使用 Sequelize 的情况下执行的查询)将不会导致这些字段自动更新.
  underscored: true // 使用下划线自动添加的字段会在数据段中使用蛇型命名规则
})



module.exports = User
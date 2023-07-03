
// 视频数据模型关系[需要先初始化数据库后再添加关联关系],Sequelize 关联通常成对定义
// A.hasOne(B) 关联意味着 A 和 B 之间存在一对一的关系,外键在目标模型(B)中定义. 和 belongsTo 关联一起使用
// A.belongsTo(B)关联意味着 A 和 B 之间存在一对一的关系,外键在源模型中定义(A).
// A.hasMany(B) 关联意味着 A 和 B 之间存在一对多关系,外键在目标模型(B)中定义. 和 belongsTo 关联一起使用
// 创建一个 多对多 关系, 两个 belongsToMany 调用一起使用
const sequelize = require('../util/sequelize')
const config = require('../../config');
const User = require('./user_model');
const Dynamic = require('./dynamic_model');
const Comment = require('./comment_model');
const Like = require('./like_model');

// 同步所有模型alter force,
// config.should_mysql_association = true // 同步模型前需要先将config.should_mysql_association改为false后再同步,然创建表格再联系外联
// sequelize.sync({ force: true }).then(res =>{
//   console.log("-----------------------------------------所有模型已同步成功-----------------------------------------");
//   config.should_mysql_association = true
// }).catch(err => {
//   console.log(`-----------------------------------------模型同步失败-----------------------------------------:\n${err}`);
// });

if(config.should_mysql_association){// 是否允许mysql使用外键,防止数据库初始化失败
  // User与各表关系
  // User.hasMany( Dynamic, { as:'dynamic_user', foreignKey: 'dynamic_user_id' })
  // User.hasMany( Like, { as:'like_user', foreignKey: 'like_user_id' })
  // User.hasMany( Comment, { as:'comment_user', foreignKey: 'comment_user_id' })
  // User.hasMany( Comment, { as:'comment_parent', foreignKey: 'comment_to_user_id' })

  // Dyanmic与各表关系
  Dynamic.belongsTo( User, { as:'dynamic_user', foreignKey: 'dynamic_user_id' });
  Dynamic.hasMany( Like, { as:'dynamic_like', foreignKey: 'like_dynamic_id' });

  Dynamic.hasMany( Comment, { as:'dynamic_comment', foreignKey: 'comment_dynamic_id' });
  // Like与各表关系
  Like.belongsTo( User, { as:'like_user', foreignKey: 'like_user_id' })

  // Dynamic.hasMany( Like, { as:'dynamic_like', sourceKey: 'dynamic_module_id', foreignKey: 'module_id' })

  // Dynamic.hasMany( Comment, { as:'dynamic_comment', sourceKey: 'dynamic_module_id', foreignKey: 'module_id' })
  
  // Comment与各表关系
  Comment.belongsTo( User, { as:'comment_user', foreignKey: 'comment_user_id' })
  Comment.belongsTo( User, { as:'comment_to_user', foreignKey: 'comment_to_user_id' })
  // Comment.belongsTo( Dynamic, { as:'dynamic_comment', targetKey:'dynamic_module_id', foreignKey: 'module_id' })
  
}




module.exports = {
  User,
  Dynamic,
  Comment,
  Like,
};
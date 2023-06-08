/* 连接mysql数据库 */
const { Sequelize } = require('sequelize')
const config = require('../../config')
const sequelize = new Sequelize(
  config.mysql_setting.database,
  config.mysql_setting.user,
  config.mysql_setting.password,
  {
    host:config.mysql_setting.host,
    dialect:'mysql',
    logging: console.log,     // 是否在终端显示sql语句,默认console.log
  }
)

// 数据库连接
sequelize.authenticate().then( ()=>{ 
  console.log('\x1b[32m%s\x1b[0m','Mysql数据库已成功连接...')
}).catch( err=>{
  console.log('\x1b[33m%s\x1b[0m',`Mysql数据库发生错误:\n${err}`)
})

// 同步所有模型alter force
// config.should_mysql_association = false
// sequelize.sync({ force: true }).then(res =>{
//   console.log("-----------------------------------------所有模型已同步成功-----------------------------------------");
//   config.should_mysql_association = true
// }).catch(err => {
//   console.log(`-----------------------------------------模型同步失败-----------------------------------------:\n${err}`);
// });

module.exports = sequelize
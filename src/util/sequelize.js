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
// FgBlack = "\x1b[30m"
// FgRed = "\x1b[31m"
// FgGreen = "\x1b[32m"
// FgYellow = "\x1b[33m"
// FgBlue = "\x1b[34m"
// FgMagenta = "\x1b[35m"
// FgCyan = "\x1b[36m"
// FgWhite = "\x1b[37m"
// console.log('\x1b[36m%s\x1b[0m', '我是青色文字','颜色还原'); 
sequelize.authenticate().then( ()=>{ 
  console.log('\x1b[32m%s\x1b[0m','Mysql数据库已成功连接...')
}).catch( err =>{
  console.log('\x1b[31m%s\x1b[0m',`Mysql数据库: ${err}`)
})

// 同步所有模型alter force,
// config.should_mysql_association = true // 同步模型前需要先将config.should_mysql_association改为false后再同步,然创建表格再联系外联
// sequelize.sync({ force: true }).then(res =>{
//   console.log("-----------------------------------------所有模型已同步成功-----------------------------------------");
//   config.should_mysql_association = true
// }).catch(err => {
//   console.log(`-----------------------------------------模型同步失败-----------------------------------------:\n${err}`);
// });
 
module.exports = sequelize
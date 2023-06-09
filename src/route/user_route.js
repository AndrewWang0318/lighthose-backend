const Router = require('koa-router'); // 引入koa-router
const user = new Router({prefix:'/user'});// 路由前缀
const userController = require('../controller/user_controller');


user.post('/login',userController.login) // 登陆
user.post('/register',userController.register) // 注册
user.post('/registerByEmail',userController.registerByEmail) // 通过邮箱注册
user.post('/sendRegisterByEmailCode',userController.sendRegisterByEmailCode) // 发送邮箱注册验证码
user.post('/verifyRegisterByEmailCode',userController.verifyRegisterByEmailCode) // 验证邮箱注册验证码
user.post('/repeatVerify',userController.repeatVerify) // 验证是否重名[用户名或邮箱]

user.post('/addUserEmail',userController.addUserEmail) // 添加用户邮箱


user.post('/update',userController.update) // 修改基本信息接口
user.post('/updateUserAvatar',userController.updateAvatar) // 修改头像接口
user.post('/updateUserPassword',userController.updatePassword) // 修改密码
user.post('/updateUserEmail',userController.updateEmail) // 修改邮箱

module.exports = user
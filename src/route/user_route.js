const Router = require('koa-router'); // 引入koa-router
const user = new Router({prefix:'/user'});// 路由前缀
const userController = require('../controller/user_controller');
const emailController = require("../controller/email_controller")

user.post('/login',userController.login) // 登陆
user.post('/register',userController.register) // 注册
user.post('/updateUserInfo',userController.updateInfo) // 修改基本信息接口
user.post('/updateUserAvatar',userController.updateAvatar) // 修改头像接口
user.post('/updateUserPassword',userController.updatePassword) // 修改密码
user.post('/updateUserEmail',userController.updateEmail) // 修改邮箱

user.post('/sendEmailCode',emailController.sendEmailCode) // 发送邮箱验证码
user.post('/verifyEmailCode',emailController.verifyEmailCode) // 检查邮箱验证码


module.exports = user
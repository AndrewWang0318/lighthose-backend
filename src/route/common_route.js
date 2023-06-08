const Router = require('koa-router'); // 引入koa-router
const common = new Router({prefix:'/common'});
const commonController = require('../controller/common_controller');

common.post('/getEmailCode',commonController.getEmailCode) // 发送邮箱验证码
common.post('/checkEmailCode',commonController.checkEmailCode) // 校验邮箱验证码

module.exports = common
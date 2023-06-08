const Router = require('koa-router'); // 引入koa-router
const dynamic = new Router({prefix:'/dynamic'});
const DynamicController = require('../controller/dynamic_controller');

dynamic.post('/addDynamic',DynamicController.addDynamic) // 新增动态接口
dynamic.post('/delDynamic',DynamicController.delDynamic) // 删除动态接口
dynamic.post('/getDynamicList',DynamicController.getDynamicList) // 获取动态列表接口

module.exports = dynamic
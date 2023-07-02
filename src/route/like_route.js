const Router = require('koa-router'); // 引入koa-router
const like = new Router({prefix:'/like'});
const LikeController = require('../controller/like_controller');

like.post('/addLike',LikeController.addLike) // 新增点赞
like.post('/cancelLike',LikeController.cancelLike) // 取消点赞

module.exports = like
const Router = require('koa-router');
const router = new Router();

const common = require('./common_route')
const user = require('./user_route');
const dynamic = require('./dynamic_route')
const like = require('./like_route')
const comment = require("./comment_route")
// 调用router.routes()来组装匹配好的路由，返回一个合并好的中间件
// 调用router.allowedMethods()获得一个中间件，当发送了不符合的请求时，会返回 `405 Method Not Allowed` 或 `501 Not Implemented`
router.use(common.routes(),common.allowedMethods());
router.use(user.routes(),user.allowedMethods());
router.use(dynamic.routes(),dynamic.allowedMethods());
router.use(like.routes(),like.allowedMethods());
router.use(comment.routes(),comment.allowedMethods());


// router.redirect('/', '/mine/login');//路由重定向

module.exports = router;
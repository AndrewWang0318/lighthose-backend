const Router = require('koa-router'); // 引入koa-router
const comment = new Router({prefix:'/comment'});
const CommentController = require('../controller/comment_controller');

comment.post('/addComment',CommentController.addComment) // 新增评论


module.exports = comment
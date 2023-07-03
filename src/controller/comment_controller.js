const { createComment } = require('../service/like_service');
class CommentController{ 
   // 新增评论
  async addComment(ctx,next){
    const { dynamic_id,user_id,comment_father_id,comment_to_user_id,comment_content } = ctx.request.body;
    const comment_user_id = user_id;
    const comment_dynamic_id = dynamic_id;
    const res = await createComment( comment_user_id,comment_dynamic_id,comment_father_id,comment_to_user_id,comment_content );

    ctx.response.body = { msg:'评论成功', code:0 }
  }

}


module.exports = new CommentController()
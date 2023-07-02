const { createLike,deleteLike,retrieveLike } = require('../service/like_service');
class LikeController{ 
   // 点赞
  async addLike(ctx,next){
    const { dynamic_id,user_id } = ctx.request.body;
    const like_user_id = user_id;
    const like_dynamic_id = dynamic_id;
    const is_liked = await retrieveLike( like_dynamic_id,like_user_id );
    if(is_liked.length > 0){
      ctx.response.body = { msg:'当前已点赞', code:0 }
    }else{
      let res = await createLike( like_dynamic_id,like_user_id );
      ctx.response.body = { msg:'点赞成功', code:0 }
    }
  }
  
   // 取消赞
  async cancelLike(ctx,next){
    const { like_id,user_id } = ctx.request.body;
    const like_user_id = user_id;
    let res = await deleteLike( like_id,like_user_id );
    ctx.response.body = { msg:'取消赞成功', code:0 }
  }
}


module.exports = new LikeController()
const { createLike,deleteLike,retrieveLike } = require('../service/like_service');
class LikeController{ 
   // 点赞
  async addLike(ctx,next){
    const { like_guide_id,module_id,user_id } = ctx.request.body;
    let like_user_id = user_id;
    let res = await createLike( like_user_id,like_guide_id,module_id );
    ctx.response.body = { msg:'点赞成功', code:0 }
  }
   // 取消赞
  async delLike(ctx,next){
    const { like_id,user_id } = ctx.request.body;
    let like_user_id = user_id;
    let res = await deleteLike( like_id,like_user_id );
    ctx.response.body = { msg:'取消赞成功', code:0 }
  }
  // 查询某个模块某条内容的赞
  async queryLike(ctx,next){
    const { like_guide_id,module_id } = ctx.request.body
    let res = await retrieveLike( like_guide_id,module_id );
    ctx.response.body = { msg:'查询点赞成功', code:0 ,data:res };
  }
}


module.exports = new LikeController()
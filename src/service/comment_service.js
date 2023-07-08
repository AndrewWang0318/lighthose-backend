const { Comment } = require('../model');
const HttpException = require('../util/httpexception'); // 引入错误抛出工具
class CommentService {
  // 新增评论
  async createComment( comment_dynamic_id,comment_user_id,comment_father_id,comment_to_user_id,comment_content ){
    const data = await Comment.create({
      comment_dynamic_id,
      comment_user_id,
      comment_father_id,
      comment_to_user_id,
      comment_content
    }).catch((err)=>{
      throw new HttpException(err.errors[0].message)
    })
    return data
  }
}
module.exports = new CommentService()
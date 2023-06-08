const { writeFiles } = require('../util/filedeal');// 解析文件功能
const { createDynamic,retrieveDynamic } = require('../service/dynamic_service');
const { retrieveFromUserId } = require('../service/user_service');
const HttpException = require('../util/httpexception'); // 引入错误抛出工具
class DynamicController{
  // 新增动态
  async addDynamic(ctx,next){
    const { user_id,dynamic_text } = ctx.request.body;
    const { dynamic_media_file } = ctx.request.files; // 获取上传文件


    let dynamic_media_url = null // 所有媒体文件地址
    if(dynamic_media_file){ // 有媒体文件型
      let file_res = await writeFiles(dynamic_media_file);
      if(file_res.code !== 0) throw new HttpException(file_res.msg);
      dynamic_media_url = file_res.data.map( item => item.file_url ).join(","); // 链式调用,map循环并返回一个新数组后join转换为字符串
    }
    let res = await createDynamic(dynamic_text,dynamic_media_url,user_id);
    ctx.response.body = { code:0 , msg:'新增动态成功' };
  }
  // 删除动态[同时需要删除与动态相关的评论以及点赞]
  async delDynamic(ctx,next){ 

  }
  // 获取动态列表
  async getDynamicList(ctx,next){ 
    const { limit,page } = ctx.request.body; // 获取上传参数
    let offset = limit * (page - 1); // 跳过多少个
    let res = await retrieveDynamic( limit,offset )
    ctx.response.body = { code:0 , msg:'查询成功', data:res  }
  }
}

module.exports = new DynamicController()
/* 文件读写相关操作 */
const config = require('../../config.js'); // 引入配置文件
const $COMMON = require('./common'); // 引入公用方法
const fs = require('fs'); // 引入读写模块
const stream = require('stream'); // 引入流
module.exports =  {
  /**
   * 写入多个文件
   * @param {*files} file
   * @returns {*Promise}
   */
  async writeFiles(files){ // 写入文件[files]
    let promises = [];
    if(Object.prototype.toString.call(files) === '[object Array]'){ // 是否为数组,区分多文件上传 // 方法2：let isArr = Array.isArray(files)
      promises = files.map(file => writeSingleFile(file))
    }else{
      promises = [writeSingleFile(files)]
    }
    return Promise.all(promises).then(data => {
      let error = false;
      let data_arr = data.map(item => {
        if(item.code !== 0) error = item.msg
        return item.data
      })
      if(error){
        data_arr.forEach(item => { if(item.file_src) removeFile(item.file_src); }) // 如果上传的一个文件出现错误,则删除所有上传的文件
        return Promise.reject({code: 500,msg:error})
      }else{
        return Promise.resolve({code:0,msg:'success',data:data_arr})
      }
    })
  },
  async writeBuffer(buffer_data,file_extension){ // 写入文件[buffer]
    let file_type = $COMMON.checkFileType(file_extension); // 通过文件类型获取文件路径的子路径
    let timestamp = new Date().getTime() // 当前时间戳,用于不重复命名
    let rondom_string = $COMMON.rondomString(8) // 8位随机字符串,用于不重复命名
    let file_src = config.staticPath + `\\${file_type}` + `\\${rondom_string}_${timestamp}.${file_extension}`; // 文件本地路径
    let file_url = `${config.protocol}${config.netWorkAddress}:${config.port}` + `/${file_type}` + `/${rondom_string}_${timestamp}.${file_extension}`; // 文件线上路径
    const bufferStream = new stream.PassThrough();
    const streams = bufferStream.end(buffer_data) // 创建buffer流通道
    const writeStream = fs.createWriteStream(file_src); // 创建可写流
    streams.pipe(writeStream);// 可读流通过管道写入可写流
    // 有问题,需要解决
    return  new Promise((resolve,rejects)=>{
      writeStream.on('close', () => { // 写入成功
        resolve({ success:{ message:"写入成功",file_url,file_src }})
      })
      writeStream.on('error', (err) => { // 写入失败
        rejects({ error:'写入失败',err })
      })
    })
  }
}
/**
 * @param {*file} file 
 * @returns {*Promise}
 */
async function writeSingleFile(file){ // 写入单个文件
  const file_origin_name = file.name; // 文件原名称
  const file_origin_src = file.path; // 文件原路径
  const file_extension = file_origin_name.slice( file_origin_name.lastIndexOf(".") + 1 ).toLowerCase();// 文件后缀名[转小写]
  const file_type = $COMMON.checkFileType(file_extension); // 通过文件类型获取文件路径的子路径
  const timestamp = new Date().getTime(); // 获取时间戳,用于不重复命名
  const rondom_string = $COMMON.rondomString(8); // 8位随机字符串,用于不重复命名
  const file_src = config.staticPath + `\\${file_type}` + `\\${rondom_string}_${timestamp}.${file_extension}`; // 文件上传后的本地路径
  const file_url = `${config.protocol}${config.netWorkAddress}:${config.port}` + `/${file_type}` + `/${rondom_string}_${timestamp}.${file_extension}`; // 文件上传后的线上路径
  const readStream = fs.createReadStream(file_origin_src); // 创建可读流
  const writeStream = fs.createWriteStream(file_src); // 创建可写流
  readStream.pipe(writeStream);// 可读流通过管道写入可写流
  const filiePromise = new Promise((resolve,rejects)=>{ // 失败和成功的情况都用resolve表示,则Promise.all方法不会走reject分支
    writeStream.on('close', () => { // 写入成功
      resolve({ code: 0,  msg:'success', data:{ file_url,file_src } })
    })
    writeStream.on('error', (err) => { // 写入失败
      resolve({ code: 500,msg:err.message })
    })
  })
  return  filiePromise
}
/**
 * @param {*file_src} file 
 * @returns {*Promise}
 */
async function removeFile(file_src){ // 删除单个文件
  fs.unlink(file_src,(err) => {
    if(err){
      return { code:500, msg:err }
    }else{
      return { code:0, msg:'删除成功' }
    }
  })
}
/* 自定义复用函数 */
const config = require('../../config'); // 引入配置文件
class Common {
  rondomString(number = 6){ // 随机生成字符传
    var backArr = new Array;
    var arr = new Array;
    let val = ''
    //生成26个英语字母【大写+小写】
    for (let i = 0; i < 10; i++) {
        arr.push(i)
    }
    for(var i=0;i<26;i++){
      arr.push(String.fromCharCode(65+i))
      arr.push(String.fromCharCode(97+i))
    }
    for(var i=0;i<number;i++){
        var n = Math.floor(Math.random()*arr.length);
        backArr[i] =arr[n];
    }
    val = backArr.join("")
    return val;
  }
  base64(str,method = "encode"){ // base64加密或解码
    let back_str = ''
    if(method == 'encode'){ // 加密
      back_str = Buffer.from(str,'utf-8').toString('base64') 
    }
    if(method == 'decode'){ // 解密
      back_str = Buffer.from(str,'base64').toString('utf-8')
    }
    return back_str
  }
  checkFileType(file_extension){ // 判断文件类型
    let file_type; // 文件类型
    const img_format = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']; // 图片的格式
    const video_format = ['mp4','avi','rmvb','wmv','mpg','mpeg','swf','flv','mov']; // 图片的格式
    const audio_format = ['mp3','wma','wav','ape','flac','ogg','aac']; // 图片的格式
    const book_format = ['epub']; // 图书的格式
    if( img_format.includes( file_extension ) ){ file_type = 'image' } 
    else if(video_format.includes(file_extension)){ file_type = 'video' } 
    else if(audio_format.includes(file_extension)){ file_type = 'audio' }
    else if (book_format.includes(file_extension)){ file_type = 'book'  } 
    else { file_type = 'other' }
    return file_type
  }
  emailHtmlTemplate(rondom_code,user_nickname="" ){ // 返回email的html内容
    // err:email_register(通过邮箱注册);upd:update_password(修改密码);voel:verify_old_email(验证旧邮箱);vnel:verify_new_email(验证新邮箱);
    let email_title = `${config.app_ch_name}账号安全中心`;// 发送邮件的标题,执行的操作,返回的内容
    let email_html = `<div>
    <div>尊敬的${config.app_ch_name}用户${user_nickname}您好:</div>
      <div style="text-indent: 16px;">您正在进行确认新邮箱的操作,本次请求的邮件验证码是:
        <span style="color: blue;">${rondom_code}</span>
        (为了保证您的账号安全性,请您在30分钟内完成设置)
      </div>
    </div>
    <div>本验证码30分钟内有效,请及时输入。</div>
    <p>为了保证账号安全,请勿泄漏此验证码</p>`
    return {
      email_title,
      email_html,
    }
  }
}

module.exports = new Common()
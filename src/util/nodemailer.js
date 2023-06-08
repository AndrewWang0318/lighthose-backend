/* 发送邮件 */
const nodemailer = require('nodemailer');
const config = require('../../config') // 引入配置文件

const email_name = config.email_setting.name;
const email_user = config.email_setting.user;
const email_smtp = config.email_setting.pass;

let transporter = nodemailer.createTransport({
  service: 'qq', //类型qq邮箱
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user:email_user, // 发送方的邮箱
    pass:email_smtp, // smtp 的授权码
  }
});

class NodeMailer {
  async sendMail( email_target,subject="生态圈官方",html=""){
    // 发送的配置项
    let options = {
      from:  `"${email_name}" <${email_user}>`, // 发送方
      to: email_target, //接收者邮箱，多个邮箱用逗号间隔
      subject, // 标题
      html, //页面形式内容
      // text: '这是一封来自 Node.js 的测试邮件TEXT', // 文本形式内容
      // attachments: [{ // 发送附件
      //      filename: 'index.html', //文件名字
      //      path: './index.html' //文件路径
      //  }
      // ]
    };
    //发送函数
    let res = await transporter.sendMail(options)
    return res
  }
}

module.exports = new NodeMailer()
'use strict';
const request = require('request');
const Controller = require('egg').Controller;
const fs = require('fs');
const path= require('path')
class UploadController extends Controller {
  async index(ctx) {
    await ctx.render('upload/form/index.tpl');
  }
  async submit(ctx, next) {
    //为什么这样写不行呢
    // const stream = await ctx.getFileStream();
    // ctx.body=request.post({
    //   url:'http://127.0.0.1:7001/saveFile',
    //   formData:{
    //     FileData:stream
    // }})


    //直接转发ok
    ctx.body=ctx.req.pipe(request.post({ url: 'http://127.0.0.1:7001/saveFile' }));
  }
  async saveFile(ctx, next) {
    const stream = await ctx.getFileStream();
    const writeStream = fs.createWriteStream('app/public/images/'+stream.filename)
    stream.pipe(writeStream)
    ctx.body ='文件上传成功'
  }
}

module.exports = UploadController;







// ctx.body=await new Promise(
//   function (resolve, reject) {
//     ctx.req.pipe(request.post({ url: 'http://127.0.0.1:7001/saveFile' },(error,response,body)=>{
//       console.log('hello world')
//       resolve(body)
//     }))
//   }
// );
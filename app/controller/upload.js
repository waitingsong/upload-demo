'use strict';
const request = require('request');
const { Transform } = require('stream');
const Controller = require('egg').Controller;
const fs = require('fs');
function streamToBuffer(stream) {  
  return new Promise((resolve, reject) => {
    let buffers = [];
    stream.on('error', reject);
    stream.on('data', (data) => {
      //console.log('添加buffer')
      buffers.push(data)
    });
    stream.on('end', () => resolve(Buffer.concat(buffers)));
  });
}  
class UploadController extends Controller {
  async index(ctx) {
    await ctx.render('upload/form/index.tpl');
  }
  async submit(ctx, next) {
    //这样直接提取上传的图片流转发不行，获取stream丢失了content-length信息，form-data处理不了
    // const stream = await ctx.getFileStream();
    // ctx.body=request.post({
    //   url:'http://127.0.0.1:7001/saveFile',
    //   formData:{
    //     picData:stream
    // }})
    // console.log(ctx.req);
    // ctx.body = ctx.req.body;
    //方法一
    const stream = await ctx.getFileStream();
    const buffer= await streamToBuffer(stream);
    ctx.body= await new Promise((resolve,reject)=>{
      request.post({
        url: 'http://127.0.0.1:7002/saveFile',
        formData: {
          appKey:'追加的appKey',
          ...stream.fields,
          custom_file: {
            value: buffer,
            options: {
              filename: stream.filename,
              //contentType: 'image/jpeg'
            }
          }
        }
      },function (err, httpResponse, body) {
        resolve(body);
      })
    })
    //方法二
    // function modifyReq() {
    //   var stream = new Transform();
    //   //获取boundry
    //   var boundry = '--' + ctx.req.headers["content-type"].substring(ctx.req.headers["content-type"].indexOf('=')+1, ctx.req.headers["content-type"].length);
    //   //演示要追加的信息
    //   var data=[boundry,'Content-Disposition: form-data; name="appKey"','','追加appkey'].join('\r\n')+'\r\n';
    //   var buf = Buffer.from(data, 'utf-8');
    //   var bufLength=buf.length;
    //   //更新content-length
    //   ctx.req.headers['content-length']=ctx.req.headers['content-length']*1+bufLength;
    //   var i=0;
    //   stream._transform = function (data, encoding, done) {
    //     //console.log(data);
    //     if(i==0){
    //       this.push(buf);
    //       ++i;
    //     }
    //     this.push(data);
    //     done();
    //   };
    //   return stream;
    // }
    // ctx.body = ctx.req.pipe(modifyReq()).pipe(request.post({ 
    //   url: 'http://127.0.0.1:7001/saveFile',
    //   headers: ctx.req.headers//Transform监听只能获取流的数据，所以需要重新组装headers
    // }));
  }
  async saveFile(ctx, next) {

    const stream = await ctx.getFileStream();
    //解析流之后看看追加的信息是否成功
    console.log(stream.fields); 
    const writeStream = fs.createWriteStream('app/public/images/' + stream.filename)
    await new Promise((resolve,reject)=>{
      stream.pipe(writeStream).on('finish',function(){
        resolve()
      })
    })
    ctx.body=stream.fields;
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
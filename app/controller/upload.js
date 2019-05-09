'use strict';
const Controller = require('egg').Controller
const fs = require('fs')
const rxxfetch = require('rxxfetch')
const nodefetch = require('node-fetch')


class UploadController extends Controller {
  async index(ctx) {
    await ctx.render('upload/form/index.tpl')
  }

  async submit(ctx, next) {
    const url = 'http://127.0.0.1:7001/saveFile'
    const stream = await ctx.getFileStream()

    const headers = new nodefetch.Headers()
    if (stream.fields) {
      Object.entries(stream.fields).forEach(([key, value]) => {
        headers.set(encodeURIComponent(key), encodeURIComponent(value))
      })
    }
    const initArgs = {
      fetchModule: nodefetch,
      headersInitClass: nodefetch.Headers,
      headers,
    }
    const args = { ...initArgs, data: stream, processData: false, contentType: false }

    // ctx.body = await rxxfetch.post(url, args).toPromise()
    ctx.body = await rxxfetch.post(url, args).toPromise().then(data => {
      ctx.logger.info('res from /saveFile:', data)
      return data
    })

  }

  async saveFile(ctx) {
    try {
      const stream = ctx.req
      // 解析流之后看看追加的信息是否成功
      console.log(stream.fields);
      const name = ctx.headers.picname ? decodeURIComponent(ctx.headers.picname) : 'foo'
      const fileName = name.replace(/\//g, '_')
      const writeStream = fs.createWriteStream(`app/public/images/${fileName}.jpg`)
      await new Promise(resolve => {
        stream.pipe(writeStream).on('finish', resolve)
      })

      ctx.body = ctx.headers
    }
    catch (ex) {
      console.error(ex)
    }
  }
}

module.exports = UploadController

'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  //router.get('/', controller.home.index);
  router.get('/',controller.upload.index);
  router.post('/submit',controller.upload.submit);
  router.post('/saveFile',controller.upload.saveFile);
};

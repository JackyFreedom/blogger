var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();
var User = require('../module/User');
var Category = require('../module/Category');
var Content = require('../module/Content');
var multer = require('multer');
const  path  = require('path');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      //文件存储目录
      cb(null, path.join(__dirname, '../public/images/update/'))
      //我这里的路径是与node项目同级而不是在node项目中
      //这样写当每次更新服务器代码的时候不会导致静态资源的冲突
  },
  filename: function (req, file, cb) {
      //文件名 multer不会存储文件后缀 需自己添加
    var fileFormat = (file.originalname).split(".");
    cb(null, file.originalname )
    
      // cb(null, 'img' + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1])
  }
})
var upload = multer({
  storage: storage
})

 
router.post('/img',upload.single('file'),function (req, res, next) {
  let file = req.file;
  res.json({code:200,success:'上传成功',path:`/public/images/update/${file.filename}`})
})
module.exports = router;
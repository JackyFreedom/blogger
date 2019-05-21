var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();
var User = require('../module/User');
var Category = require('../module/Category');
var Content = require('../module/Content');

var viewPath = 'admin/'

var responseData;
router.use(function(req,res,next) {
    responseData ={
      code:0,
      message:'',
      url:'/admin'
    }
    next();
})
var responseDataSet = function (code ,message,url){
    responseData.code = code||0;
    responseData.message = message||'';
    responseData.url ='/admin'+ url|| '/admin';
}

router.get('/',{
    
})
module.exports = router;
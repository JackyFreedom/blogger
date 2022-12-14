var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var artTemplate = require('art-template');
var express_art_template = require('express-art-template');
var Cookies = require('cookies');
var  templateMethodExtends =require('./public/javascripts/templateMethodExtends.js')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var updateRouter = require('./routes/update');
var Audio = require('./module/Audio');
var aes = require('./serverCommonFn/aes');
//扩展art-template 方法
templateMethodExtends(artTemplate.defaults.imports);
 
var app = express();
 
app.use(express.json());
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//静态资源
app.use('/public',express.static(path.join(__dirname, './public')));

//指定默认的模板引擎和视图目录
app.engine('html',express_art_template);
app.set('view engine', 'html')
app.set('views',path.join(__dirname,'views'))
 
//cokies设置
app.use(function (req,res,next) {
    req.cookies = new Cookies(req,res);
    res.locals.userInfo = {};

    if(req.cookies.get('userInfo')){
        
        try{ 
            // res.locals.userInfo = JSON.parse(aes.unEncryptByAES(req.cookies.get('userInfo')));
            res.locals.userInfo = JSON.parse( req.cookies.get('userInfo') );

        }catch(e){
            console.log('设置cookie出错 ：'+e);
        }
    }
    next();
})


app.use('/', indexRouter);
app.use('/users', usersRouter); 
app.use('/update', updateRouter); 
app.use('/admin' ,adminRouter);

module.exports = app;


 

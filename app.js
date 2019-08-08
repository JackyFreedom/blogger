var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var artTemplate = require('art-template');
var express_art_template = require('express-art-template');
var Cookies = require('cookies');
var nodeHost = require('./ipConfig').nodeservers;
var  templateMethodExtends =require('./public/javascripts/templateMethodExtends.js')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var Audio = require('./module/Audio');
var aes = require('./serverCommonFn/aes');
//扩展art-template 方法
templateMethodExtends(artTemplate.defaults.imports);

 
var app = express();

//app.all('*',function(req,res,next){

 //res.header('Access-Control-Allow-Origin', '*');
  //       next();
 // })

 
app.use(express.json());
// app.use(bodyParser.raw({ type: 'audio/wav', limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//静态资源
app.use(express.static(path.join(__dirname, 'public')));
app.use('/audio',audioServer);


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
var accessLog = fs.createWriteStream('./access.log', {flags : 'a'}); 
var adminLog = fs.createWriteStream('./admin.log', {flags : 'a'}); 

//node 服务器地址
app.use(getAgmeFileList(path.join(__dirname,'/views/game')))

app.locals.nodeHost =nodeHost;
app.use('/',logger('combined', {stream : accessLog}), indexRouter);
app.use('/users', usersRouter); 
app.use('/admin',logger('combined', {stream : adminLog}),adminRouter);
app.use(resAgmeFileList(path.join(__dirname,'/views/game')))

module.exports = app;


//音频服务器
function audioServer(req,res,next){
    if(req.path.indexOf('audio')){
        var id =req.query.id;
    //   console.log('audioId',id);
      Audio.findById(id).then(function(audioOne){
          res.set('Content-Type','audio/mp3')
          res.send(audioOne.buffer)
      })
    }{
        next();
    }
   
}
//获取游戏文件列表
function getAgmeFileList(dirname){
    return function(req,res,next){
        var list = fs.readdirSync(dirname);
        // console.log('name',list);
        res.locals.gameList =list.map((item)=>{
            return item.substr(0,item.indexOf('.')) ;
        })
      
      next();
    }
}

//f返回游戏文件列表
function resAgmeFileList(dirname){
    return function(req,res,next){
        if(req.path.indexOf('/game')!==-1){
           let filename  =  req.path.substr(1);
            if(filename){
                res.render(filename)
            }else{
                throw Error('not is defined game file'+ filename);
            }
            console.log(dirname);
        }else{
            next();
        }
    }
}

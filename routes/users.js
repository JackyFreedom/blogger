var express = require('express');
var router = express.Router();
var User = require('../module/User');
/* GET users listing. */
//初始化一个管理员用户
User.findOne({userName:'admin'}).then(function(isAdmin){
  if(!isAdmin){
    var admin = new User({userName:'admin',password:'admin',isAdmin:true});
    admin.save();
  }
})


var responseData;
router.use(function(req,res,next) {
    responseData ={
      code:0,
      message:''
    }
    next();
})
router.post('/register', function(req, res, next) {
  //  console.log(req.body)
    var userName = req.body.userName;
    var password = req.body.password;
    var repetition = req.body.repetition;
    if(!userName){
       responseData.code = 1;
       responseData.message='用户名不能为空';
       res.send(responseData);
      return;
    }else if(!password){
      responseData.code = 2;
      responseData.message='密码不能为空';
      res.send(responseData);
      return;

    }else if(password!==repetition){
      responseData.code = 3;
      responseData.message='两次输入的密码不一样';
      res.send(responseData);
      return;

    }
    //查询数据库
    User.findOne({userName:userName}).then(function (userInfo) {
       if(userInfo){
         responseData.code =4;
         responseData.message= '用户已存在';
         res.send(responseData);
         return ;
       }else{
         var user = new User({
          userName:userName,
          password:password,
         }) 
          user.save().then(function(newUserInfo){
            // console.log('newUserInfo',newUserInfo)
            if(newUserInfo){
              responseData.message= '添加用户成功';
              res.send(responseData);
              return ;

            }else{
              responseData.code = 5;
              responseData.message= '添加用户失败请联系客服';
              res.send(responseData);
              return ;
            }
          });
       }
    }) 
  
});


router.post('/login', function(req, res, next) {
  // console.log('login',req.body)
  var userName = req.body.userName;
  var password = req.body.password;
  if(!userName){
     responseData.code = 1;
     responseData.message='用户名不能为空';
     res.send(responseData);
    return;
  }else if(!password){
    responseData.code = 2;
    responseData.message='密码不能为空';
    res.send(responseData);
    return;

  } 
  //查询数据库
  User.findOne({userName:userName}).then(function (userInfo) {
    // console.log('userinof-login',userInfo)
     if(!userInfo){
       responseData.code =1;
       responseData.message= '用户不存在';
       res.send(responseData);
       return ;
     } else{
      if(password !== userInfo.password){
        responseData.code =2;
        responseData.message= '密码错误';
        res.send(responseData);
        return ;
      }else{
        responseData.message= '登陆成功';
        var cookieData = JSON.stringify({userName:userInfo.userName, _id :userInfo._id,isAdmin:userInfo.isAdmin?true:false})
        req.cookies.set('userInfo',cookieData);
        // {maxAge:3000} 过期时间
        res.send(responseData);
        return ;
      }
     
     }

  }) 
});
router.get('/exitLogin',function(req,res){
   req.cookies.set('userInfo','');
   res.redirect('/')
})
module.exports = router;

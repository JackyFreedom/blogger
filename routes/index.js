var express = require('express');
var router = express.Router();
var Category = require('../module/Category');
var Content = require('../module/Content');
var Audio = require('../module/Audio');
/* GET home page. */
var responseDate
router.use(function (erq, res, next) {

  Category.find().then(function (CategoryList) {
    res.locals.nav = CategoryList;
    next()
  })
  responseDate = {
    code: 0,
    message: ''
  }
})
//首页 
router.get('/', function (req, res, next) {
  var pageIndex = req.query.pageIndex || 1;
  var pageSize = req.query.pageSize || 10;
  var categoryId = req.query.categoryId || '';
  Audio.find({},'name  _id').then(function(audioAll){
    console.log('AudioAll',audioAll)
    if(categoryId){
      // console.log('首页--categoryId',categoryId)
      Content.find({'category':categoryId},['dateTime','views','description','title','user']).populate('User').then(function (contentList) {
        var  len = contentList.length;
        var limit = pageSize;
      var skip = (pageIndex - 1) * limit;
        // console.log('首页--contentList',contentList);
        res.render('index', {
          list: contentList,
          pageIndex: pageIndex,
          categoryId:categoryId,
          audioAll:audioAll
        });
  
      })
   }else{
    Content.count().then(function (count) {
      var limit = pageSize;
      var skip = (pageIndex - 1) * limit;
      Content.find().limit(limit).skip(skip).then(function (contentList) {
        // console.log(contentList);
        res.render('index', {
          list: contentList,
          pageIndex: pageIndex,
          audioAll:audioAll
        });
  
      })
    })
  }
  })

});
//首页 -- 详情
router.get('/details', function (req, res, next) {
  var id = req.query.id || '';
  Content.findById(id).then(function (contentOne) {
    // console.log('-------',contentOne);
    if (contentOne) {
      contentOne.views =contentOne.views+1;
       contentOne.save().then(function(isSave){
         if(isSave){
          res.render('details', {
            description: contentOne.description,
            keywords: contentOne.description,
            content: contentOne.content,
            _id: contentOne._id,
            category: contentOne.category,
            title: contentOne.title,
            comments:contentOne.comments
          });
         }
       })
     
    } else {
      responseDate.code = 1;
      responseDate.message = '查不到此条数据'
      res.render('message', responseDate)
    }
  })
});


//个人信息
router.get('/personal',function(req,res){
  res.render('personal')
})
module.exports = router;
var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var router = express.Router();
var User = require('../module/User');
var Category = require('../module/Category');
var Content = require('../module/Content');
var Audio = require('../module/Audio');
var fs = require('fs');
var path = require('path');
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
router.use(function (req,res,next) {
    // console.log('req.cloals.userInfo',res.locals)
     if(res.locals.userInfo.isAdmin){
         next();
     }else{
         res.send('你是不管理员 无权限进入')
     }
})
//首页
router.get('/',function(req,res){
   res.render(viewPath+'index')
})
//用户
router.get('/user',function(req,res){
    //设置分页 
    var pageIndex = Math.max(req.query.pageIndex||1,1) ;
    var pageSize = req.query.pageSize || 10;

   
    //读取所有的用户展示出来
    User.find().then(function(count){
          //获取总页数
          var countLen = count.length;
          var pageCount=  Math.ceil(countLen/pageSize);  
              pageIndex = Math.min(pageIndex,pageCount);
          var limit = pageSize;
          var skip = (pageIndex-1) *pageSize;
        User.find().limit(limit).skip(skip).then(function (allUserInfo) {
            var allUserInfo = allUserInfo || [];
                res.render(viewPath+'user',{list:allUserInfo,
                    pageIndex:pageIndex,
                    pageSize:pageSize,
                    pageCount:pageCount,
                })
            })
        
    })
  
})
//分類首页
router.get('/categories',function(req,res){
    //设置分页 
    var pageIndex = Math.max(req.query.pageIndex||1,1) ;
    var pageSize = req.query.pageSize || 10;

   
    //读取所有的用户展示出来
    Category.countDocuments().then(function(countLen){
        console.log('分类----',countLen)
          //获取总页数
          var pageCount=  Math.ceil(countLen/pageSize);  
              pageIndex = Math.min(pageIndex,pageCount);
          var limit = pageSize;
          var skip = (pageIndex-1) *pageSize;
          Category.find().limit(limit).skip(skip).then(function (allUserInfo) {
            var allUserInfo = allUserInfo || [];
                res.render(viewPath+'categories',{list:allUserInfo,
                    pageIndex:pageIndex,
                    pageSize:pageSize,
                    pageCount:pageCount,
                })
            })
        
    })
})
//分類添加
router.get('/categories/edit',function(req,res){
    
    res.render(viewPath+'/categories_edit')
})

//分类保存
router.post('/categories/edit',function(req,res){
    console.log('body',req.body)
    var name = req.body.name;
    if(!name){
        responseDataSet(1,'分类名称不能为空','/categories/edit')
        res.render(viewPath+'/message',responseData)
         return ;
      }
    //数据库中查询是否有存在的
    Category.findOne({name:name}).then(function(isName){
        if(isName){
          responseDataSet(2,'已存在该分类','/categories/edit')
          res.render(viewPath+'/message',responseData)
             return ;
        }else{
          new Category({name:name}).save().then(function(isAave){
                if(isAave){
                    responseDataSet(0,'分类保存成功','/categories/edit')
                    res.render(viewPath+'/message',responseData)
                    return ;
                }else{
                    responseDataSet(3,'分类保存失败','/categories/edit')
                    res.render(viewPath+'/message',responseData)
                    return ;
                }
            })
           

        }
    })
   
})

//分類编辑
router.get('/categories/alter',function(req,res){
    var id = req.query.id ;
    Category.findById(id).then(function(CategoryOne){
        if(CategoryOne){
            res.render(viewPath+'/categories_edit',{name:CategoryOne.name,_id:CategoryOne._id})
            return;
        }else{
            responseDataSet(1,'找不到此条分类','/categories/')
            res.render(viewPath+'/message',responseData)
           return;
        }
    })

})

//分類编辑提交
router.post('/categories/alter',function(req,res){
    var id = req.body.id||'';
    var name = req.body.name||'';
    console.log('upata=------====',id,name)
    
    Category.find({name:name}).then(function(isName){
        if(isName){
            responseDataSet(1,'修改失败已存在相同的类型','/categories/alter?id='+id)
            res.render(viewPath+'/message',responseData)
            return;
        }else{
            Category.updateOne({_id:id}, {name:name}).then(CategoryOne=>{
                if(CategoryOne){
                    console.log('updateOne',CategoryOne)
                    responseDataSet(0,'修改成功','/categories')
                     res.render(viewPath+'/message',responseData)
                     return;
                 }else{
                     responseDataSet(1,'找不到此条分类','/categories')
                     res.render(viewPath+'/message',responseData)
                    return;
                 }
            })
        }
    })
   

})
router.get('/categories/remove',function(req,res){
    var id = req.query.id;
    Category.findByIdAndRemove(id).then(function(isRemove){
        console.log(isRemove)
        if(isRemove){
            responseDataSet(0,'删除成功','/categories')
            res.render(viewPath+'/message',responseData)
            return;
        }else{
             responseDataSet(1,'删除失败','/categories')
            res.render(viewPath+'/message',responseData)
            return;
        }
    })
})
router.get('/users/remove',function(req,res){
    var id = req.query.id;
    User.findByIdAndRemove(id).then(function(isRemove){
        console.log(isRemove)
        if(isRemove){
            responseDataSet(0,'删除成功','/user')
            res.render(viewPath+'/message',responseData)
            return;
        }else{
             responseDataSet(1,'删除失败','/user')
            res.render(viewPath+'/message',responseData)
            return;
        }
    })
    
    
})

//内容列表
router.get('/content',function(req,res){
    var pageIndex = req.query.pageIndex || 1;
    var pageSize = req.query.pageSize || 10;

    Content.countDocuments().then(function(count){
    var limit = pageSize;
    var skip = limit*(pageIndex-1);          
      Content.find({} ).limit(limit).skip(skip).populate('category').then(function(list){
          console.log(list)
         if(list){
             res.render(viewPath+'/content',{list:list, pageIndex:pageIndex,})
         }
      })   
 })
}) 
//内容列表 -- 删除
router.get('/content/remove',function(req,res){
    var id = req.query.id || '';
    console.log('idddd',id)
    Content.findByIdAndRemove(id).then(function(isRemove){
        if(isRemove){
            responseDataSet(0,'删除成功','/content');
            res.render(viewPath+'/message',responseData);
        }else{
            responseDataSet(1,'删除失败','/content');
            res.render(viewPath+'/message',responseData);
        }
    })
})
//内容添加 
router.get('/content/edit',function(req,res){
    Category.find().then(function(list){
        console.log(list)
        if(list){
            res.render(viewPath+'/content_edit',{categoriesList:list,  })
        } 
    })
})
//内容内容  -- 保存
router.post('/content/edit',function(req,res){
    var category = req.body.category;
    var title = req.body.title;
    var description = req.body.description;
    var category = req.body.category;

    //用户
    req.body.user = res.locals.userInfo._id;
    
    console.log('body',req.body);
    if(category&&title&&description&&category){
         var content = new Content(req.body);
         content.save().then(function(contentSave){
             if(contentSave){
                 responseDataSet(0,'保存成功','/content/edit');
                 res.render('admin/message',responseData);
             }
         })
    }else{
        responseDataSet(1,'所有输入不能为空','/content/add');
        res.render('admin/message',responseData);
    }
})

//内容修改
router.get('/content/alter',function(req,res){
    var id = req.query.id || '';
    console.log('body',req.query.id);
    Content.findById(id).then(function(contentOne){
        console.log('content',contentOne)
        if(contentOne){
                Category.find().then(function(categoryList){
                res.render(viewPath+'/content_edit',{
                    category:contentOne.category, 
                    title:contentOne.title,  
                    description:contentOne.description, 
                    content:contentOne.content, 
                    categoriesList:categoryList,
                    id:contentOne._id
                })
            })
        }else{
            responseDataSet(1,'content','查无此单');
            res.render(viewPath+'/message',responseData);
        }
    })
})

//内容修改 -- 保存
router.post('/content/alter',function(req,res){
    var id = req.body.id || '';
    console.log('body',req.body);
    Content.findByIdAndUpdate(id,{
        category:req.body.category,
        title:req.body.title,
        description:req.body.description,
        content:req.body.content,
                                                          
         }).then(function(isUpdate){
        console.log('isUpdate',isUpdate)
        if(isUpdate){
            responseDataSet(0,'修改成','/content');
            res.render(viewPath+'/message',responseData);
        }else{
            responseDataSet(1,'查无此单','/content');
            res.render(viewPath+'/message',responseData);
        }
    })
})
//内容评论 -- 信息提交
router.post('/content/comment',function(req,res){
    var id = req.body.id || '';
    var content = req.body.content || '';
    var userName = res.locals.userInfo.userName || '';
    var time =  new Date();
    var postData = {
        userName:userName || '',
        time:time,
        content:content,
    };
    console.log('body',req.body);
    Content.findById(id).then(function(contentOne){
        if(contentOne){
            contentOne.comments.push(postData);
            console.log('contentOne',contentOne)
            contentOne.save().then(function(isAave){
                if(isAave){
                    console.log('isAave',isAave)
                   responseDataSet(0,'发布成功');
                   responseData.comments = isAave.comments;
                   responseData.comments =  responseData.comments.reverse();
                  res.json(responseData)
                }else{
                    responseDataSet(1,'发布失败');
                    res.json(responseData);
                }
            })
        }else{
            responseDataSet(2,'找不到此篇文章');
            res.send(responseData);
        }
    })
    
})
//音频上传
router.get('/audioAdd',function(req,res){
    res.render(viewPath+'audioAdd');
})
router.post('/audioAdd',multer({dest:'../public/audios/'}).single('fileValue'),function(req,res){
    //  console.log('file',req.file)
     var aupath = '../public/audios/';
    if(req.file){
        var jonspath = path.join(__dirname,aupath)
        // console.log('jonspath',jonspath)  jonspath+req.file.originalname
       fs.writeFile(jonspath+req.file.originalname,req.file.buffer,function(err){
           console.log(jonspath+req.file.originalname,'errr------',err)
       })
      var audio =new Audio({
          name:req.file.originalname,
          buffer:req.file.buffer
      });
      audio.save().then(function(isSave){
        //   console.log('is',isSave)  
        if(isSave){
            responseDataSet(0,'上传成功','/audioAdd') ; 
            res.render(viewPath+'message',responseData);
          }else{
            responseDataSet(1,'上传失败','/audioAdd') ; 
            res.render(viewPath+'message',responseData);
          }
      })
    }        
})

//音频列表
router.get('/audioList',function(req,res){
    Audio.find({},'name _id').then(function(audioAll){
        console.log(audioAll);
        res.render(viewPath+'audioList',{list:audioAll});
    })
})
router.get('/audioList/remove',function(req,res){
    var id = req.query.id;
    Audio.findByIdAndRemove(id).then(function(remove){
        console.log(remove);
       if(remove){
         responseDataSet(0,'删除成功','/audioList');
         res.render(viewPath+'message',responseData);
       }else{
        responseDataSet(1,'删除失败','/audioList');
        res.render(viewPath+'message',responseData);
       }
    })
})
module.exports = router;

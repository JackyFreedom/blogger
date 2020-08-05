var mongoose = require('mongoose');

//内容表结构
module.exports = new mongoose.Schema({

    //关联字段
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'Category'
    },
    //内容标题
    title:String,
    dateTime:{
        type:Date,
        default:new Date()
    },
    //点击量
    views:{
      type:Number,
      default:0
    },
     //图片路径
     imgPath:{
        type:String,
        default:''
      },
    //简介
    description:{
        type:String,
        default:'',
    },
    //内容
    content:{
        type:String,
        default:''
    },
    //用户
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    //评论
    comments:{
        type:Array,
        default:[]
    }
})
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
      //音频
      buffer:{
          type:Buffer,
          default:''
      },
      name:{
          type:String,
          default:''
      }
})
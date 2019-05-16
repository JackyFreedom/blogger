var mongoose = require('mongoose');
var categoriesSchemas =require('../schemas/categories');

module.exports = new mongoose.model('Category',categoriesSchemas) ;
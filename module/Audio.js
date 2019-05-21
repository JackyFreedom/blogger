var mongoose = require('mongoose');
var audios = require('../schemas/audios');

module.exports = new mongoose.model('Audio',audios)
var mongoose = require('mongoose');
var config   = require('../config');
var User = require('../model').User;
var Log  = require('../model').Log;
// Connect mongodb
mongoose.connect('mongodb://localhost:27017/' + config.dbname);
// Clean all collections
[User, Log].forEach(function(m) { m.remove({}, function() {}); })
// Set seeds values
new User({ 'name': '後藤 歩',  'image_file_name': 'goto.jpg' }).save();
new User({ 'name': '前本 知志', 'image_file_name': 'maemoto.jpg' }).save();
new User({ 'name': '石田 陽太', 'image_file_name': 'ishida.jpg' }).save();
console.log('Finished.');
mongoose.disconnect();
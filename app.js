// Import
var sys        = require('sys');
var express    = require('express');
var mongodb    = require('mongodb');
var mongoose   = require('mongoose');
var moment     = require('moment');
var request    = require('request');
var fs         = require('fs');
var path       = require('path');
var uuid       = require('node-uuid');
var config     = require('./config');
var model      = require('./model');
var multiparty = require('multiparty');
var GIFEncoder = require('gifencoder');
var Canvas     = require('canvas');

/////////////////////////
// Parameters
/////////////////////////

var port = 3000;

/////////////////////////
// Database
/////////////////////////

// Connect mongodb
mongoose.connect('mongodb://localhost:27017/' + config.dbname);

var User = model.User
var Log  = model.Log

/////////////////////////
// Web server
/////////////////////////
var app = express();
app.use('/upload', express.static('upload'));

// Generate `now` formated datetime string
function getNow() {
  return moment().format('YYYY/MM/DD HH:mm:ss');
}

// Get user
function getUserById(id, callback) {
  users.findOne({ _id: id }, function(err, item) {
    console.log(arguments);
    if (callback) callback(item);
  });
}

/////////////////////////
// Web server: APIs
/////////////////////////

/**
 * Get user's list
 * @return
 * [
 *   { 
 *     '_id': Object Id, 
 *     'name': User's name
 *   }
 * ]
 */
app.get('/api/v1/users', function(req, res) {
  User.find(function(err, users) {
    res.send(users);
  });
});

/**
 * Get user
 * @return
 * { 
 *   '_id': Object Id, 
 *   'name': User's name
 * }
 */
app.get('/api/v1/users/:id', function(req, res) {
  var id = req.params.id;
  User.findOne({ '_id': id }, function(err, user) {
    res.send(user);
  });
});

/**
 * Get log items as sorted newer
 * @return
 * [
 *   { 
 *     '_id': Object Id, 
 *     'user_id': User's Object Id,
 *     'type': Log type ("go"|"home")
 *     'timestamp': Posted date
 *   }
 * ]
 */
app.get('/api/v1/timeline', function(req, res) {
  console.log("timeline" + getNow());
  Log
    .find()
    .sort({ 'created_at': -1 })
    .populate('created_by')
    .exec(function(err, logs) {
      if(err) throw new Error(err);
      res.send(logs);
    });
});

/**
 * 「いってきます！」
 * @params
 *   user_id: Users unique id
 *   type: 'go', 'home'
 *   file_path: File image's local path
 * @return
 * {
 *   'result': true|false
 * }
 */
app.post('/api/v1/add_log', function(req, res) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    var user_id = fields.user_id[0];
    var type = fields.type[0];
    var file_path = files.image_file[0].path;
    var ext = path.extname(file_path);
    var file_name = uuid.v4() + ext;
    var r = fs.createReadStream(file_path);
    var w = fs.createWriteStream('./upload/' + file_name);
    r.pipe(w);
    var log = new Log({
      type: type,
      image_file_name: file_name,
      created_by: user_id,
      created_at: getNow()
    });
    log.save();
    res.send({ 'result': true });
  });
});

/**
 * 「今日の天気は？」
 */
app.get('/api/v1/weather', function(req, res) {
  res.send("{ 'status': 'great' }");
});

/**
 * 指定ユーザーのアニメーションGifを生成する
 */
app.get('/api/v1/generate_user_history/:id', function(req, res) {
  var id = req.params.id;
  logs = Log
    .find({ 'created_by': id})
    .sort({ 'created_at': -1 })
    .exec(function(err, logs) {
      if(err) throw new Error(err);
      var encoder = new GIFEncoder(320, 320);
      var file_name = uuid.v4();
      encoder.createReadStream().pipe(fs.createWriteStream('./upload/' + file_name));
      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(500);
      encoder.setQuality(10);
      logs.forEach(function(log) {
        fs.readFile('./upload/' + log.image_file_name, function(err, image_file){
          if (err) throw err;
          var canvas = new Canvas(320, 320);
          var ctx = canvas.getContext('2d');
          img = new Canvas.Image;
          img.src = image_file;
          ctx.drawImage(img, 0, 0, img.width, img.height);
          encoder.addFrame(ctx);
        });
      });
      setTimeout(function() {
        encoder.finish();
        res.send({ file_name: file_name });
      }, 1000);
      
    });
});

// Launch Web Server
var webServer = app.listen(port, function () {
  console.log('\033[96m Web server running\033[39m');
  var host = webServer.address().address;
  var port = webServer.address().port;
});


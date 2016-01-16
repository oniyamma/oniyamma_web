// Import
var sys        = require('sys');
var express    = require('express');
var mongodb    = require('mongodb');
var moment     = require('moment');
var request    = require('request');

/////////////////////////
// Parameters
/////////////////////////

var dbname = 'oniyamma';
var port = 3000;

/////////////////////////
// Database
/////////////////////////

var users; 
var logs;

// Connect to mongodb
mongodb.MongoClient.connect("mongodb://localhost:27017/" + dbname, function(err, database) {
  users = database.collection("users");
  logs  = database.collection("logs");
});

/////////////////////////
// Web server
/////////////////////////
var app = express();
app.use(express.static('public'));

// Generate `now` formated datetime string
function getNow() {
  return moment().format('YYYY/MM/DD HH:mm:ss');
}

// Save log method
function saveLog(log, callback) {
  log.timestamp = getNow();
  logs.save(log);
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
  users.find().toArray(function(err, items) {
    res.send(items);
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
  logs.find().sort({ 'timestamp': -1 }).toArray(function(err, items) {
    res.send(items);
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
app.get('/api/v1/add_log', function(req, res) {
  var user_id = req.query.user_id
  saveLog({ user_id: user_id, type: "go"});
  res.send({
    'result': true
  });
});

/**
 * 「今日の天気は？」
 */
app.get('/api/v1/weather', function(req, res){
  res.send("{ 'status': 'great' }");
});

// Launch Web Server
var webServer = app.listen(port, function () {
  console.log('\033[96m Web server running\033[39m');
  var host = webServer.address().address;
  var port = webServer.address().port;
});


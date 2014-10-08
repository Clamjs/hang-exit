var HangExit = require('../');
var Onion = require('tiny-onion');
var util = require('mace');
var http = require('http');
var server = http.createServer(function (req, res) {
  res.end('this is a test server forget this !');
}).listen(123456, function () {
  util.done("%s 已启动，端口:%d \n", "Clamjs", 123456, 1); 
});

new Onion().use(function (next) {
  HangExit.hangup();
  next();
}).use(function (next) {
  util.error('server runing');
  setTimeout(function () {
    // level => 1*4
    util.log('now resolve this', 1);
    next();
  }, 1000);  
}).use(function (next) {
  util.log(' this is other task');
  setTimeout(function () {
    util.log('now resolve this', 1);
    next();
  }, 1000);
}).use(function () {
  HangExit.exit();
}).handle()();

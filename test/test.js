var HangExit = require('../');
var util = require('tiny-onion').Util;
var http = require('http');
var server = http.createServer(function (req, res) {
  res.end('this is a test server forget this !');
}).listen(123456, function () {
  util.success("%s 已启动，端口:%d\n", "Clamjs", 123456, 1); 
});


util.log(HangExit);

new HangExit().use(function (next) {
  util.error('server runing');
  setTimeout(function () {
    util.log('now resolve this', 1);
    next();
  }, 1000);  
}).use(function (next) {
  util.log(' this is other task');
  setTimeout(function () {
    util.log('now resolve this', 1);
    next();
  }, 1000);
}).handle()();
process.emit("SIGINT");

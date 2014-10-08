var util = require('mace');
var debug = util.debug('hang-exit');
var _exiting = true;
var exit;
exports = module.exports = function intercept() {
  exports.exit = exit = (function (exit) {
    return function (code) {
      _exiting = false;
      exit.call(process, code);
    };
  })(process.exit);
  process.exit = util.noop;
  var readLine = require("readline");
  var rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on('SIGINT', function () {
    process.emit('SIGINT');
  });
  process._exiting = _exiting;
  process.on('SIGINT', function (e) {
    if (!_exiting) {
      process._exiting = false;
      return exit(0);
    }
    util.warn('Please wait the task list finished!');
    process.emit('before:exit', 0);
  });
};
exports.hangup = exports;

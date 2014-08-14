var readLine = require("readline");
var debug = require('debug')('HangExit');
var Onion = require('tiny-onion').Onion;
var util = require('tiny-onion').Util;

exports = module.exports = Onion.extend({
  name: "Hang-exit",
  handle: function () {
    // 前置hangup handle
    this.stack_.unshift(exports.hang);
    this.stack_.push(exports.exit);
    return this.super_.handle.call(this);
  }
}, {
  hang: function (next) {
    debug('handle the exit now');
    if (process.platform === "win32") {
      var rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.once("SIGINT", function() {
        process.emit("SIGINT");
      });
    }
    process.on('SIGINT', (function (exiting) {
      return function (e) {
        if (exiting) {
          util.warn('Please wait the task list finished!');
          return false;
        }
        debug('Start task list queen');
        next();
        exiting = true;
      }
    })(false));
  },
  exit: function () {
    debug('Process exit success~');
    process.exit(0); 
  }
});
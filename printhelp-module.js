var clc = require('cli-color');
var charm = require('charm')();

var methods = {};

methods.update_start_inspect = function (start_inspect) {
  return start_inspect + 8;
};

methods.update_start_solve = function (start_solve) {
  return start_solve + 8;
};

methods.print_help  = function (start_inspect) {
  console.log("Keyboard shortcuts:");
  console.log(clc.green('Press E to exit.'));
  console.log(clc.red('Press SPACE to initiate a solve.'));
  console.log(clc.blue('Press S to see your session statistics.'));
  console.log(clc.blue('Press T to trash a solve while the solve timer is running'));
  console.log(clc.blue('Press D after a solve to change it to a DNF'));
  console.log(clc.blue('Press P after a solve to add a penalty of 2 seconds'));
  charm.position(0, start_inspect);
  return;
}

exports.data = methods;

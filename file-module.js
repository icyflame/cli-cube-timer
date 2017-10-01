exports.writeLocal = function (solvetime, scramble) {
  var solvestring = solvetime + ', ' + scramble + '\n';

  var fs = require('fs');

  var filepath = require('./file-module.js').checkLocalFile();

  fs.appendFileSync(filepath, solvestring);
};

exports.checkLocalFile = function () {
  var fileExists = require('file-exists');
  var touch = require('touch');
  var filepath = require('./constants').LOCAL_FILE_PATH;

  if(!fileExists.sync(filepath)) {
    var mkdirp = require('mkdirp');
    var localSaveDir = require('./constants').LOCAL_SAVE_DIR;
    mkdirp.sync(localSaveDir);
    touch(filepath);
  }

  return filepath;
};


exports.localFileExists = function () {
  var fileExists = require('file-exists');

  return fileExists(require('./constants').LOCAL_FILE_PATH);
};

exports.pushedFileExists = function () {
  var fileExists = require('file-exists');

  return fileExists(require('./constants').PUSHED_FILE_PATH);
};

exports.deleteLocalFile = function () {
  // empty the file times.csv
  // (Rename and put it inside the same directory with another extension)
  var filepath = require('./file-module.js').checkLocalFile();
  require('fs').renameSync(filepath, filepath + '.' + Date.now());
};

exports.writeToPushed = function (glob) {
  var fileExists = require('file-exists');
  var touch = require('touch');
  var xdg = require('xdg-basedir');
  var filepath = require('./constants').PUSHED_FILE_PATH;

  if(!fileExists(filepath)) {
    var mkdirp = require('mkdirp');
    mkdirp(xdg.data + '/cube');
    touch(filepath);
  }

  var fs = require('fs');

  fs.writeFileSync(filepath, glob);

  return filepath;
};

exports.print_paths = function () {
  var clc = require('cli-color');

  var paths_str = [
    '',
    '  Local file path:',
    '    ' + require('./constants').LOCAL_FILE_PATH,
    '',
    '  Pushed file path:',
    '    ' + require('./constants').PUSHED_FILE_PATH,
    ''
  ].join('\n');

  console.log(paths_str);
  return;
}

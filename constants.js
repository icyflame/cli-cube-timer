var xdg = require('xdg-basedir');
var path = require('path');

var localSaveDir = path.join(xdg.data, '/cube');
var localFilePath = path.join(localSaveDir, 'times.csv');
var pushedFilePath = path.join(localSaveDir, 'pushed.csv');

exports.LOCAL_SAVE_DIR = localSaveDir;
exports.LOCAL_FILE_PATH = localFilePath;
exports.PUSHED_FILE_PATH = pushedFilePath;

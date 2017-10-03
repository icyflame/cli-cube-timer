var xdg = require('xdg-basedir');

var localSaveDir = xdg.data + '/cube';
var localFilePath = localSaveDir + '/' + 'times.csv';
var pushedFilePath = localSaveDir + '/' + 'pushed.csv';

exports.LOCAL_SAVE_DIR = localSaveDir;
exports.LOCAL_FILE_PATH = localFilePath;
exports.PUSHED_FILE_PATH = pushedFilePath;

var xdg = require('xdg-basedir');

var localSaveDir = exports.LOCAL_SAVE_DIR = xdg.data + '/cube';
exports.LOCAL_FILE_PATH = localSaveDir + '/times.csv';
exports.PUSHED_FILE_PATH = localSaveDir + '/pushed.csv';

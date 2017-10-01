var assert = require('assert');
var fs = require('fs');
var constants = require('../constants');
var fileModule = require('../file-module');

it('creates LOCAL_SAVE_DIR', function () {
    fileModule.checkLocalFile();

    var expected = true;
    var actual = fs.existsSync(constants.LOCAL_FILE_PATH);

    assert.equal(actual, expected);
});
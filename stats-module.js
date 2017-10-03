module.exports = function (bucket_size) {
  bucket_size = bucket_size || 10;

  var fileModule = require('./file-module.js');
  var file_name = require('./constants.js').PUSHED_FILE_PATH;

  if (!fileModule.pushedFileExists()) {
    file_name = fileModule.checkLocalFile();
  }

  var fs = require('fs');
  var csv = require('fast-csv');
  var Stats = require('fast-stats').Stats;
  var clc = require('cli-color');
  var barHorizontal = require('bar-horizontal');

  var prettyMs = require('pretty-ms');

  function prettifyVerbose (ms) {
    return prettyMs(ms, {verbose: true, secDecimalDigits: 2});
  }

  var stream = fs.createReadStream(file_name);
  var all_times = new Stats({bucket_precision: bucket_size});

  var csvStream = csv()
    .on('data', function (data) {
      if (data[0] !== 'DNF') {
        // isolate the time
        all_times.push(parseFloat(data[0]));
      }
    }).on('end', function () {
    if (all_times.length <= 0) {
      console.log(clc.red("No solves yet!"));
      return;
    }
    console.log('\n');
    console.log('Number of stored solves: ' + clc.green(all_times.length));
    console.log('Mean of all solves: ' + clc.green(prettifyVerbose(all_times.amean() * 1000)));
    console.log('Standard Deviation: ' + clc.green(prettifyVerbose(all_times.stddev() * 1000)));

    var range = all_times.range();
    console.log('Best Solve: ' + clc.green(prettifyVerbose(range[0] * 1000)));
    console.log('Worst Solve: ' + clc.green(prettifyVerbose(range[1] * 1000)));
    // console.log(all_times.distribution())

    var distribution = all_times.distribution();

    var input_obj = {};

    distribution.forEach(function (e) {
      input_obj[clc.blue(e.count + ' (' + e.range[0] + '+)')] = e.count;
    });

    barHorizontal(input_obj, { labels: true });

  });

  stream.pipe(csvStream);
};

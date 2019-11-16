module.exports = function ({ bucket, min, max }) {
  var bucket_size = typeof bucket === 'number' ? bucket : 10;
  var min_solve = typeof min === 'number' ? min : 0;
  var max_solve = typeof max === 'number' ? max : Number.MAX_SAFE_INTEGER;

  var async = require('async');
  var fileModule = require('./file-module.js');
  var pushed_file_name = require('./constants.js').PUSHED_FILE_PATH;
  var local_file_name = require('./constants.js').LOCAL_FILE_PATH;

  var fs = require('fs');
  var csv = require('fast-csv');
  var Stats = require('fast-stats').Stats;
  var clc = require('cli-color');
  var barHorizontal = require('bar-horizontal');

  var prettyMs = require('pretty-ms');

  function prettifyVerbose (ms) {
    return prettyMs(ms, {verbose: true, secDecimalDigits: 2});
  }

  var all_times = new Stats({bucket_precision: bucket_size});

  var avail_files = [ ];

  if (fileModule.pushedFileExists()) {
    avail_files.push(pushed_file_name);
  }

  if (fileModule.localFileExists()) {
    avail_files.push(local_file_name);
  }

  async.eachSeries(avail_files,
    function (file_name, callback) {
      var csvStream = csv()
      .on('data', function (data) {
        var solve_time = parseFloat(data[0]);
        if (!isNaN(solve_time) && solve_time >= min_solve && solve_time <= max_solve) {
          all_times.push(solve_time);
        }
      })
      .on('end', function () {
        return callback();
      });
      var stream = fs.createReadStream(file_name);
      stream.pipe(csvStream);
    }, function (err) {
    if (err) {
      console.log("OOPS! There was an error reading the files");
      console.error(err);
    } else {
      if (all_times.length <= 0) {
        console.log(clc.red("No solves yet!"));
        return;
      }
      console.log('Number of solves: ' + clc.green(all_times.length));
      console.log('Mean: ' + clc.green(prettifyVerbose(all_times.amean() * 1000)));
      console.log('Median: ' + clc.green(prettifyVerbose(all_times.median() * 1000)));
      console.log('Standard deviation: ' + clc.green(prettifyVerbose(all_times.stddev() * 1000)));

      var range = all_times.range();
      console.log('Best solve: ' + clc.green(prettifyVerbose(range[0] * 1000)));
      console.log('Worst solve: ' + clc.green(prettifyVerbose(range[1] * 1000)));

      var distribution = all_times.distribution();
      var input_obj = {};
      distribution.forEach(function (e) {
        input_obj[clc.blue(e.count + ' (' + e.range[0] + '+)')] = e.count;
      });

      barHorizontal(input_obj, { labels: true });
    }
  });
};

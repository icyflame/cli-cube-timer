module.exports = function ({ bucket, min, max, before, after }) {
  var async = require('async');
  var fs = require('fs');
  var csv = require('fast-csv');
  var Stats = require('fast-stats').Stats;
  var clc = require('cli-color');
  var barHorizontal = require('bar-horizontal');
  // Local modules
  var fileModule = require('./file-module.js');
  // Constants
  var pushed_file_name = require('./constants.js').PUSHED_FILE_PATH;
  var local_file_name = require('./constants.js').LOCAL_FILE_PATH;
  // Helper functions
  var parseStrToMomentOrUndefined = require('./utils.js').parseStrToMomentOrUndefined;
  var solveValidator = require('./utils.js').solveValidator;
  var prettifyVerbose = require('./utils.js').prettifyVerbose;

  var bucket_size = typeof bucket === 'number' ? bucket : 10;
  var min_solve = typeof min === 'number' ? min : 0;
  var max_solve = typeof max === 'number' ? max : Number.MAX_SAFE_INTEGER;
  var before_timestamp = parseStrToMomentOrUndefined(before);
  var after_timestamp = parseStrToMomentOrUndefined(after);
  var validatorFunc = solveValidator(min_solve, max_solve, before_timestamp, after_timestamp);

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
        // Step 1: Get the solve time, this should always be present
        var solve_time = parseFloat(data[0]);

        // Step 2: Try to parse solve timestamp
        // This was introduced in v1.2.0. Files written by versions of cli-cube-timer before v1.2.0
        // will not have this column.
        var solve_timestamp = data.length >= 3 ? data[2] : undefined;
        var solve_unix_ts = parseFloat(solve_timestamp, 10) / 1000;

        if (validatorFunc(solve_time, solve_unix_ts)) {
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

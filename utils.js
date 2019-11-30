var prettyMs = require('pretty-ms');
var moment = require('moment');

exports.parseStrToMomentOrUndefined = function (input) {
  return input !== undefined && moment(input).isValid() ? moment(input) : undefined;
}

exports.solveValidator = function (min_solve, max_solve, before_timestamp, after_timestamp) {
  return function (solve_time, solve_unix_ts) {
    var solveTimeValid = (!isNaN(solve_time) && solve_time >= min_solve && solve_time <= max_solve);

    var solveTsExists = !isNaN(solve_unix_ts) && typeof solve_unix_ts === 'number' && solve_unix_ts > 0;
    var inputOptionsValid = before_timestamp !== undefined || after_timestamp !== undefined;

    // Solve time itself is invalid
    if (!solveTimeValid) {
      return solveTimeValid;
    }

    // --after or --before not provided, so timestamp validity needn't be checked
    if (!inputOptionsValid) {
      return solveTimeValid;
    }

    // User has provided --after or --before, solves without timestamps will not be included in
    // the statistics
    if (inputOptionsValid && !solveTsExists) {
      return false;
    }

    var solve_moment = moment.unix(solve_unix_ts);
    if (before_timestamp === undefined) {
      return solve_moment.isAfter(after_timestamp);
    }
    if (after_timestamp === undefined) {
      return solve_moment.isBefore(before_timestamp);
    }
    return solve_moment.isBetween(after_timestamp, before_timestamp);
  };
}

exports.prettifyVerbose = function (ms) {
  return prettyMs(ms, {verbose: true, secDecimalDigits: 2});
}

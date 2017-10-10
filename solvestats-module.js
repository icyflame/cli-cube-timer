exports.calcStats = function (solves_today) {

  var assert = require('assert');
  var removeMinMax = require('remove-min-max');
  var mathAvg = require('math-avg');
  var min = require('lodash.min');
  var max = require('lodash.max');

  var ao_session = -1, ao5 = -1, ao12 = -1, sum = 0.0, total_solves = solves_today.length;

  var best_time = parseFloat(min(solves_today)) * 1000;
  var worst_time = parseFloat(max(solves_today)) * 1000;

  if(Array.isArray(solves_today)) {
    // it is assumed that solves_today is chronologically ordered, beginning with the oldest
    var descendingTotalSolves = solves_today.slice().reverse();

    ao_session = mathAvg(solves_today);

    if(total_solves >= 5) {
      ao5 = mathAvg(removeMinMax(descendingTotalSolves.slice(0, 5)));
    }

    if(total_solves >= 12) {
      ao12 = mathAvg(removeMinMax(descendingTotalSolves.slice(0, 12)));
    }
  }

  ao5 = parseFloat(ao5) * 1000;
  ao12 = parseFloat(ao12) * 1000;
  ao_session = parseFloat(ao_session) * 1000;

  ao5 = ao5 >= 0 ? ao5 : -1;
  ao12 = ao12 >= 0 ? ao12 : -1;
  ao_session = ao_session > 0 ? ao_session : -1;
  best_time = best_time > 0 ? best_time : -1;
  worst_time = worst_time > 0 ? worst_time : -1;

  return { ao5, ao12, ao_session, best_time, worst_time }
};

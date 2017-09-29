exports.calcStats = function (solves_today) {

  var assert = require('assert');
  var removeMinMax = require('remove-min-max');
  var mathAvg = require('math-avg');
  var min = require('lodash.min');
  var max = require('lodash.max');

  var sum = 0.0;
  var total_solves = solves_today.length;
  var last_five = [];
  var last_twelve = [];
  var ao5;
  var ao12;
  var ao_session;

  var best_time = parseFloat(min(solves_today)) * 1000;
  var worst_time = parseFloat(max(solves_today)) * 1000;

  if(Array.isArray(solves_today)) {
    // it is assumed that solves_today is chronologically ordered, beginning with the oldest
    var descendingTotalSolves = solves_today.slice().reverse();

    if(total_solves >= 5) {
      last_five = descendingTotalSolves.slice(0, 5);
    }

    ao5 = mathAvg(removeMinMax(last_five));

    if(total_solves >= 12) {
      last_twelve = descendingTotalSolves.slice(0, 12);
    }

    ao12 = mathAvg(removeMinMax(last_twelve));

    ao_session = mathAvg(solves_today);
  }

  ao5 = parseFloat(ao5) * 1000;
  ao12 = parseFloat(ao12) * 1000;
  ao_session = parseFloat(ao_session) * 1000;

  return {ao5, ao12, ao_session, best_time, worst_time}
};

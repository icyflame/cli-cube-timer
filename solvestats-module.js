exports.calcStats = function (solves_today) {

  var assert = require('assert');
  var removeMinMax = require('remove-min-max');
  var mathAvg = require('math-avg');
  var min = require('lodash.min');

  var sum = 0.0;
  var total_solves = solves_today.length;
  var last_five = [];
  var last_twelve = [];
  var ao5;
  var ao12;
  var ao_session;

  var best_time = parseFloat(min(solves_today)) * 1000;

  var i;

  if (total_solves >= 5) {
    for (i = total_solves - 1; i >= total_solves - 5; i -= 1) {
      last_five.push(solves_today[i]);
    }
  }

  ao5 = mathAvg(removeMinMax(last_five));

  if (total_solves >= 12) {
    for (i = total_solves - 1; i >= total_solves - 12; i -= 1) {
      last_twelve.push(solves_today[i]);
    }
  }

  ao12 = mathAvg(removeMinMax(last_twelve));

  ao_session = mathAvg(solves_today);

  ao5 = parseFloat(ao5) * 1000;
  ao12 = parseFloat(ao12) * 1000;
  ao_session = parseFloat(ao_session) * 1000;

  return { ao5, ao12, ao_session, best_time }
};

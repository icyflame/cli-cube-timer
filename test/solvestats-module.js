var assert = require('assert');
var solvestats = require('../solvestats-module');

var solves_today = [
    33.85,
    25.56,
    27.02,
    36.17,
    24.93,
    29.37,
    21.87,
    26.90,
    25.08,
    26.60,
    24.22,
    20.46,
    34.10
];

it('returns object with 5 keys', function () {
    var calcStatsResult = solvestats.calcStats(solves_today);
    var actual = Object.keys(calcStatsResult).sort();
    var expected = [
        "ao5",
        "ao12",
        "ao_session",
        "best_time",
        "worst_time"
    ].sort();

    assert.deepEqual(actual, expected);
});
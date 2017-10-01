var assert = require('assert');
var min = require('lodash.min');
var max = require('lodash.max');
var solvestats = require('../solvestats-module');

var testSolves = [
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
    34.10,
    28.26,
    23.87,
    21.30,
    28.04,
    31.16,
    28.43,
    31.93,
    32.62,
    27.17,
    27.17,
    28.55,
    23.89,
    32.73,
    28.09,
    26.68,
    24.66,
    23.70,
    33.13,
    24.61,
    23.54,
    30.79,
    27.12,
    24.66,
    27.53,
    23.95,
    23.75,
    32.97,
    55.37,
    27.48,
    23.39,
    22.18,
    26.07,
    35.03,
    28.80,
    23.52,
    24.51,
    26.49,
    31.70,
    29.55,
    30.50,
    22.21,
    21.24,
    34.69,
    23.61,
    21.29,
    49.70,
    31.09,
    27.21,
    24.08,
    23.07,
    29.19,
    26.95,
    46.39,
    35.51,
    30.02,
    40.14,
    36.85,
    39.13,
    34.39,
    27.05,
    33.04,
    26.95,
    38.84,
    27.89,
    28.35,
    29.86,
    34.68,
    31.43,
    30.87,
    34.86,
    35.35,
    35.41,
    29.86,
    29.82,
    38.37,
    25.32,
    30.77,
    30.47,
    26.43,
    31.33,
    31.25,
    30.63,
    28.53,
    28.48,
    28.42,
    29.37,
    28.11,
    40.00,
    25.05,
    25.46,
    32.69,
    35.56,
    27.93,
    41.09,
    42.55,
    24.44,
    34.91,
    29.27,
    31.84,
    26.35,
    23.84,
    31.84,
    30.59,
    27.21,
    31.73,
    30.23,
    26.61,
    32.89,
    30.78,
    28.78,
    22.18,
    25.13,
    32.88,
    25.91,
    23.73,
    39.79,
    31.25,
    33.85,
    29.37,
    31.14,
    34.25,
    33.67,
    28.46,
    28.15,
    48.69,
    28.07,
    43.36,
    34.44,
    34.70
];

describe('advisory tests', function () { // quick tests to ensure overall health
    it('returns object with 5 keys', function () {
        var calcStatsResult = solvestats.calcStats(testSolves.slice(0, 1));
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

    it('object returned on number array matches', function () {
        var actual = solvestats.calcStats(testSolves.slice());
        var expected = {
            ao5: 37500,
            ao12: 33139,
            ao_session: 30001.2676056338,
            best_time: 20460,
            worst_time: 55370
        }

        assert.deepEqual(actual, expected);
    });

    it('object returned on empty array matches', function () {
        var actual = solvestats.calcStats([]);
        var expected = {
            ao5: NaN,
            ao12: NaN,
            ao_session: NaN,
            best_time: NaN,
            worst_time: NaN
        }

        var allMatch = true;

        for(var key of Object.keys(expected)) {
            if(!actual.hasOwnProperty(key)) { // key missing
                allMatch = false;
                break;
            }

            if(actual[key] == actual[key]) {
                // NaN is a bad value for comparison
                // however - NaN is the only value that does not compare equal to itself
                // you might attempt to employ isNaN()
                // but isNaN(NaN) === isNaN("nan")

                allMatch = false;
                break;
            }
        }

        assert.equal(true, allMatch);
    });

    it('object returned on non array type matches', function () {
        var actual = solvestats.calcStats("");
        var expected = {
            ao5: NaN,
            ao12: NaN,
            ao_session: 0,
            best_time: NaN,
            worst_time: NaN
        }

        var allMatch = true;

        for(var key of Object.keys(expected)) {
            if(!actual.hasOwnProperty(key)) { // key missing
                allMatch = false;
                break;
            }

            if(!isNaN(actual[key]) && actual[key] !== expected[key]) {
                allMatch = false;
                break;
            } else if(isNaN(actual[key]) && actual[key] == actual[key]) {
                allMatch = false;
                break;
            }
        }

        assert.equal(true, allMatch);
    });
});

describe('ao5', function () {
    it('is set to NaN when input contains less than 5 entries', function () {
        var calcStatsResult = solvestats.calcStats(testSolves.slice(0, 1));
        var actual = isNaN(calcStatsResult.ao5);
        var expected = true;

        assert.equal(actual, expected);
    });

    it('has a number value when input contains 5 entries', function () {
        var calcStatsResult = solvestats.calcStats(testSolves.slice(0, 5));
        var actual = typeof (calcStatsResult.ao5);
        var expected = "number";

        assert.equal(actual, expected);
    });

    describe('has a number value when input contains more than 5 entries', function () {
        it('7 entries', function () {
            var calcStatsResult = solvestats.calcStats(testSolves.slice(0, 7));
            var actual = typeof (calcStatsResult.ao5);
            var expected = "number";

            assert.equal(actual, expected);
        });

        it('13 entries', function () {
            var calcStatsResult = solvestats.calcStats(testSolves.slice(0, 13));
            var actual = typeof (calcStatsResult.ao5);
            var expected = "number";

            assert.equal(actual, expected);
        });

        it('29 entries', function () {
            var calcStatsResult = solvestats.calcStats(testSolves.slice(0, 29));
            var actual = typeof (calcStatsResult.ao5);
            var expected = "number";

            assert.equal(actual, expected);
        });
    });
});

describe('ao12', function () {
    describe('is set to NaN when input contains less than 12 entries', function () {
        it('2 entries', function () {
            var calcStatsResult = solvestats.calcStats(testSolves.slice(0, 2));
            var actual = isNaN(calcStatsResult.ao12);
            var expected = true;

            assert.equal(actual, expected);
        });

        it('5 entries', function () {
            var calcStatsResult = solvestats.calcStats(testSolves.slice(0, 5));
            var actual = isNaN(calcStatsResult.ao12);
            var expected = true;

            assert.equal(actual, expected);
        });

        it('11 entries', function () {
            var calcStatsResult = solvestats.calcStats(testSolves.slice(0, 11));
            var actual = isNaN(calcStatsResult.ao12);
            var expected = true;

            assert.equal(actual, expected);
        });
    });

    it('has a number value when input contains 12 entries', function () {
        var calcStatsResult = solvestats.calcStats(testSolves.slice(0, 12));
        var actual = typeof (calcStatsResult.ao12);
        var expected = "number";

        assert.equal(actual, expected);
    });

    describe('has a number value when input contains more than 12 entries', function () {
        it('13 entries', function () {
            var calcStatsResult = solvestats.calcStats(testSolves.slice(0, 13));
            var actual = typeof (calcStatsResult.ao12);
            var expected = "number";

            assert.equal(actual, expected);
        });

        it('29 entries', function () {
            var calcStatsResult = solvestats.calcStats(testSolves.slice(0, 29));
            var actual = typeof (calcStatsResult.ao12);
            var expected = "number";

            assert.equal(actual, expected);
        });

        it('31 entries', function () {
            var calcStatsResult = solvestats.calcStats(testSolves.slice(0, 31));
            var actual = typeof (calcStatsResult.ao12);
            var expected = "number";

            assert.equal(actual, expected);
        });
    });
});
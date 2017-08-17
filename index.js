module.exports = function () {
  var Stopwatch = require('timer-stopwatch');
  var keypress = require('keypress');
  var clc = require('cli-color');
  var charm = require('charm')();
  var Scrambo = require('scrambo');
  var threebythree = new Scrambo();
  var prettyMs = require('pretty-ms');
  var this_scramble, this_solve, stats = { };

  const STATS_LINES = 10;

  function prettify (ms) {
    return prettyMs(ms, {secDecimalDigits: 2});
  }

  function prettifyVerbose (ms) {
    return prettyMs(ms, {verbose: true, secDecimalDigits: 2});
  }

  function botSay (phrase) {
    console.log(clc.red('Bot: ') + phrase);
  }

  function userSay (phrase) {
    console.log(clc.blue('You: ') + phrase);
  }

  function prepNewSolve () {
    userSay('Press space to initiate a solve.');
    this_scramble = threebythree.get(1).join(' ');
    botSay(this_scramble);
  }

  function eraseInspectSolveLines () {
    charm.position(1, start_inspect);
    charm.erase('end');

    charm.position(1, start_solve);
    charm.erase('end');
  }

  function resetForNextSolve () {
    stopwatch.stop();

    stopwatch.reset(0);
    post_inspect.reset(0);
    inspect.reset(0);

    solving = false;
    inspecting = false;
    post_inspecting = false;

    eraseInspectSolveLines();

    penalty = 0;
  }

  function addToStatsModule (solveTime) {
    if (typeof solveTime !== 'number') {
      return;
    }

    this_solve = (solveTime / 1000.0).toFixed(2);
    solves_today.push(parseFloat(this_solve));
    num_solves += 1;

    stats = calcStats(solves_today);
    ao5 = stats.ao5;
    ao12 = stats.ao12;
    ao_session = stats.ao_session;
    best_time = stats.best_time;
  }

  function print_stats (start_time, total_ms, num_solves, ao5, ao12, ao_session, best_time) {
    console.log('Session statistics');
    console.log('Session started at ' + start_time);
    console.log('You have been cubing for ' + prettifyVerbose(total_ms));
    console.log('Total solves: ' + clc.blue(num_solves));

    if (best_time !== undefined) {
      console.log(clc.green('Best solve: ') + clc.blue(prettifyVerbose(best_time)));
    }

    var ret = { solve: 0, inspect: 0 };

    if (num_solves >= 5) {
      console.log('Your current ' + clc.red('AO5') + ' is ' + clc.blue(prettifyVerbose(ao5)));
      ret.solve ++;
      ret.inspect ++;
    }
    if (num_solves >= 12) {
      console.log('Your current ' + clc.red('AO12') + ' is ' + clc.blue(prettifyVerbose(ao12)));
      ret.solve ++;
      ret.inspect ++;
    }

    console.log('Your current ' + clc.red('Session average') + ' is ' + clc.blue(prettifyVerbose(ao_session)));

    return ret;
  }

  charm.pipe(process.stdout);

  keypress(process.stdin);

  var inspect_options = {
    refreshRateMS: 1000,
    almostDoneMS: 8000
  };

  var inspect = new Stopwatch(15000, inspect_options);
  var post_inspect = new Stopwatch(2000);
  var stopwatch = new Stopwatch();

  inspect.on('time', function (time) {
    if (!inspect.hasBeenStopped) {
      charm.position(1, start_inspect).write('Inspecting: ' + String('00' + (time.ms / 1000).toFixed()).slice(-2));
    }
  });

  inspect.on('done', function () {
    charm.position(1, start_inspect);
    charm.erase('end');
    charm.position(1, start_inspect + 1);
    charm.erase('end');
    charm.position(1, start_inspect);
    console.log(clc.red('Penalty! +2s'));
    inspecting = false;
    post_inspecting = true;
    post_inspect.start();
  });

  post_inspect.on('done', function () {
    charm.position(1, start_inspect);
    charm.erase('end');
    charm.position(1, start_inspect + 1);
    charm.erase('end');
    charm.position(1, start_inspect);
    console.log(clc.red('This solve is a DNF.'));

    resetForNextSolve();
    writeLocal('DNF', this_scramble);
    charm.position(1, start_inspect);
    botSay('That solve was ' + clc.green('DNF'));
    prepNewSolve();
    start_inspect += 3;
    start_solve += 3;
    last_solve = 'DNF';

  });

  stopwatch.on('time', function (time) {
    if (!solving) {
      return;
    }
    charm.position(1, start_solve).write('Solving: ' + (time.ms / 1000).toFixed(2));
  });

  var stats = require('./solvestats-module.js');
  var calcStats = stats.calcStats;

  var push = require('./file-module.js');
  var writeLocal = push.writeLocal;

  var solving = false;
  var inspecting = false;
  var post_inspecting = false;

  var start_inspect = 5;
  var start_solve = 6;

  var last_solve = -1;
  var penalty = 0;

  var right_row_num = 50;

  var num_solves = 0;
  var solves_today = [];
  var ao5 = 0.0;
  var ao12 = 0.0;
  var ao_session = 0.0;
  var best_time = 0.0;

  process.stdin.on('keypress', function (ch, key) {
    switch (key.name) {
      case 'e':
        console.log("\n\n" + clc.green("SESSION ENDED. Session stats follow:") + "\n\n");
        print_stats(start_time, total_time.ms, solves_today.length, ao5, ao12, ao_session, stats.best_time);
        return process.exit(0);

      case 's':
        charm.erase('line');
        charm.left(1);

        var printed = print_stats(start_time, total_time.ms, solves_today.length, ao5, ao12, ao_session, stats.best_time);

        userSay('Press space to initiate a new solve');

        start_solve += (STATS_LINES + printed.solve);
        start_inspect += (STATS_LINES + printed.inspect);

        break;

      case 'space':

        if (!inspecting && !post_inspecting && !solving) {
          // A new solve has been initiated
          inspect.start();
          inspecting = true;
        } else {
          if (inspecting && !post_inspecting && !solving) {
            // Inspection ends, solving begins
            inspect.stop();
            inspect.reset(0);
            stopwatch.start();
            inspecting = false;
            solving = true;
          } else {
            if (!inspecting && post_inspecting && !solving) {
              // Inspection has ended, with a penalty of +2
              // Solving begins
              post_inspect.stop();
              inspect.reset(0);
              post_inspect.reset(0);
              stopwatch.start();
              post_inspecting = false;
              solving = true;
              penalty = 2000;
            } else {
              if (!inspecting && !post_inspecting && solving) {
                var solveTime = stopwatch.ms;

                solveTime = solveTime + penalty;

                addToStatsModule(solveTime);

                writeLocal(this_solve, this_scramble);

                charm.position(1, start_inspect);
                botSay('That solve was ' + clc.green(prettify(solveTime)) +
                  (penalty === 0 ? ' (OK)' : clc.red(' (+2)')));

                if (num_solves > 1) {
                  charm.position(right_row_num, start_inspect);
                  console.log(clc.red(num_solves < 5 ? 'Previous solve: ' : "This session's AO5: ") +
                    clc.blue(typeof last_solve === 'number' ? prettify(num_solves < 5 ? last_solve : ao5) : 'DNF'));
                }

                last_solve = solveTime;

                prepNewSolve();

                start_solve += 3;
                start_inspect += 3;

                resetForNextSolve();

              }
            }
          }
        }

        break;

    }

    if (key.ctrl && key.name === 'c') {
      process.stdin.pause();
    }
  });

  process.stdin.setRawMode(true);
  process.stdin.resume();

  charm.reset();
  botSay("Hey! Let's start solving!");
  botSay('The session starts now!');
  prepNewSolve();

  charm.position(right_row_num, 1);
  console.log(clc.green('Keyboard shortcuts (press e to exit)'));
  charm.position(right_row_num, 2);
  console.log(clc.red('Press space to initiate a solve.'));
  charm.position(right_row_num, 3);
  console.log(clc.blue('Press letter s to see your session statistics.'));

  var start_time = new Date();
  start_time = start_time.getHours() + ':' + start_time.getMinutes();

  var total_time = new Stopwatch();
  total_time.start();
  charm.position(1, start_inspect);
};

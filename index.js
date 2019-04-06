module.exports = function () {
  var Stopwatch = require('timer-stopwatch');
  var keypress = require('keypress');
  var clc = require('cli-color');
  var charm = require('charm')();
  var Scrambo = require('scrambo');
  var threebythree = new Scrambo();
  var prettyMs = require('pretty-ms');
  var this_scramble, last_scramble, this_solve, stats = { };

  const STATS_LINES = 11;

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
    userSay('Press space or click your mouse to initiate a solve.');
    this_scramble = threebythree.get(1).join(' ');
    botSay(this_scramble);

    return 2;
  }

  function eraseInspectSolveLines () {
    charm.position(1, start_inspect);
    charm.erase('end');

    charm.position(1, start_inspect + 1);
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
    worst_time = stats.worst_time;
  }

  function end_session() {
    console.log("\n\n" + clc.green("SESSION ENDED. Session stats follow:") + "\n\n");

    if (post_solving) {
      acceptSolve(last_solve, last_scramble);
    }

    print_stats();

    return process.exit(0);
  }

  function acceptSolve(solveTime, scramble) {
    solve_rep = 'DNF';
    if (typeof solveTime === 'number') {
      solve_rep = (solveTime/1000).toFixed(2);
      addToStatsModule(solveTime);
    }

    writeLocal(solve_rep, scramble);
  }

  function print_stats () {
    console.log('Session statistics');
    console.log('Session started at ' + start_time);
    console.log('You have been cubing for ' + prettifyVerbose(total_time.ms));
    console.log('Total solves: ' + clc.blue(num_solves));

    if (best_time !== undefined) {
      console.log(clc.green('Best solve: ') + clc.blue(prettifyVerbose(best_time)));
    }

    if (worst_time !== undefined) {
      console.log(clc.green('Worst solve: ') + clc.blue(prettifyVerbose(worst_time)));
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

  function print_help (left_position, right_position) {
    var help_message = [
      { func: clc.green, msg: 'Keyboard shortcuts' },
      { func: clc.green, msg: 'Press E to exit cli-cube-timer' },
      { func: clc.red.underline, msg: 'Press SPACE or CLICK YOUR MOUSE to initiate a solve' },
      { func: clc.blue, msg: 'Press S to see your session statistics' },
      { func: clc.blue, msg: 'Press T to trash a solve while the solve timer is running' },
      { func: clc.blue, msg: 'Press D after a solve to change it to a DNF' },
      { func: clc.blue, msg: 'Press P after a solve to add a penalty of 2 seconds' },
      { func: clc.green, msg: 'Press H to print this list of keyboard shortcuts' }
    ];

    for (var init = 0; init < help_message.length; init++) {
      charm.position(left_position, right_position + init);
      console.log(help_message[init].func(help_message[init].msg))
    }

    return help_message.length + 1;
  }

  function space_or_mouse () {
    if (!inspecting && !post_inspecting && !solving) {
      // A new solve has been initiated

      // Last solve has been accepted by user! Let's write it to the local
      // file!
      if (post_solving) {
        // User didn't add penalty to the last solve or make it a DNF!
        post_solving = false;

        acceptSolve(last_solve, last_scramble);
      }

      // Now start inspection for the new solve
      inspect.start();
      inspecting = true;

    } else if (inspecting && !post_inspecting && !solving) {
      // Inspection ends, solving begins
      inspect.stop();
      inspect.reset(0);
      stopwatch.start();
      inspecting = false;
      solving = true;
    } else if (!inspecting && post_inspecting && !solving) {
      // Inspection has ended, with a penalty of +2
      // Solving begins
      post_inspect.stop();
      inspect.reset(0);
      post_inspect.reset(0);
      stopwatch.start();
      post_inspecting = false;
      solving = true;
      penalty = 2000;
    } else if (!inspecting && !post_inspecting && solving) {
      // Solve has ended
      var solveTime = stopwatch.ms;

      solveTime = solveTime + penalty;

      charm.position(1, start_inspect);
      botSay('That solve was ' + clc.green(prettify(solveTime)) +
        (penalty === 0 ? ' (OK)' : clc.red(' (+2)')));

      if (num_solves > 1) {
        charm.position(right_row_num, start_inspect);
        console.log(clc.red(num_solves < 5 ? 'Previous solve: ' : "This session's AO5: ") +
          clc.blue(typeof last_solve === 'number' ? prettify(num_solves < 5 ? last_solve : ao5) : 'DNF'));
      }

      last_solve = solveTime;
      last_scramble = this_scramble;

      prepNewSolve();

      start_inspect += 3;

      // The user can still decide to reject this solve!
      post_solving = true;

      resetForNextSolve();

    }
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

    post_solving = true;
    resetForNextSolve();

    charm.position(1, start_inspect);
    botSay('That solve was ' + clc.green('DNF'));

    prepNewSolve();
    start_inspect += 3;
    last_solve = 'DNF';

  });

  stopwatch.on('time', function (time) {
    if (!solving) {
      return;
    }
    charm.position(1, start_inspect + 1).write('Solving: ' + (time.ms / 1000).toFixed(2));
  });

  var stats = require('./solvestats-module.js');
  var calcStats = stats.calcStats;

  var push = require('./file-module.js');
  var writeLocal = push.writeLocal;

  var solving = false;
  var post_solving = false;
  var inspecting = false;
  var post_inspecting = false;

  var start_inspect = 0;

  var last_solve = -1;
  var penalty = 0;

  var right_row_num = 50;

  var num_solves = 0;
  var solves_today = [];
  var ao5 = 0.0;
  var ao12 = 0.0;
  var ao_session = 0.0;
  var best_time = 0.0;
  var worst_time = 0.0;

  process.stdin.on('keypress', function (ch, key) {
    if (key === undefined) {
      return;
    }
    switch (key.name) {
      case 'e':
        return end_session();

      case 's':
        charm.erase('line');
        charm.left(1);

        var printed = print_stats();

        userSay('Press space or click your mouse to initiate a new solve');

        start_inspect += (STATS_LINES + printed.inspect);

        break;

      case 'space':

        space_or_mouse();

        break;

      case 't':

        if (!inspecting && !post_inspecting && solving) {
          // Solve has been trashed by the solver
          // (Probably because they were disturbed during the solve)
          // Reset everything and show a new scramble to the solver
          charm.position(1, start_inspect);
          botSay('That solve was trashed');

          prepNewSolve();

          start_inspect += 3;

          resetForNextSolve();

        } else if (!inspecting && !post_inspecting && !solving && post_solving) {
          // Solve completed, but the user would like to trash this solve
          post_solving = false;
          botSay("The previous solve was trashed");
          start_inspect += 2;
        }

        break;

      case 'd':
      case 'p':

        if (!inspecting && !post_inspecting && !solving && post_solving) {
          // User has decided to either add +2 to this solve time and write it
          // to file or make it a DNF
          post_solving = false;

          if (key.name === 'd') {
            botSay("The previous solve was changed to DNF");
            acceptSolve('DNF', last_scramble);
            start_inspect += 2;
          } else if (key.name === 'p' && typeof last_solve === 'number') {
            // The 2nd check ensures that the addition below will not cause any
            // error, when we reach this position through the "DNF because solve
            // didn't start within 17 seconds" flow
            last_solve += 2000;
            botSay("A penalty of 2 seconds was added to the previous solve");
            acceptSolve(last_solve, last_scramble);
            start_inspect += 2;
          }
        }

        break;

      case 'h':

        if (!solving && !inspecting && !post_inspecting) {
          var diff = print_help(0, start_inspect);
          start_inspect += diff;
        }

        break;

      default:

        break;

    }

    if (key.ctrl && key.name === 'c') {
      return end_session();
    }
  });

  process.stdin.setRawMode(true);

  process.stdin.on('mousepress', function (click) {
    if (click.release) {
      space_or_mouse();
    }
  });

  process.on('exit', function () {
    //disable mouse on exit, so that the state is back to normal for the terminal.
    keypress.disableMouse(charm);
  });

  process.stdin.resume();

  charm.reset();
  keypress.enableMouse(charm);
  botSay("Hey! Let's start solving!");
  botSay('The session starts now!');

  start_inspect = print_help(right_row_num, 1);

  charm.position(1, start_inspect)
  start_inspect += prepNewSolve();

  start_time = (new Date()).toTimeString().split(' ')[0]

  var total_time = new Stopwatch();
  total_time.start();
  charm.position(1, start_inspect);
};

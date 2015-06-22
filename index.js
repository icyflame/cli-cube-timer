module.exports = function(){

	var readline = require('readline');
	var Stopwatch = require('timer-stopwatch');
	var keypress = require('keypress');
	var clc = require('cli-color');
	var charm = require('charm')();
	var util  =  require('util');
	var Scrambo = require('scrambo');
	var threebythree = new Scrambo();

	function botSay (phrase) {
		console.log(clc.red("Bot: ") + phrase);
	}

	function userSay (phrase) {
		console.log(clc.blue("You: ") + phrase);
	}

	function prepNewSolve() {
		userSay("Press space to initiate a solve.");
		this_scramble = threebythree.get(1).join(" ")
		botSay(this_scramble);
	}

	function resetForNextSolve() {
		stopwatch.stop();

		stopwatch.reset(0);
		post_inspect.reset(0);
		inspect.reset(0);

		solving = false;
		inspecting = false;
		post_inspecting = false;

		charm.position(1, start_inspect);
		charm.erase("end");

		charm.position(1, start_solve);
		charm.erase("end");
	}

	function addToStatsModule(solveTime) {
		this_solve = (solveTime / 1000.0).toFixed(2);
		solves_today.push(parseFloat(this_solve));

		var stats = calcStats(solves_today);
		ao5 = stats[0];
		ao12 = stats[1];
		ao_session = stats[2];

		writeLocal(this_solve, this_scramble);
		num_solves += 1;
	}

	charm.pipe(process.stdout);

	keypress(process.stdin);

	var inspect_options = {
		refreshRateMS: 1000,
		almostDoneMS: 8000,
	};

	var inspect = new Stopwatch(15000, inspect_options);
	var post_inspect = new Stopwatch(2000);
	var stopwatch = new Stopwatch();

	inspect.on('time', function(time) {
		if(!inspect.hasBeenStopped)
			charm.position(1, start_inspect).write("Inspecting: " + String('00'+(time.ms / 1000).toFixed()).slice(-2));
	});

	inspect.on('done', function(){
		charm.position(1, start_inspect);
		charm.erase("end");
		charm.position(1, start_inspect+1);
		charm.erase("end");
		charm.position(1, start_inspect);
		console.log(clc.red('Penalty!')); 
		console.log('You must start the solve within the next two seconds');
		inspecting = false;
		post_inspecting = true;
		post_inspect.start();
	});

	post_inspect.on('done', function(){
		charm.position(1, start_inspect);
		charm.erase("end");
		charm.position(1, start_inspect+1);
		charm.erase("end");
		charm.position(1, start_inspect);
		console.log("This solve is a DNS.");
	// console.log("You exceeded your inspection time.");
});

	stopwatch.on('time', function(time){
		if(!solving)
			return;
		charm.position(1, start_solve).write("Solving: " + (time.ms / 1000).toFixed(2));
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

	var right_row_num = 50;

	var num_solves = 0;
	var solves_today = new Array();
	var ao5 = 0.0, ao12 = 0.0, ao_session = 0.0;

	process.stdin.on('keypress', function (ch, key) {

		if(key.name == 's'){
			charm.erase("line");
			charm.left(1);
			console.log("Session statistics");
			console.log("Session started at " + start_time);
			console.log("You have been cubing for " + (total_time.ms / 1000 / 60).toFixed(2) + " minutes");
			if(solves_today.length >= 5){
				console.log("Your current " + clc.red("AO5") + " is " + clc.blue(ao5));
				start_solve += 1;
				start_inspect += 1;
			}
			if(solves_today.length >= 12){
				console.log("Your current " + clc.red("AO12") + " is " + clc.blue(ao12));
				start_solve += 1;
				start_inspect += 1;
			}

			console.log("Your current " + clc.red("Session average") + " is " + clc.blue(ao_session));
			console.log(clc.blue("You: ") + "Press space to initiate a new solve");

			start_solve += 5;
			start_inspect += 5;
		}

		if(!inspecting && !post_inspecting && !solving && key.name == 'space'){
		// A new solve has been initiated
		inspect.start();
		inspecting = true;
	}

	else
		if(inspecting && !post_inspecting && !solving && key.name == 'space'){
			// Inspection ends, solving begins
			inspect.stop();
			inspect.reset(0);
			stopwatch.start();
			inspecting = false;
			solving = true;
		}
		else
			if(!inspecting && post_inspecting && !solving && key.name == 'space'){
				// Inspection has ended, with a penalty of +2
				// Solving begins
				post_inspect.stop();
				inspect.reset(0);
				post_inspect.reset(0);
				stopwatch.start();
				post_inspecting = false;
				solving = true;
			}

			else
				if(!inspecting && !post_inspecting && solving && key.name == 'space'){

					var solveTime = stopwatch.ms;

					resetForNextSolve();

					addToStatsModule(solveTime);

					charm.position(1, start_inspect);				
					botSay("That solve was " + clc.green(this_solve + ' seconds'));

					if(num_solves > 1) {
						charm.position(right_row_num, start_inspect);
						if(num_solves < 5)
							console.log(clc.red("Previous solve: ") + clc.blue(last_solve));
						else
							console.log(clc.red("This session's AO5: ") + clc.blue(ao5));
					}

					prepNewSolve();

					start_solve += 3;
					start_inspect += 3;

					last_solve = this_solve;

				}

				if (key.ctrl && key.name == 'c') {
					process.stdin.pause();
				}
			});

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

charm.reset();
botSay("Hey! Let's start solving!");
botSay("The session starts now!");
prepNewSolve();

charm.position(right_row_num, 1);
console.log(clc.green("Keyboard shortcuts"));
charm.position(right_row_num, 2);
console.log(clc.red("Press space to initiate a solve."));
charm.position(right_row_num, 3);
console.log(clc.blue("Press letter s to see your session statistics."));

var start_time = new Date();
start_time = start_time.getHours() + ":" + start_time.getMinutes();
// console.log(start_time);

var total_time = new Stopwatch();
total_time.start();
charm.position(1, start_inspect);

}

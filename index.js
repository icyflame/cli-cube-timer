/*
 * Rubik's Cube Timer on the Command Line
 *
 * Siddharth Kannan <kannan.siddharth12@gmail.com>
 * MIT License
 */

module.exports = function(){
	var readline = require('readline');
	var Stopwatch = require('timer-stopwatch');
	var keypress = require('keypress');
	var clc = require('cli-color');
	var charm = require('charm')();
	var util  =  require('util');
	var Scrambo = require('scrambo');
	var threebythree = new Scrambo(); // Defaults to 3x3

	charm.pipe(process.stdout);

	keypress(process.stdin);

	var inspect_options = {
		refreshRateMS: 1000,
		almostDoneMS: 8000,
	}

	var inspect = new Stopwatch(15000, inspect_options);
	var stopwatch = new Stopwatch();

	inspect.on('time', function(time) {
		charm.position(1, start_inspect).write("Inspecting: " + String('00'+(time.ms / 1000).toFixed()).slice(-2));
	});

	inspect.on('done', function(){
		console.log('This solve is +2');
	});

	stopwatch.on('time', function(time){
		if(!solving)
		return;
	charm.position(1, start_solve).write("Solving: " + (time.ms / 1000).toFixed(2));
	});

	stats = require('./solvestats-module.js');
	calcStats = stats.calcStats;
	
	push = require('./file-module.js');
	writeLocal = push.writeLocal;

	var solving = false;
	var inspecting = false;

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

		if(!inspecting && !solving && key.name == 'space'){
			inspect.start();
			inspecting = true;
		}

		else
			if(inspecting && !solving && key.name == 'space'){
				inspect.stop();
				inspect.reset(0);
				stopwatch.start();
				inspecting = false;
				solving = true;
			}

			else
				if(!inspecting && solving && key.name == 'space'){

					// A solve has been completed.
					solving = false;
					inspecting = false;

					var solveTime = stopwatch.ms;
					stopwatch.stop();
					stopwatch.reset(0);

					charm.position(1, start_inspect);
					charm.erase("end");

					charm.position(1, start_solve);
					charm.erase("end");

					charm.position(1, start_inspect);
					this_solve = (solveTime / 1000.0).toFixed(2);
					console.log(clc.red("Bot: ") + "That solve was " + clc.green(this_solve + ' seconds'));
					solves_today.push(parseFloat(this_solve));

					// charm.position(right_row_num, 20);
					// console.log(calcStats(solves_today));

					var stats = calcStats(solves_today);
					ao5 = stats[0];
					ao12 = stats[1];
					ao_session = stats[2];

					writeLocal(this_solve, this_scramble);

					if(last_solve < 0)
						console.log(clc.red("Bot: ") + "Great start! Keep the cube twisting!");
					else{
						num_solves += 1;

						charm.position(right_row_num, start_inspect);
						if(num_solves < 5)
							console.log(clc.red("Previous solve: ") + clc.blue(last_solve));
						else
							console.log(clc.red("This session's AO5: ") + clc.blue(ao5));
					}

					this_scramble = threebythree.get(1).join(" ");

					console.log(clc.red("Bot: ") + this_scramble);
					console.log(clc.blue("You: ") + "Press space to start a solve!");

					start_solve += 3;
					start_inspect += 3;

					if(last_solve < 0){
						start_solve += 1;
						start_inspect += 1;
					}

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
	console.log(clc.red("Bot: ") + "Hey! Let's start solving!");
	console.log(clc.red("Bot: ") + "The session starts now!");
	console.log(clc.blue("You: ") + "Press space to initiate a solve.");
	var this_scramble = threebythree.get(1).join(" ");
	console.log(clc.red("Bot: ") + this_scramble);

	charm.position(right_row_num, 1);
	console.log(clc.green("Keyboard shortcuts"));
	charm.position(right_row_num, 2);
	console.log(clc.red("Press space to initiate a solve."));
	charm.position(right_row_num, 3);
	console.log(clc.blue("Press letter s to see your session statistics."));

	var start_time = new Date();
	start_time = start_time.getHours() + ":" + start_time.getMinutes();
	// console.log(start_time);

	total_time = new Stopwatch();
	total_time.start();
	charm.position(1, start_inspect);

}

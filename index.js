/*
 * Rubik's Cube Timer on the Command Line
 *
 * Siddharth Kannan <kannan.siddharth12@gmail.com>
 * MIT License
 */

var readline = require('readline');
var Stopwatch = require('timer-stopwatch');
var keypress = require('keypress');
var clc = require('cli-color');
var charm = require('charm')();
charm.pipe(process.stdout);
charm.reset();

keypress(process.stdin);

var inspect_options = {
	refreshRateMS: 1000,      // How often the clock should be updated
	almostDoneMS: 8000,    // When counting down - this event will fire with this many milliseconds remaining on the clock
}

var inspect = new Stopwatch(15000, inspect_options);
var stopwatch = new Stopwatch();

inspect.on('time', function(time) {
	charm.position(1, 3).write("Inspecting: " + String('00'+(time.ms / 1000).toFixed()).slice(-2));
});

inspect.on('done', function(){
	console.log('This solve is +2');
});

stopwatch.on('time', function(time){
	charm.position(1, 4).write("Solving: " + (time.ms / 1000).toFixed(2));
});

stopwatch.on('done', function(){
	console.log("\n");
	console.log("This solve was " + stopwatch.ms);
	console.log("-----------------------------------");
	console.log("\n");
});


var solving = false;
var inspecting = false;

process.stdin.on('keypress', function (ch, key) {
	// console.log('got "keypress"', key);
	//
	// console.log("Inspecting: " + inspecting);
	// console.log("Solving: " + solving);

	if(key.name == 'r'){
		inspecting = false;
		solving = false;
		console.log("Everything reset for the next solve!");
	}

	if(!inspecting && !solving && key.name == 'space'){
		inspect.start();
		inspecting = true;
	}

	else
	if(inspecting && !solving && key.name == 'space'){
		inspect.stop();
		inspect.reset(0);
		console.log("START SOLVING!");
		stopwatch.start();
		inspecting = false;
		solving = true;
	}

	else
		if(!inspecting && solving && key.name == 'space'){
			console.log("\n\n");
			console.log("This solve was: " + stopwatch.ms / 1000.0);
			stopwatch.stop();
			stopwatch.reset(0);
			inspecting = false;
			solving = false;
			console.log("All set for the next solve!");
		}

if (key.ctrl && key.name == 'c') {
	process.stdin.pause();
}
});

var rl = readline.createInterface({
	input: process.stdin,
		output: process.stdout
});

console.log(clc.red("Bot: Hey! Let's start solving!"));
console.log(clc.blue("You: Press space to initiate a WCA solve. (15 sec inspection)"));

/*
	 rl.question("What do you think of node.js? ", function(answer) {
	 console.log("Thank you for your valuable feedback:", answer);

	 rl.close();
	 });
	 */


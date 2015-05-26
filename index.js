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
var jf  =  require('jsonfile')
var util  =  require('util')

charm.pipe(process.stdout);

keypress(process.stdin);

var inspect_options = {
	refreshRateMS: 1000,      // How often the clock should be updated
	almostDoneMS: 8000,    // When counting down - this event will fire with this many milliseconds remaining on the clock
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

stopwatch.on('done', function(){
	console.log("\n");
	console.log("This solve was " + stopwatch.ms);
	console.log("-----------------------------------");
	console.log("\n");
});


var solving = false;
var inspecting = false;

var start_inspect = 3;
var start_solve = 4;

process.stdin.on('keypress', function (ch, key) {

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

			charm.position(1, start_solve);
			charm.erase("end");
			charm.position(1, start_inspect);
			console.log(clc.red("Bot: ") + "That solve was " + (solveTime / 1000.0).toFixed(2) + ' seconds');
			console.log(clc.blue("You: Press space to start a solve!"));

			start_solve += 2;
			start_inspect += 2;

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
console.log(clc.red("Bot: Hey! Let's start solving!"));
console.log(clc.blue("You: Press space to initiate a solve."));

var right_row_num = 50;
charm.position(right_row_num, 1);
console.log(clc.green("Keyboard shortcuts"));
charm.position(right_row_num, 2);
console.log(clc.red("Press space to initiate a solve."));
charm.position(right_row_num, 3);
console.log(clc.blue("Press the letter t to see your session statistics"));

/*
var file  =  './data.json';
jf.readFile(file, function(err, obj) {
	console.log("It is: ");
	console.log(typeof(obj));
	console.log(util.inspect(obj))
});

obj = {name: 'Yu'};

jf.writeFileSync(file, obj);
*/
/*
	 rl.question("What do you think of node.js? ", function(answer) {
	 console.log("Thank you for your valuable feedback:", answer);

	 rl.close();
	 });
	 */


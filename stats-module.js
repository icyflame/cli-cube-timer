module.exports = function(){

	var xdg = require('xdg-basedir');
	var file_name = xdg.data + "/cube/pushed.csv";

	var fs = require('fs');
	var csv = require('fast-csv');
	var Stats = require('fast-stats').Stats;
	var clc = require('cli-color');
	var barHorizontal = require('bar-horizontal');

	var prettyMs = require('pretty-ms');

	function prettifyVerbose(ms) {
		return prettyMs(ms, {verbose: true, secDecimalDigits: 2})
	}

	var stream = fs.createReadStream(file_name);
	var all_times = new Stats({bucket_precision: 10});

	var csvStream	= csv()
	.on("data", function(data){
		if (data[0] !== 'DNF') {
			// isolate the time
			all_times.push(parseFloat(data[0]));
		}
	}).on("end", function(){
			// console.log("Completed!");
			// console.log(all_times);
			console.log("Mean of all solves: " + clc.green(prettifyVerbose(all_times.amean() * 1000)));
			console.log("Standard Deviation: " + clc.green(prettifyVerbose(all_times.stddev() * 1000)));
			var range = all_times.range();
			console.log("Best Solve: " + clc.green(prettifyVerbose(range[0] * 1000)));
			console.log("Worst Solve: " + clc.green(prettifyVerbose(range[1] * 1000)));
			// console.log(all_times.distribution());

			var distribution = all_times.distribution();

			input_obj = {};

			distribution.forEach(function(e){
				input_obj[clc.blue(e.count + ' (' + e.range[0] + '+)')] = e.count;
			});

			barHorizontal(input_obj, { labels: true });

		});

	stream.pipe(csvStream);
}

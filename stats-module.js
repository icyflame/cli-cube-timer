module.exports = function(){

	var xdg = require('xdg-basedir');
	var file_name = xdg.data + "/cube/pushed.csv";

	var fs = require('fs');
	var csv = require('fast-csv');
	var Stats = require('fast-stats').Stats;
	var clc = require('cli-color');

	var prettyMs = require('pretty-ms');

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
			console.log("Mean of all solves: " + clc.green(prettyMs(all_times.amean().toFixed(3) * 1000)));
			console.log("Standard Deviation: " + clc.green(prettyMs(all_times.stddev().toFixed(3)*1000)));
			var range = all_times.range();
			console.log("Best Solve: " + clc.green(prettyMs(range[0].toFixed(3)*1000)));
			console.log("Worst Solve: " + clc.green(prettyMs(range[1].toFixed(3)*1000)));
			// console.log(all_times.distribution());
			
			var distribution = all_times.distribution();

			distribution.forEach(function(e){
				console.log(clc.blue(e.range[0] + "+: ") + e.count);
			});
		});

	stream.pipe(csvStream);
}

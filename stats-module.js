module.exports = function(){
	var file_name = process.env.HOME + "/.cube/times.csv";

	var fs = require('fs');
	var csv = require('fast-csv');
	var Stats = require('fast-stats').Stats;
	var clc = require('cli-color');

	var stream = fs.createReadStream(file_name);
	var all_times = new Stats({bucket_precision: 10});

	var csvStream	= csv()
		.on("data", function(data){
			// isolate the time		
			all_times.push(parseFloat(data[0]));
		}).on("end", function(){
			// console.log("Completed!");
			// console.log(all_times);
			console.log("Mean of all solves: " + clc.green(all_times.amean().toFixed(2) + " seconds"));
			console.log("Standard Deviation: " + clc.green(all_times.stddev().toFixed(2) + " seconds"));
			// console.log(all_times.distribution());
			var distribution = all_times.distribution();

			distribution.forEach(function(e){
				console.log(clc.blue(e.range[0] + "+: ") + e.count);
			});
		});

	stream.pipe(csvStream);
}

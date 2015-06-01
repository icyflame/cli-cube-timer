exports.pushGist = function(solvetime, scramble){
	
	solvestring = solvetime + ", " + scramble + "\n";

	var fileExists = require('file-exists');

	if(!fileExists(process.env.HOME + '/.cube/times.csv')){
		var mkdirp = require('mkdirp');
		mkdirp(process.env.HOME + '/.cube');
	}

	file = process.env.HOME + "/.cube/times.csv";

	var fs = require('fs');

	fs.appendFileSync(file, solvestring);

}

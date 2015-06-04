exports.pushGist = function(solvetime, scramble){
	
	solvestring = solvetime + ", " + scramble + "\n";

	var fileExists = require('file-exists');
	var xdg = require('xdg-basedir');
	var fs = require('fs');
	var filepath = xdg.data + "/cube/times.csv";

	if(!fileExists(xdg.data + '/cube/times.csv')){
		var mkdirp = require('mkdirp');
		mkdirp(xdg.data + '/cube');
		fs.writeFileSync(filepath, solvestring);
	}

	else
		fs.appendFileSync(filepath, solvestring);
}

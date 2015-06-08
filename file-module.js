exports.writeLocal = function(solvetime, scramble){
	
	solvestring = solvetime + ", " + scramble + "\n";

	var fs = require('fs');

	filepath = require('./file-module.js').checkLocalFile();

	fs.appendFileSync(filepath, solvestring);
}

exports.checkLocalFile = function(){
	var fileExists = require('file-exists');
	var touch = require('touch');
	var xdg = require('xdg-basedir');

	var filepath = xdg.data + "/cube/times.csv";

	if(!fileExists(filepath)){
		var mkdirp = require('mkdirp');
		mkdirp(xdg.data + '/cube');
		touch(filepath);
	}

	return filepath;
}
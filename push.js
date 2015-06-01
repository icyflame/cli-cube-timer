exports.pushGist = function(solvetime, scramble){
	
	solvestring = solvetime + ", " + scramble + "\n";

	file = "data.csv";

	var fs = require('fs');

	fs.appendFileSync(file, solvestring);

}

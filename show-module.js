module.exports = function(arg){

	switch(arg){
		case 'gist': {
			var pkg = require("./package.json");
			var configstore = require('configstore');
			var conf = new configstore(pkg.name);
			var clc = require('cli-color');

			if(conf.size < 2){
				console.log("You have not authenticated yet.");
				console.log("Please run " + clc.green("solve login") + " before running " + clc.red("solve push"));
			}
			else
				if(conf.get("gist_id") && conf.get("username")){
					console.log("Visit this URL for your solve history: ");
					console.log("https://gist.github.com/" + conf.get("username") + "/" + conf.get("gist_id"));
				}
				else{
					console.log("You are authenticated, but we don't have a Gist ID.")
					console.log("Log a few solves, and then run " + clc.green("solve push") + " to get a Gist ID.");
				}
			break;
		}

		default: {
			console.log("Unknown option!");
			console.log("For recognised options, check the README file here:");
			console.log("http://github.com/icyflame/node-cube-cli-timer");
			break;
		}

	}

}

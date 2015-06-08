module.exports = function(){

	var request = require('request-json');
	var xdg = require('xdg-basedir');
	var clc = require('cli-color');
	var pkg = require('./package.json');

	var configstore = require('configstore');
	var conf = new configstore(pkg.name);

	// console.log(conf.path);

	// read file

	var fs = require('fs');

	filepath = require('./file-module.js').checkLocalFile();

	var glob = fs.readFileSync(filepath).toString();

	if(glob.length <= 0){
		console.log("It seems you have not logged any new solves!");
		console.log("Use " + clc.red("solve") + " from your CLI, and then run " + clc.green("solve push"));
		return;
	}

	// GH flow begin

	// case 0: not yet authenticated

	if(conf.size < 2){
		console.log("You have not authenticated yet.");
		console.log("Please run " + clc.green("solve login") + " before running " + clc.red("solve push"));
	}

	else{

		var client = request.createClient("https://api.github.com/");

		if(conf.get("username") && conf.get("oauth_token")){

			client.setBasicAuth(conf.get("username"), conf.get("oauth_token"));

			if(conf.get("gist_id")){
				// case 2: authenticated, and gist exists too

				// fetch gist

				client.get("gists/" + conf.get("gist_id"), function(err, res, body){
					for(var key in body.files){
						// console.log(key);
						var oldcont = body.files[key].content;
						var newcont = oldcont += glob;
						break;
					}

					// console.log(oldcont);

					var newData = {
						"files": {
							"times.csv": {
								"content": newcont
							},
							"updated-on.txt":{
								"content": new Date().toString()
							}
						}
					};

					client.patch("gists/" + conf.get("gist_id"), newData, function(err, res, body){
						if(!err && res.statusCode == 200){
							console.log("Successfully updated on GitHub!");
							console.log("Your solves are available at: ");
							console.log(body.html_url);
							require("./file-module.js").deleteLocalFile();
							require('./file-module.js').writeToPushed(glob);
						}
						else{
							console.log("HTTP Status Code: " + res.statusCode);
							console.log("We encountered an error!");
						}

					});

				});

				// send patch request

				// console.log("case 2");
			}

			else{
				// case 1: authenticated, but gist not created yet

				// send POST request to gists

				data = {
					"description": "All the solvetimes as recorded in CLI Cube Timer, https://npmjs.org/package/cli-cube-timer",
					"public": true,
					"files": {
						"times.csv": {
							"content": glob
						},
						"updated-on.txt":{
							"content": new Date().toString()
						}
					}
				};

				client.post("gists", data, function(err, res, body){

					if(res.statusCode == 201){

						// store gistid in conf file
						// show URL to user
						console.log(clc.green("Successfully pushed to Github!"));
						console.log("You can find your solves at: ");
						console.log(body.html_url);
						conf.set("gist_id", body.id);

						require("./file-module.js").deleteLocalFile();
					}
				});

			}

		}
	}
	// GH flow end
}

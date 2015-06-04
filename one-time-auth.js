// module.exports = function(){

	console.log("Welcome to your one-time-authentication module.");
	console.log("This module will take your github username and password\n\
		and exchange it for an OAuth token, which it will store in ~/.config/cube.");

	var username, password;

	var read = require("read");
	var request = require('request-json');
	var util = require('util');
	var nconf = require('nconf');

	read({

		prompt: "Enter your username: ",

	}, function(err, result, isDef){
		username = result;

		read({

			prompt: "Enter your password: ",
			silent: true

		}, function(err, result, isDef){
			password = result;
			var client = request.createClient("https://api.github.com/");

			client.setBasicAuth(username, password);

			nconf.file({file: process.env.HOME + "/.config/cube"});

			nconf.set("user:username", username);

			var data = {
				"scopes": ["gist"],
				"note": "OAuth token for node-cube-cli-timer.",
				"client_id": "678a9606a01d79c24046",
				"client_secret": "266c833862498ac55856cf276a26c8b680515e91"
			};

			client.post("authorizations", data, function(err, res, body){

				console.log(util.inspect(body));
				console.log(body.token);
				console.log(body.token.length);

				nconf.set("user:oauth", body.token);

				nconf.save(function(err){
					if(err)
						console.log("Error: " + err);
				});

			});

		});
	});

// }
#!/usr/bin/env node
'use strict';

var meow = require('meow');

var cli = meow({
	help: [
	"Usage",
	"  solve",
	"    - Start a solve session",
	"  solve stats",
	"    - View your complete lifetime statistics",
	"  solve login",
	"    - Run the one time authentication module (GitHub)",
	"  solve push",
	"    - Push all your solves to a GitHub gist",
	"  solve --show gist",
	"    - Get the link of the Gist where all the times are stored."
	].join("\n")
});

if(cli.flags.show){
	require("./show-module.js")(cli.flags.show);
}

else 
	if(cli.input.length >= 1){
		var arg = cli.input[0];

		switch(arg){
			case 'stats': require("./stats-module.js")(); break;
			case 'login': require("./login-module.js")(); break;
			case 'push': require("./push-module.js")(); break;
		}
	}

	else{
		require("./index.js")();
	}

#!/usr/bin/env node
'use strict';

var meow = require('meow');

var cli = meow({
	help: [
	"Usage",
		"  solve",
		"    - Start a solve session",
		"  solve stats",
		"    - View your complete lifetime statistics"
	].join("\n")
});

if(cli.input.length >= 1){
	if(cli.input[0] == "stats")
		require("./stats-module.js")();
	else
		if(cli.input[0] == "login")
			require("./login.js")();
		else
			if(cli.input[0] == "push")
				require("./gist-push.js")();
}
else{
	var start_solving = require('./index.js');
	start_solving();
}

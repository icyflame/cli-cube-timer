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
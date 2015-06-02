#!/usr/bin/env node
'use strict';

var meow = require('meow');

var cli = meow({
	help: [
		"Usage",
		" Start a solve session"
	].join("\n")
});

// console.log(cli.input.length);
// var util = require('util');
// console.log(util.inspect(cli));

var start_solving = require('./index.js');

start_solving();


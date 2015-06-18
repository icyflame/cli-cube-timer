module.exports = function(){

	var read = require('read');

	read({
		prompt: "Are you sure you want to logout? (y/n)",

	}, function(err, result, isDef){
		if(result == 'y' || result == 'Y'){
			var pkg = require('./package.json');
			var configstore = require('configstore');
			var conf = new configstore(pkg.name);
			var clc = require('cli-color');

			conf.del('username');
			conf.del('oauth_token');

			console.log(clc.green("Logged out!"));

		}
	});

}

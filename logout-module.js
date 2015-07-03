module.exports = function () {
  var read = require('read')

  read({
    prompt: 'Are you sure you want to logout? (y/n)'

  }, function (err, result, isDef) {
    if (err) {
      console.log(require('util').inspect(err, { depth: null }))
    }
    if (result === 'y' || result === 'Y') {
      var pkg = require('./package.json')
      var Configstore = require('configstore')
      var conf = new Configstore(pkg.name)
      var clc = require('cli-color')

      conf.del('username')
      conf.del('oauth_token')

      console.log(clc.green('Logged out!'))

    }
  })

}

exports.writeLocal = function (solvetime, scramble) {
  var solvestring = solvetime + ', ' + scramble + '\n'

  var fs = require('fs')

  var filepath = require('./file-module.js').checkLocalFile()

  fs.appendFileSync(filepath, solvestring)
}

exports.checkLocalFile = function () {
  var fileExists = require('file-exists')
  var touch = require('touch')
  var xdg = require('xdg-basedir')

  var filepath = xdg.data + '/cube/times.csv'

  if (!fileExists(filepath)) {
    var mkdirp = require('mkdirp')
    mkdirp(xdg.data + '/cube')
    touch(filepath)
  }

  return filepath
}

exports.deleteLocalFile = function () {
  // empty the file times.csv

  var trash = require('trash')

  var filepath = require('./file-module.js').checkLocalFile()

  trash([filepath], function (err) {
    if (err) {
      console.log('There was an error in removing the file.')
      console.log(err)
    }
  // else
  // console.log("Old file removed!")
  })
}

exports.writeToPushed = function (glob) {
  var fileExists = require('file-exists')
  var touch = require('touch')
  var xdg = require('xdg-basedir')

  var filepath = xdg.data + '/cube/pushed.csv'

  if (!fileExists(filepath)) {
    var mkdirp = require('mkdirp')
    mkdirp(xdg.data + '/cube')
    touch(filepath)
  }

  var fs = require('fs')

  fs.writeFileSync(filepath, glob)

  return filepath
}

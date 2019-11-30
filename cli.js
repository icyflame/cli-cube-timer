#!/usr/bin/env node
'use strict';

var meow = require('meow');

var cli = meow({
  help: [
    'Usage',
    '  solve',
    '    - Start a solve session',
    '  solve stats',
    '    - View your complete lifetime statistics',
    '  solve stats --bucket 5',
    '    - View your lifetime statistics with the bar graph broken at every 5 seconds',
    '  solve stats --min 20',
    '    - View statistics for all solves above 20 seconds',
    '  solve stats --max 30',
    '    - View statistics for all solves below 30 seconds',
    '  solve stats --min 20 --after "2019-01-01"',
    '    - View statistics for all solves above 20s, created (with v1.2.0+) after 1st January, 2019',
    '  solve stats --before "2019-11-01"',
    '    - View statistics for all solves created (with v1.2.0+) before 1st November, 2019',
    '  solve login',
    '    - Run the one time authentication module (GitHub)',
    '  solve push',
    '    - Push all your solves to a GitHub gist',
    '  solve --show gist',
    '    - Get the link of the Gist where all the times are stored.',
    '  solve --file|--files',
    '    - Print the local file paths where all the past history is stored'
  ].join('\n')
});

if (cli.flags.show) {
  require('./show-module.js')(cli.flags.show);
} else if (cli.flags.file || cli.flags.files) {
  require('./file-module.js').print_paths();
} else if (cli.input.length >= 1) {
  var arg = cli.input[0];

  switch (arg) {
    case 'stats': require('./stats-module.js')({
      bucket: cli.flags.bucket,
      min: cli.flags.min,
      max: cli.flags.max,
      before: cli.flags.before,
      after: cli.flags.after,
    });
      break;
    case 'login': require('./login-module.js')();
      break;
    case 'logout': require('./logout-module.js')();
      break;
    case 'push': require('./push-module.js')();
      break;
  }
} else {
  require('./index.js')();
}

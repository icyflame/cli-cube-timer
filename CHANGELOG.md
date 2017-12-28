# 0.9.2

- Support for three new actions inside the solve window:
  - `D` -> convert a solve to DNF after the solve has been stopped
  - `T` -> trash a solve either while the solve timer is running or after the
      solve timer has been stopped
  - `P` -> add a penalty of 2 seconds to the solve time
- Show statistics by appending the pushed times file alongwith the local solves
    file ([#44](https://github.com/icyflame/cli-cube-timer/issues/44))
- Reduce the passing around of global variables as function arguments inside
    `index.js` ( _WIP_ )
- Create a global constant `START_INSPECT` which dictates the starting line for
    all the other print operations
- Abstract out the tasks of writing a solve into a new function `acceptSolve` to
    be invoked once per solve
- Abstract out the tasks of ending the present session into a new function
    `end_session`
- `Ctrl + C` ends the session now. Earlier, it did something rather
    inexplicable: it paused the interface taking the input, leading to an
    unpleasant state where the user is unable to interact with the module and
    must simply close the terminal.

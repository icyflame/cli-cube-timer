# Test Schedule

> This terminal utility doesn't have a test suite yet.
>
> Until then, follow this testing schedule to ensure that releases don't have
> bugs

## Normal operation

### zero solves

```
solve
-> end session
```

### finite number of solves

```
solve
-> time 5 solves
-> end session
```

- stats should show 5 solves
- stats should show the correct best and worst times
- stats should show the correct AO5

### solve stats module checking

```
solve
-> time 2 solves
-> press S
-> time 2 more solves
-> end session
```

- stats should show 4 solves
- stats should show the correct best and worst times

## Solve Screen Keyboard Shortcuts

### trash

1. start a solve
2. start solve timer
3. press T
4. ensure that the solve was trashed

### DNF after solve

1. start a solve
2. start and end solve timer
3. press D
4. ensure that the solve was written as a DNF to the local file
5. ensure that the solve was added to the count but not to the solve stats

### Penalty after solve

1. start a solve
2. start and end solve timer
3. press P
4. ensure that 2 seconds was added to the solve time
5. ensure that the solve was added to the solve stats and the solves count

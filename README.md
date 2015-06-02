# Rubik's Cube Timer on the Command Line

> Time your solves, without leaving the terminal.

[![NPM](https://nodei.co/npm/cli-cube-timer.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cli-cube-timer/)

## Why?

I was tired of having to go to a browser, and even more tired of not getting to clear
my cookies now and then. And also, with living with the fear of the cookies getting cleared
accidentally, and me losing my whole solve history!

So, this is a hack around that. 

## Usage

### solve

> Primary command line executable name.

This will begin a solving session. All session statistics will be stored locally for this session.
Solve times are stored universally at `~/.cube/times.csv`.

### solve stats

> View your lifetime statistics

This will show you the mean, the standard deviation and the distribution of your solve times.
This part section is always open for improvement. The code for this is implemented using 
`fast-stats` and `fast-csv` node modules. So, this is one thing that you can always contribute to!

## Contributing

I would love to have your help on this! Do check out the issues dashboard of this repository,
and submit a PR on any one of those issues, and I will be happy to merge! If there are no issues
on the dashboard, please do feel free to create new ones!

Code licensed under MIT.

Copyright Siddharth Kannan 2015.

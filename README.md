# Rubik's Cube Timer on the Command Line

> Time your solves, without leaving the terminal.

[![Build Status](https://travis-ci.org/icyflame/cli-cube-timer.svg?branch=master)](https://travis-ci.org/icyflame/node-cube-cli-timer)

[![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/Flet/semistandard)

[![node-4-and-above](https://img.shields.io/badge/node.js-%3E%204.0-brightgreen.svg)](https://nodejs.org/en/download/)

Project page (for screenshots and explanation):
[cli-cube-timer](http://icyflame.github.io/cli-cube-timer/)

## Why?

I was tired of having to go to a browser, and even more tired of not getting to clear
my cookies now and then. And also, living with the fear of the cookies getting cleared
accidentally, and hence, losing my whole solve history!

So, this is my way around that.

You need a GitHub account to store your solves on a Gist.
(Create an account [here](http://github.com)).

## Usage

### `solve`

> Primary command line executable name.

This will begin a solving session. All session statistics will be stored locally for this session.

### `solve stats [--bucket n] [--min min] [--max max]`

> View your lifetime statistics

This will show you the mean, median, standard deviation and the distribution of your solve times.

The distribution is by default at a bucket size of 10 seconds. If you are an
advanced solver and need more resolution, just use the bucket option and use
`solve stats --bucket 2` to show your solves with a bucket size of 2 seconds
each. If you would like to see just a subset of all your solves, you can use the
`min` and `max` options. For eg: `solve stats --min 10 --max 20 --bucket 2` will
print the distribution of your solve times between 10 and 20 seconds at a bucket
sizeof 2 seconds.

### `solve push`

> Push all your solves to a gist

Ever wanted to take a backup? Well, do this, and everything stays backed up!
Psst, You can always add more data to your gist, from any other place that you may
have recorded solves previously, and this app will automatically account for that when
calculating stats using `solve stats`. Handy, huh?

### `solve login`

> One time GitHub authentication

This will make some API calls to GitHub's OAuth Authorizations API, and exchange your username and
password for an OAuth token, that it will store locally, **on your machine**. So, you don't have to enter
the username and password everytime you want to push, and the OAuth token stays safe.
**Psst,** you can delete and create a new OAuth token using this command at any time, just in case you think
there was a breach! (Everything will work exactly like before!)

### `solve --show gist`

> Print the URL where all your times are stored

This will print the URL to your gist, using your username and the gist ID that we have stored on
your machine.

### `solve --show local`

> Print the local path to the file in which local times are stored (before
> pushing to gist)

### `solve --file|--files`

> Show the path to the files where solve history is stored locally

This will print the local path to the csv files where the solve history is
stored. This is an advanced option and please do not open the file if you don't
have something specific to do with it.

## Contributing

I would love to have your help on this! Do check out the issues dashboard of this repository,
and submit a PR on any one of those issues, and I will be happy to merge! If there are no issues
on the dashboard, please do feel free to create new ones!

Code licensed under MIT.

Copyright Siddharth Kannan 2015.

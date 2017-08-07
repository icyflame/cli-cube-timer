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

### solve

> Primary command line executable name.

This will begin a solving session. All session statistics will be stored locally for this session.

### solve stats

> View your lifetime statistics

This will show you the mean, the standard deviation and the distribution of your solve times.
This part section is always open for improvement. The code for this is implemented using
`fast-stats` and `fast-csv` node modules. So, this is one thing that you can always contribute to!

### solve push

> Push all your solves to a gist

Ever wanted to take a backup? Well, do this, and everything stays backed up!
Psst, You can always add more data to your gist, from any other place that you may
have recorded solves previously, and this app will automatically account for that when
calculating stats using `solve stats`. Handy, huh?

### solve login

> One time GitHub authentication

This will make some API calls to GitHub's OAuth Authorizations API, and exchange your username and
password for an OAuth token, that it will store locally, **on your machine**. So, you don't have to enter
the username and password everytime you want to push, and the OAuth token stays safe.
**Psst,** you can delete and create a new OAuth token using this command at any time, just in case you think
there was a breach! (Everything will work exactly like before!)

### solve --show gist

> Print the URL where all your times are stored

This will print the URL to your gist, using your username and the gist ID that we have stored on
your machine.

## Contributing

I would love to have your help on this! Do check out the issues dashboard of this repository,
and submit a PR on any one of those issues, and I will be happy to merge! If there are no issues
on the dashboard, please do feel free to create new ones!

Code licensed under MIT.

Copyright Siddharth Kannan 2015.

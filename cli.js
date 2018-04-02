#! /usr/bin/env node
const stats = require('./index.js');
const { argv } = require('yargs');

// Assume path is final entry... that's not how this count command works tho
// const argIndex = argv._.length - 1;
// const path = argv._[argIndex]; // argv puts the final arguments in an array named "_"

if (argv.count) {
  stats.solidityCounts(argv.count);
}



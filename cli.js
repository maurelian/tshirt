#! /usr/bin/env node
const tshirt = require('./index.js');
const { argv } = require('yargs');

// const argIndex = argv._.length - 1;
// const path = argv._[argIndex]; // argv puts the final arguments in an array named "_"

if (argv.summary) {
  tshirt.writeSystemTable(argv.summary);
} else if (argv.each) {
  tshirt.generateFileSummary(argv.each);
} else if (argv.dash) {
  tshirt.generateDashboard(argv.dash);
}

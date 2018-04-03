const { getAllFiles, countLinesInFile } = require('./utils.js');
const { getFunctionsInContracts } = require('./parsing.js');
const { log } = require('./color.js');
// const asciiTable = require('ascii-table');

// Functions in this file should return assembled reports
// in an object or string format which can be printed by the
// cli tool, or used by another tool
module.exports.systemSummary = (contractsDir) => {
  // handles both a contract and a directory
  console.log('systemSummary', contractsDir);
};

module.exports.generateFileSummary = (contractsDir) => {
  // handles both a contract and a directory
  console.log('generateFileSummary', contractsDir);
};

module.exports.generateDashboard = (contractsDir) => {
  // handles both a contract and a directory
  console.log('generateDashboard', contractsDir);
};

module.exports.solidityCounts = async (dir) => {
  let files = getAllFiles(dir);
  files = files
    .filter(file => file.split('/').pop() !== 'Migrations.sol')
    .filter(file => file.split('.').pop() === 'sol');

  log.yellow('\n## File Counts: \n');
  if (files.length === 1) {
    console.log('There is 1 solidity file.');
  } else {
    console.log(`There are ${files.length} solidity files.`);
  }

  log.yellow('\n## Line Counts: \n');
  let totalLines = 0;
  files.forEach(async (file) => {
    const numLines = await countLinesInFile(file);
    console.log(`${file.split('/').pop()}: ${numLines} lines`);
    totalLines += numLines;
  });
  console.log('--------------------------');
  console.log(`Total: ${totalLines} lines`);

  log.yellow('\n## Function Counts: \n');

  files.forEach((file) => {
    log.yellow(`### Functions in ${file}:`);
    const funcArray = getFunctionsInContracts(file);
    funcArray.forEach((func) => {
      console.log(`Name: ${func.name}, Visibility: ${func.visibility}, Modifiers: ${func.modifiers}`);
    });
    console.log('--------------------------');
    console.log(`Total: ${funcArray.length} functions\n`);
  });
};


const { getAllFiles, countLinesInFile } = require('./utils.js');
const fs = require('fs');
// const asciiTable = require('ascii-table');

// * Counting Lines of Solidity Code:
// * Inspect ABI:
//   * how many functions are there?
//   * how many functions are state changing?
//   * how many functions are non-state changing?
// * Counting external calls:

async function solidityCounts(dir) {
  let files = getAllFiles(dir);
  console.log(files);
  files = files
    .filter(file => file.split('/').pop() !== 'Migrations.sol')
    .filter(file => file.split('.').pop() === 'sol');

  if (files.length === 1) {
    console.log('There 1 solidity file.');
  } else {
    console.log(`There are ${files.length} solidity files.`);
  }
  debugger;
  let totalLines;
  for (const file of files){
    let numLines = await countLinesInFile(file);
    console.log(file);
    console.log("index numLines", numLines);
    totalLines += numLines;
  };
  console.log(totalLines);
}


module.exports = {
  solidityCounts,
};

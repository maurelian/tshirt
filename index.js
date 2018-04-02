const { getAllFiles, countLinesInFile } = require('./utils.js');
const fs = require('fs');
// const asciiTable = require('ascii-table');

// Done: Counting Lines of Solidity Code
// How many solidity files? 
// How many final contracts?
// How many functions are there? 
//    Which are public/external?
//    Which are private/internal
//    Which are state changing, or constant?

async function solidityCounts(dir) {
  let files = getAllFiles(dir);
  files = files
    .filter(file => file.split('/').pop() !== 'Migrations.sol')
    .filter(file => file.split('.').pop() === 'sol');

  if (files.length === 1) {
    console.log('There is 1 solidity file.');
  } else {
    console.log(`There are ${files.length} solidity files.`);
  }
  debugger;
  let totalLines = 0;
  for (const file of files){
    let numLines = await countLinesInFile(file);
    console.log(`${file.split('/').pop()}: ${numLines} lines`);
    totalLines += numLines;
  };
  console.log(`Total: ${totalLines} lines`);
}


module.exports = {
  solidityCounts,
};

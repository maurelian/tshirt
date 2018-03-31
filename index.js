const { getAllFiles } = require('./utils.js');
const fs = require('fs');
// const asciiTable = require('ascii-table');

// * Counting Lines of Solidity Code:
// * Inspect ABI:
//   * how many functions are there?
//   * how many functions are state changing?
//   * how many functions are non-state changing?
// * Counting external calls:

function solidityCounts(dir) {
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

  let totalLines;
  files.forEach((file) => {
    fs.createReadStream(file).on('data', (chunk) => {
      // split the chunk into an array of lines.
      const numLines = chunk.toString('utf8').split(/\r\n|[\n\r\u0085\u2028\u2029]/g);
      totalLines += numLines;
      console.log(`${file} has ${lines.length - 1} lines.`);
    });
    // TODO: count the sum of all lines
  });
}

module.exports = {
  solidityCounts,
};

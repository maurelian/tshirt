const { getAllFiles, countLinesInFile } = require('./utils.js');
const { getFunctionsInContracts } = require('./parsing.js');
const { log } = require('./color.js');
// const asciiTable = require('ascii-table');

/*
  Functions in this file should return assembled reports
  in an object which can be re-formatted and printed by the
  cli tool, or used by another tool
*/

const System = class {
  constructor(files) {
    this.files = files;
  }


  fileCount() {
    return this.files.length;
  }

  // functionSummary() {
  //   const funcSummary = {

  //   }
  // }
};

/* Returns a system summary object, with the following schema:
 *
 * summary = {
 *    files: [
 *      { name: 'file1',
 *        functions: [{..}, ..., {...}],
 *        lineCount: 75,
 *      },
 *      {},
 *      ...
 *      {}
 *    ],
 *    fileCount: 5,
 *    derivedContracts: 2, // not yet sure how to determine this by parsing
 *    // lower priority
 *    functionSummary: {
 *      totalCount: 20,
 *      stateChanging: 11,
 *      constant: 9
 *    }
 *   }
 *
 * @param {string} contractsDir A directory with solidity files in it
 * @param {string} excludes Sub-directories to exclude from analysis
 * @param {array}  derived A list of which contracts will be derived and deployed in the final system.
 * 
 */
module.exports.systemSummary = (contractsDir, derived) => {
  // handles both a contract and a directory
  // console.log('systemSummary', contractsDir);
  let files = getAllFiles(contractsDir);
  files
    .filter(file => file.split('/').pop() !== 'Migrations.sol')
    .filter(file => file.split('.').pop() === 'sol');

  let summary = new Summary(files);

  summary.fileCount = files.length;
  // summary.derivedContractsCount = derived.length;

  // getFunctionsInContracts()

  return summary;
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


const { getAllFiles, countLinesInFile } = require('./utils.js');
const { getFunctionsInContract } = require('./parsing.js');
const { log } = require('./color.js');
const fs = require('fs');
const AsciiTable = require('ascii-table');

/**
 * The FileSummary class is contains data pertaining to a given file
 * * @param {string} path The path to a file.
 */
const FileSummary = class {
  constructor(path) {
    if (fs.statSync(path).isDirectory()) { throw new Error('expected a file, got a directory.'); }
    this.name = path;
    this.functions = getFunctionsInContract(path);
    this.lines = countLinesInFile(path);
  }

  // getter for aggregating numbers
  getFunctionCounts() {
    const totalCount = this.functions.length;
    let stateChangingFunctions = 0;
    let constantFunctions = 0;
    this.functions.forEach((func) => {
      if (['view', 'pure', 'constant'].indexOf(func.stateMutability) > -1) {
        constantFunctions += 1;
      } else {
        stateChangingFunctions += 1;
      }
    });
    return { totalCount, stateChangingFunctions, constantFunctions };
  }
};

/**
 * SystemSummary class contains data pertaining to all the contracts in a system
 * * @param {array} fileSummarysArray An array of FileSummary objects
 */
const SystemSummary = class {
  constructor(fileSummarysArray) {
    this.files = fileSummarysArray;
    this.fileCount = fileSummarysArray.length;
  };

  getFunctionCounts() {
    // create a summary of function data
    const functionCounts = {
      totalCount: 0,
      stateChangingFunctions: 0,
      constantFunctions: 0,
    };

    this.files.forEach((file) => {
      const { totalCount, stateChangingFunctions, constantFunctions }
        = file.getFunctionCounts();
      functionCounts.totalCount += totalCount;
      functionCounts.stateChangingFunctions += stateChangingFunctions;
      functionCounts.constantFunctions += constantFunctions;
    });
    return functionCounts;
  }
};

/* Returns a system summary object
 *
 * @param {string} contractsDir A directory with solidity files in it
 * @param {string} excludes Sub-directories to exclude from analysis
 * @param {array}  TODO: derived A list of which contracts will be derived and
 *                         deployed in the final system.
 *
 */
const generateSystemSummary = (contractsDir) => {
  const files = getAllFiles(contractsDir)
    .filter(fileName => fileName.split('/').pop() !== 'Migrations.sol')
    .filter(fileName => fileName.split('.').pop() === 'sol');

  const fileSummaryArray = [];
  files.forEach((fileName) => {
    const fileSummary = new FileSummary(fileName);
    fileSummaryArray.push(fileSummary);
  });

  return new SystemSummary(fileSummaryArray);
};

/**
 * Generates a summary for a file, or array of files
 * @param  {string} contractsDir The path to a file or directory
 * @return {array}  An array with an object for each file
 */
const generateFileSummary = (path) => {
  // handles both a contract and a directory
  const dirStats = fs.statSync(path);
  const summaries = [];
  if (!dirStats.isDirectory()) {
    // it's actually just a files
    summaries.push(new FileSummary(path));
  } else {
    const files = getAllFiles(path)
      .filter(fileName => fileName.split('/').pop() !== 'Migrations.sol')
      .filter(fileName => fileName.split('.').pop() === 'sol');

    files.forEach((file) => {
      summaries.push(new FileSummary(file));
    });
  }
  return summaries;
  // console.log('generateFileSummary', contractsDir);
};

// const writeFileTable = (path) => {
//   const summary = generateFileSummary(path);

//   const table = new AsciiTable();
//   table
// };


const generateDashboard = (contractsDir) => {
  // handles both a contract and a directory
  console.log('generateDashboard', contractsDir);
};


module.exports = {
  generateSystemSummary,
  generateFileSummary,
  writeFileTable,
  generateDashboard,
};

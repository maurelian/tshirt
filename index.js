const { getAllFiles, countLinesInFile, rowOfDashes} = require('./utils.js');
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
    this.path = path;
    this.name = path.split('/').pop();
    this.functions = getFunctionsInContract(path);
  }

  // getter for aggregating numbers
  get functionCounts() {
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
  constructor(path) {
    const solFiles = getSolidityFiles(path);
    this.files = []; // an array of FileSummary objects
    solFiles.forEach((solFile) => this.files.push(new FileSummary(solFile)));
    this.fileCount = this.files.length;
  };

  get functionCounts() {
    // create a summary of function data
    let totalCount = 0;
    let stateChangingFunctions = 0;
    let constantFunctions = 0;

    this.files.forEach((file) => {
      const functionCounts = file.functionCounts;
      totalCount += functionCounts.totalCount;
      stateChangingFunctions += functionCounts.stateChangingFunctions;
      constantFunctions += functionCounts.constantFunctions;
    });
    return { totalCount, stateChangingFunctions, constantFunctions };
  }
};


/**
 * Generates a summary for a file, or array of files
 * @param  {string} contractsDir The path to a file or directory
 * @return {array}  An array with a list of solidity files
 */
const getSolidityFiles = (path) => {
  // handles both a contract and a directory
  let files;
  const dirStats = fs.statSync(path);
  if (!dirStats.isDirectory()) {
    // it's actually just a file
    files = [path];
  } else {
    files = getAllFiles(path)
      .filter(fileName => fileName.split('/').pop() !== 'Migrations.sol')
      .filter(fileName => fileName.split('.').pop() === 'sol');
  }
  return files;
};

/**
 *
 * @param  {string} path [description]
 * @return {[type]}      [description]
 */
const writeSystemTable = (path) => {
  const system = new SystemSummary(path);

  const table = new AsciiTable();
  table.setHeading(
    ['File Name', 'Path', 'Functions', 'State Changing', 'Constant']
  );

  // write the row values for each file
  system.files.forEach((file) => {
    const counts = file.functionCounts;
    table.addRow([file.name, file.path, counts.totalCount, counts.stateChangingFunctions,
        counts.constantFunctions]);
  });

  // add another dashed line, followed by the totals
  table.toString(); // the __colMaxes data we need isn't populated until this is called.
  const dashes = rowOfDashes(table.__colMaxes);
  table.addRow(dashes);

  const {totalCount, stateChangingFunctions, constantFunctions} = system.functionCounts;
  table.addRow(
    ['Totals', `${system.fileCount} files`, totalCount, stateChangingFunctions, constantFunctions]
  );

  // Format the table to place numerical values in the center
  [2,3,4].forEach((column) => table.setAlign(column, AsciiTable.CENTER));
  console.log(table.toString());
};



module.exports = {
  // generateFileSummary,
  FileSummary,
  SystemSummary,
  writeSystemTable,
};

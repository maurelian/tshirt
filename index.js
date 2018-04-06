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
    this.name = path.split('/').pop();
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

  getLineCount() {
    let numlines = 0;
    this.files.forEach((file) => {
      numlines += file.lines;
      console.log(file.lines);
    });
    return numlines;
  }

  getFunctionCounts() {
    // create a summary of function data
    let totalCount = 0;
    let stateChangingFunctions = 0;
    let constantFunctions = 0;

    this.files.forEach((file) => {
      const functionCounts = file.getFunctionCounts();
      totalCount += functionCounts.totalCount;
      stateChangingFunctions += functionCounts.stateChangingFunctions;
      constantFunctions += functionCounts.constantFunctions;
    });
    return { totalCount, stateChangingFunctions, constantFunctions };
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

const rowOfDashes = (lengths) => {
  let row = [];
  lengths.forEach((length) => {
    let line = '';
    for (let i=0; i < length; i++) {
      line += '-';
    }
    row.push(line);
  });
  return row;
};

/**
 *
 * @param  {[type]} path [description]
 * @return {[type]}      [description]
 */
const writeSystemTable = (path) => {
  const system = generateSystemSummary(path);

  const table = new AsciiTable();
  table.setHeading('File Name', 'Functions', 'State Changing', 'Constant', 'Lines');

  // write the row for each file
  system.files.forEach((file) => {
    const counts = file.getFunctionCounts();
    table.addRow(file.name, counts.totalCount, counts.stateChangingFunctions,
      counts.constantFunctions, file.lines);
  });

  // add another dashed line, followed by the totals
  table.toString(); // the __colMaxes data we need isn't populated until this is called.
  const dashes = rowOfDashes(table.__colMaxes);
  table.addRow(dashes);

  const totals = system.getFunctionCounts();
  table.addRow('Totals', totals.totalCount, totals.stateChangingFunctions,
    totals.constantFunctions, system.getLineCount());

  console.log(table.toString());
};


const generateDashboard = (contractsDir) => {
  // handles both a contract and a directory
  console.log('generateDashboard', contractsDir);
};


module.exports = {
  generateSystemSummary,
  generateFileSummary,
  writeSystemTable,
  generateDashboard,
};

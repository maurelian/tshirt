const fs = require('fs');

/**
 * Returns an array of relative paths to files
 */
function getAllFiles(dir) {
  let results = [];

  fs.readdirSync(dir).forEach((file) => {
    const filename = `${dir}/${file}`;
    const stat = fs.statSync(filename);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filename));
    } else results.push(filename);
  });

  return results;
}

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

function countLinesInFile(fileName) {
  return new Promise((resolve, reject) => {
    let numLines;
    fs.createReadStream(fileName).on('data', (chunk) => {
      // split the chunk into an array of lines.
      const lines = chunk.toString('utf8').split(/\r\n|[\n\r\u0085\u2028\u2029]/g);
      numLines = lines.length - 1;
      resolve(numLines);
    }).on('end', (result) => {
      console.log('stream ended');
      resolve(result);
    }).on('error', (err) => {
      reject(err);
    });
  });
}

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



module.exports = {
  getAllFiles,
  getSolidityFiles,
  countLinesInFile,
  rowOfDashes,
};

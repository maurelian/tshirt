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
  countLinesInFile,
  rowOfDashes,
};

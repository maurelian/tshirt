const fs = require('fs');
const parser = require("solidity-parser-antlr");

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

function countLinesInFile(file){
  return new Promise((resolve, reject) => {
    debugger;
    let numLines;
    fs.createReadStream(file).on('data', (chunk) => {
        // split the chunk into an array of lines.
        const lines = chunk.toString('utf8').split(/\r\n|[\n\r\u0085\u2028\u2029]/g);
        numLines = lines.length-1;
        resolve(numLines);
      })
      .on('error', err => reject(err))
  });
};


module.exports = {
  getAllFiles,
  countLinesInFile
};

const fs = require('fs');

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
  new Promise((resolve, reject) => {
    debugger;
    let numLines;
    fs.createReadStream(file).on('data', (chunk) => {
        // split the chunk into an array of lines.
        const lines = chunk.toString('utf8').split(/\r\n|[\n\r\u0085\u2028\u2029]/g);
        console.log(`${file} has ${lines.length - 1} lines.`);
        numLines = lines.length-1;
        resolve("numLines", numLines);
      })
      .on('error', err => reject(err))
      // .on('end', () => resolve("some lines", numLines));
  });
};


module.exports = {
  getAllFiles,
  countLinesInFile
};

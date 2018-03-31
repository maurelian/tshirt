const filesystem = require('fs');

function getAllFiles(dir) {
  let results = [];

  filesystem.readdirSync(dir).forEach((file) => {
    const filename = `${dir}/${file}`;
    const stat = filesystem.statSync(filename);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filename));
    } else results.push(filename);
  });

  return results;
}

module.exports = {
  getAllFiles,
};

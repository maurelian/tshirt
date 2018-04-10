const tshirt = require('../index.js');

const assert = require('assert');

describe('tshirt.generateSystemSummary', () => {
  it('generates a valid data object for a contract system', () => {
    const summary = new tshirt.SystemSummary('./test/contracts');
    assert(typeof summary === 'object', 'Summary is not an object');
    assert(summary.files instanceof Array);
  });

  it('includes an array listing the files and their functions in the system', () => {
    const summary = new tshirt.SystemSummary('./test/contracts');
    assert(summary.files[0].functions instanceof Array);

    const functionObject = summary.files[0].functions[0];
    assert(Object.keys(functionObject).indexOf('parameters') > -1);
    assert(Object.keys(functionObject).indexOf('name') > -1);
    assert(summary.files.length === 3);
  });

  it('excludes Migrations.sol, and files not ending in .sol', () => {
    const summary = new tshirt.SystemSummary('./test/contracts');
    summary.files.forEach((file) => {
      assert(file.name.split('/').pop() !== 'Migrations.sol');
      assert(file.name.split('.').pop() === 'sol');
    });
  });

  it('Provides a count of functions, and mutability in the system', () => {
    const counts = new tshirt.SystemSummary('./test/contracts').functionCounts;
    assert(counts.totalCount > 0);
    assert(counts.stateChangingFunctions > 0);
    assert(counts.constantFunctions > 0);
    assert(counts.totalCount === counts.stateChangingFunctions + counts.constantFunctions);
  });
});

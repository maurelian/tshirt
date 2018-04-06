const tshirt = require('../index.js');

const assert = require('assert');

describe('tshirt.generateFileSummary()', () => {
  it('generates an array with one object for a file', () => {
    const summary = tshirt.generateFileSummary('./test/contracts/eip20/EIP20.sol');
    assert(summary instanceof Array);
    assert(summary.length === 1);
  });

  it('generates an array with the correct number of objects for a directory', () => {
    const summary = tshirt.generateFileSummary('./test/contracts/eip20');
    assert(summary instanceof Array);
    assert(summary.length === 3);
  });

  it('describes functions in each file', () => {
    const summary = tshirt.generateFileSummary('./test/contracts');
    const functionObject = summary[0].functions[0];
    assert(Object.keys(functionObject).indexOf('parameters') > -1);
    assert(Object.keys(functionObject).indexOf('name') > -1);
    assert(summary.length === 3);
  });

  it('excludes Migrations.sol, and files not ending in .sol', () => {
    const summary = tshirt.generateFileSummary('./test/contracts');
    summary.forEach((file) => {
      assert(file.name.split('/').pop() !== 'Migrations.sol');
      assert(file.name.split('.').pop() === 'sol');
    });
    console.log(summary)
  });

  it('Provides a count of functions, and mutability', () => {
    const counts = tshirt
      .generateFileSummary('./test/contracts/eip20/EIP20.sol')[0]
      .getFunctionCounts();
    assert(counts.totalCount > 0);
    assert(counts.stateChangingFunctions > 0);
    assert(counts.constantFunctions > 0);
    assert(counts.totalCount === counts.stateChangingFunctions + counts.constantFunctions);
  });
});

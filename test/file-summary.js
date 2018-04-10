const tshirt = require('../index.js');

const assert = require('assert');

describe('tshirt.FileSummary', () => {
  it('generates an Object with properties describing the file', () => {
    const summary = new tshirt.FileSummary('./test/contracts/eip20/EIP20.sol');
    assert.strictEqual(summary.path, './test/contracts/eip20/EIP20.sol');
    assert.strictEqual(summary.name, 'EIP20.sol');
    assert(summary.functions instanceof Array);
  });

  it('describes functions in the file', () => {
    const summary = new tshirt.FileSummary('./test/contracts/eip20/EIP20.sol');
    const functionObject = summary.functions[0];
    assert(Object.keys(functionObject).indexOf('parameters') > -1);
    assert(Object.keys(functionObject).indexOf('name') > -1);
    assert.strictEqual(summary.functions.length, 6);
  });

  it('Provides a count of functions, and mutability', () => {
    const counts = new tshirt
      .FileSummary('./test/contracts/eip20/EIP20.sol')
      .functionCounts;
    assert(counts.totalCount > 0);
    assert(counts.stateChangingFunctions > 0);
    assert(counts.constantFunctions > 0);
    assert(counts.totalCount === counts.stateChangingFunctions + counts.constantFunctions);
  });
});

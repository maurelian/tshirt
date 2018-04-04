const tshirt = require('../index.js');

const assert = require('assert');
const fs = require('fs');


describe('tshirt', function() {
  it('generates a valid data object for a contract system', () => {
    const summary = tshirt.systemSummary('./test/contracts');
    assert(typeof summary === 'object', 'Summary is not an object');
    assert(summary.files instanceof Array);
    console.log(summary);
  });

  it('includes a sumarry describing the functions in the system', () => {

  });
});
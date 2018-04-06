const fs = require('fs');
const parser = require('solidity-parser-antlr');


/**
 * Takes a file path
 * Returns an array of functions
 */
function getFunctionsInContract(fileName) {
  const input1 = fs.readFileSync(fileName).toString();
  const ast = parser.parse(input1.toString());

  const funcArray = [];

  try {
    // Gets all the functions!
    parser.visit(ast, {
      FunctionDefinition(node) {
        funcArray.push(node);
      },
    });
  } catch (e) {
    if (e instanceof parser.ParserError) {
      console.log('Parser error:', e.errors);
    } else {
      throw e;
    }
  }
  return funcArray;
}

// console.log(getFunctionsInContract('./test/contracts/eip20/EIP20.sol'));

module.exports = {
  getFunctionsInContract,
};

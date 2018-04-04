const fs = require('fs');
const parser = require('solidity-parser-antlr');


/**
 * Takes a file path
 * Returns an array of functions
 */
function getFunctionsInContract(file) {
  const input1 = fs.readFileSync(file).toString();
  const ast = parser.parse(input1.toString());

  const functionsArray = [];

  try {
    // Gets all the functions!
    parser.visit(ast, {
      FunctionDefinition(node) {
        functionsArray.push(node);
      },
    });
  } catch (e) {
    if (e instanceof parser.ParserError) {
      console.log('Parser error:', e.errors);
    } else {
      throw e;
    }
  }
  return functionsArray;
}

// console.log(getFunctionsInContracts('./test/contracts/eip20/EIP20.sol'));

module.exports = {
  getFunctionsInContract,
};

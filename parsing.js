const fs = require('fs');
const parser = require("solidity-parser-antlr");


function getFunctionsInContracts(file){
  const input1 = fs.readFileSync(file).toString();
  const ast = parser.parse(input1.toString());

  try {
    // Gets all the functions!
    parser.visit(ast, {
      FunctionDefinition: function(node) {
        console.log("node:", node);
        console.log("body:", node.body);
      }
      });
  } catch (e) {
    if (e instanceof parser.ParserError) {
      console.log("Parser error:", e.errors)
    } else {
      throw e;
    }
  }
};

getFunctionsInContracts('./test/contracts/eip20/EIP20.sol');

const chalk = require('chalk');

module.exports.log = {
  green(words) {
    return console.log(chalk.green(words));
  },
  yellow(words) {
    return console.log(chalk.yellow(words));
  },
  red(words) {
    return console.log(chalk.red(words));
  },
};

const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const yargs = require("yargs");
const command = yargs.argv._;

const { getRegionDetails } = require("./utils/region");
debugger;
clear();
// Create Title
console.log(
  chalk.greenBright(
    figlet.textSync("Weather News CLI", { horizontalLayout: "full" })
  )
);
console.log(chalk.yellow("\n\tAn Simple CLI for Weather News "));

if (command) {
  getRegionDetails.then(d => console.log(d)).catch(err => console.log(err));
}

yargs.parse();

const clear = require("clear");
const chalk = require("chalk");
const figlet = require("figlet");
const yargs = require("yargs");
const command = yargs.argv._;

const { getDetails } = require("./utils");
clear();
// Create Title
console.log(
  chalk.greenBright(
    figlet.textSync("Weather News CLI", { horizontalLayout: "full" })
  )
);
console.log(chalk.yellow("\n\tAn Simple CLI for Weather News "));
const city = command && String(command[0]).trim();
getDetails(city);
yargs.parse();

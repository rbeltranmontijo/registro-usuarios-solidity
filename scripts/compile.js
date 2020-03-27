const path = require("path");
const fs = require("fs");
const solc = require("solc");
const chalk = require("chalk");

// Carga el archivo a contractPath
const contractPath = path.resolve(
  __dirname,
  "../contracts",
  "UsersContract.sol"
);

// Lee el codigo fuente
const source = fs.readFileSync(contractPath, "utf8");

module.exports = solc.compile(source, 1).contracts[":UsersContract"];

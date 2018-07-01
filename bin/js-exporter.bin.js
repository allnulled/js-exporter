#! /usr/bin/env node

const { UniversalExporter } = require(__dirname + "/../src/universal-exporter.js");

const args = require("yargs")
  .version("1.0.0")
  .option("input", {
    type: "string",
    alias: "i",
    describe: "Set a file as input.",
    help: "help"
  })
  .option("output", {
    type: "string",
    alias: "o",
    describe: "Set a file as output.",
    help: "help"
  })
  .demandOption(["input", "output"], "Please, provide --input (or -i) and output (or -o) parameters.")
  .argv;

UniversalExporter.exportFile(args.input, args.output);
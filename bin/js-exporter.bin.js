#! /usr/bin/env node

const { JsExporter } = require(__dirname + "/../src/js-exporter.js");

const args = require("yargs")
  .version("1.0.1")
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

JsExporter.exportFile(args.input, args.output);
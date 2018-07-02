const { assert, expect } = require("chai");
const fs = require("fs");
const rimraf = require("rimraf");

describe("JsExporter API", function() {

  const { JsExporter } = require(__dirname + "/../src/js-exporter.js");
  const example1src = __dirname + "/example-1.js";
  const example2src = __dirname + "/example-2.js";
  const example3src = __dirname + "/example-3.js";
  const example4src = __dirname + "/example-4.js";
  const example5src = __dirname + "/example-5.js";
  const example6src = __dirname + "/example-6.js";
  const example7src = __dirname + "/example-7.js";
  const example8src = __dirname + "/example-8.js";
  const example1dst = __dirname + "/example-1.universal.js";
  const example2dst = __dirname + "/example-2.universal.js";
  const example3dst = __dirname + "/example-3.universal.js";
  const example4dst = __dirname + "/example-4.universal.js";
  const example5dst = __dirname + "/example-5.universal.js";
  const example6dst = __dirname + "/example-6.universal.js";
  const example7dst = __dirname + "/example-7.universal.js";
  const example8dst = __dirname + "/example-8.universal.js";

  before(function() {
    rimraf.sync(__dirname + "/*.universal.js");
  });

  after(function() {
    //
  });

  it("can wrap simple (string) codes programmatically", function(done) {
    var code = fs.readFileSync(__dirname + "/example-1.js").toString();
    var code2 = JsExporter.exportCode(code);
    expect(typeof code2).to.equal("string");
    expect(code.length < code2.length).to.equal(true);
    fs.writeFileSync(example1dst, code2, "utf8");
    expect(require(example1dst)).to.equal(500);
    done();
  });

  it("can wrap simple (source) code programmatically and dump the result into another file", function(done) {
    expect(fs.existsSync(example2dst)).to.equal(false);
    JsExporter.exportFile(example2src, example2dst);
    expect(fs.existsSync(example2dst)).to.equal(true);
    expect(require(example2dst)).to.equal(450);
    done();
  });

  it("throws error when regular expression 1 (// >> export module to $variable) is not found", function(done) {
    expect(() => JsExporter.exportFile(example3src)).to.throw();
    done();
  });

  it("throws error when regular expression 2 (// >> export module\\nmodule.exports = ...) is not found", function(done) {
    expect(() => JsExporter.exportFile(example4src)).to.throw();
    done();
  });

  it("can use default options for minification", function(done) {
    const srcCode = fs.readFileSync(example5src).toString();
    const dstCode = JsExporter.getMetadataFromCode(srcCode);
    fs.writeFileSync(example5dst, dstCode, "utf8");
    expect(require(example5dst)).to.equal(600);
    done();
  });

  it("can customize tokens", function(done) {
    const srcCode = fs.readFileSync(example6src).toString();
    const dstCode = JsExporter.getMetadataFromCode(
      srcCode, {},
      "(^|\n)[\t\r\n ]*\/\/ *\>\> *export +this +module +to: +([a-zA-Z$_][a-zA-Z0-9$_]*) *(\n|$)",
      2,
      "(^|\n)[\t\r\n ]*\/\/ *\>\> *export +this +module:[\t\r\n ]+module\.exports *= *");
    fs.writeFileSync(example6dst, dstCode, "utf8");
    expect(require(example6dst)).to.equal(700);
    done();
  });

  it("throws error when source code can not be minified/beautified", function(done) {
    expect(() => JsExporter.exportFile(example7src)).to.throw();
    done();
  });

  it("throws when tokens are customized but name of module is not found", function(done) {
    const srcCode = fs.readFileSync(example8src).toString();
    expect(() => {
      const dstCode = JsExporter.getMetadataFromCode(
        srcCode, {},
        "(^|\n)[\t\r\n ]*\/\/ *\>\> *export +this +module +to: +([a-zA-Z$_][a-zA-Z0-9$_]*) *(\n|$)",
        6,
        "(^|\n)[\t\r\n ]*\/\/ *\>\> *export +this +module:[\t\r\n ]+module\.exports *= *");
    }).to.throw();
    done();
  });

});
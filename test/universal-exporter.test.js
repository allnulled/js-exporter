const { assert, expect } = require("chai");
const fs = require("fs");

describe("JsExporter API", function() {

  const { UniversalExporter } = require(__dirname + "/../src/js-exporter.js");
  const example1src = __dirname + "/example-1.js";
  const example2src = __dirname + "/example-2.js";
  const example3src = __dirname + "/example-3.js";
  const example4src = __dirname + "/example-4.js";
  const example1dst = __dirname + "/example-1.universal.js";
  const example2dst = __dirname + "/example-2.universal.js";

  before(function() {
	  if(fs.existsSync(example1dst)) {
	    fs.unlinkSync(example1dst);
	  }
  	if(fs.existsSync(example2dst)) {
	    fs.unlinkSync(example2dst);
	  }
  });

  after(function() {
	  if(fs.existsSync(example1dst)) {
	    // fs.unlinkSync(example1dst);
	  }
  	if(fs.existsSync(example2dst)) {
	    // fs.unlinkSync(example2dst);
	  }
  });

  it("can wrap simple (string) codes programmatically", function(done) {
    var code = fs.readFileSync(__dirname + "/example-1.js").toString();
    var code2 = UniversalExporter.exportCode(code);
    expect(typeof code2).to.equal("string");
    expect(code.length < code2.length).to.equal(true);
    fs.writeFileSync(example1dst, code2, "utf8");
    expect(require(example1dst)).to.equal(500);
    done();
  });

  it("can wrap simple (source) code programmatically and dump the result into another file", function(done) {
    expect(fs.existsSync(example2dst)).to.equal(false);
    UniversalExporter.exportFile(example2src, example2dst);
    expect(fs.existsSync(example2dst)).to.equal(true);
    expect(require(example2dst)).to.equal(450);
    done();
  });

  it("throws error when regular expression 1 (// >> export module to $variable) is not found", function(done) {
  	expect(() => UniversalExporter.exportFile(example3src)).to.throw();
  	done();
  });

  it("throws error when regular expression 2 (// >> export module\\nmodule.exports = ...) is not found", function(done) {
  	expect(() => UniversalExporter.exportFile(example4src)).to.throw();
  	done();
  });

});
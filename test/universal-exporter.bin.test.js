const { assert, expect } = require("chai");
const fs = require("fs");
const exec = require("execute-command-sync");
const { ConsoleManager } = require("function-wrapper");

describe("JsExporter CLI", function() {

  const example1src = __dirname + "/example-1.js";
  const example2src = __dirname + "/example-2.js";
  const example3src = __dirname + "/example-3.js";
  const example4src = __dirname + "/example-4.js";
  const example1dst = __dirname + "/example-1.universal.js";
  const example2dst = __dirname + "/example-2.universal.js";
  const example3dst = __dirname + "/example-3.universal.js";
  const example4dst = __dirname + "/example-4.universal.js";

  before(function() {
    if (fs.existsSync(example1dst)) {
      fs.unlinkSync(example1dst);
    }
    if (fs.existsSync(example2dst)) {
      fs.unlinkSync(example2dst);
    }
  });

  after(function() {
    if (fs.existsSync(example1dst)) {
      fs.unlinkSync(example1dst);
    }
    if (fs.existsSync(example2dst)) {
      fs.unlinkSync(example2dst);
    }
  });

  it("can export files correctly", function(done) {
    expect(fs.existsSync(example1dst)).to.equal(false);
    exec(`js-export -i ${JSON.stringify(example1src)} -o ${JSON.stringify(example1dst)}`);
    expect(fs.existsSync(example1dst)).to.equal(true);
    expect(require(example1dst)).to.equal(500);
    expect(fs.existsSync(example2dst)).to.equal(false);
    exec(`js-export -i ${JSON.stringify(example2src)} -o ${JSON.stringify(example2dst)}`);
    expect(fs.existsSync(example2dst)).to.equal(true);
    expect(require(example2dst)).to.equal(450);
    done();
  });

  it("throws when the files do not have the required comments", function(done) {
    expect(() => {
      exec(`js-export -i ${JSON.stringify(example3src)} -o ${JSON.stringify(example3dst)}`, {
        stdio: [
          process.stdin,
          process.stdout,
          null
        ]
      });
    }).to.throw();
    expect(() => {
      exec(`js-export -i ${JSON.stringify(example4src)} -o ${JSON.stringify(example4dst)}`, {
        stdio: [
          process.stdin,
          process.stdout,
          null
        ]
      });
    }).to.throw();
    done();
  });

});
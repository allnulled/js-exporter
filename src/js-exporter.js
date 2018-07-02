/**
 * # js-exporter
 * 
 * ![](https://img.shields.io/badge/js--exporter-v1.0.0-green.svg) ![](https://img.shields.io/badge/tests-passing-green.svg) ![](https://img.shields.io/badge/coverage-100%25-green.svg)
 * 
 * Module that wraps ES6 code for it to work in browsers, Node.js or AMD, from CLI or programmatically.
 * 
 * ## 1. Installation
 * 
 * ~$ `npm installation --save-dev js-exporter`
 * 
 * ## 2. Preparation
 * 
 * ### 2.1. Things to know
 * 
 * 1. This module is prepared only to work **per file**: a module can only be contained in 1 file.
 * 
 * 2. This module expects that you write the `Node.js` version of the module, and it will adapt the
 * source code to make it work also in AMD and browsers.
 * 
 * 3. This module expects that you use the `module.exports` expression to export your module.
 * 
 * 4. This module expects that you use the `module.exports` expression at the end of the file. This 
 * is because, under the hood, the `module.exports` will be transformed into a `return` expression.
 * 
 * ### 2.2. Required comments of the file
 * 
 * There are 2 comments required for this module to work against a JS file.
 * 
 * #### Comment 1: define exportation variable
 * 
 * This comment tells the `js-exporter` the name of the variable to export the file to.
 * 
 * This is required for browser environments.
 * 
 * ```js
 * // >> export module to $variable
 * ```
 * 
 * This will make the browsers to export the module into `$variable` variable.
 * 
 * #### Comment 2: define the module to export
 * 
 * ```js
 * // >> export module
 * module.exports = { YourModuleData };
 * ```
 * 
 * This will be translated into a `return` statement, so be careful and put this part of the 
 * code at the end of the file.
 * 
 * ## 3. Usage
 * 
 * ### 3.1. API usage
 * 
 * #### 3.1.a) Export a file:
 * 
 * ```js
 * const { JsExporter } = require("js-exporter");
 *
 * const code = JsExporter.exportFile("my-source.js", "my-source.universal.js", {});
 * 
 * // Now you can import the generated module:
 * require("./my-source.universal.js");
 * ```
 * 
 * #### 3.1.b) Export a text:
 * 
 * ```js
 * const { JsExporter } = require("js-exporter");
 * 
 * const codeInput = require("fs").readFileSync("my-source.js").toString();
 * 
 * const code = JsExporter.exportCode(codeInput, {});
 * 
 * // Now you can import the generated module:
 * require("./my-source.universal.js");
 * ```
 * 
 * ### 3.2. Command-Line Interface usage
 * 
 * ~$ `./node_modules/.bin/js-universal-export -i my-source.js -o my-source.universal.js`
 * 
 * Or, if you install the module globally:
 * 
 * ~$ `js-export -i my-source.js -o my-source.universal.js`
 * 
 * ## 4. API reference
 * 
 * 
 */
const fs = require("fs");
const uglify = require("uglify-es");

/**
 * ----
 * 
 * #### **`JsExporter = require("js-exporter").JsExporter`**
 * 
 * @type `{Class}`
 * @description This class contains the whole API of this module. Right now, it is not instantiable.
 * 
 */
class JsExporter {
  /**
   * 
   * ----
   * 
   * #### **`JsExporter.exportCode(code:String, options:Object)`**
   * 
   * @type `{Static method}`
   * @parameter `{String} code`. **Required**. The code to be universally exported to browsers, AMD and Node.js.
   * @parameter `{Object} options`. **Optional**. The options to be passed to [UglifyES](https://github.com/mishoo/UglifyJS2). 
   * By default, the options passed to UglifyJS will be:
   * 
   * ```js
   * {
   *   compress: false,
   *   output: {
   *     beautify: true
   *   } 
   * }
   * ```
   * 
   * @return `{String} codeExported`. The code once wrapped and beautified.
   * @description This method wraps the provided code for it to work in browsers, in AMD systems or Node.js, and then it 
   * is beautified with [UglifyES](https://github.com/mishoo/UglifyJS2) with the options provided.
   * 
   */
  static exportCode(code, options = {}) {
    return JsExporter.getMetadataFromCode(code, options);
  }
  /**
   * 
   * ----
   * 
   * #### **`JsExporter.exportFile(srcFile:String, dstFile:String, options:Object)`**
   * 
   * @type `{Static method}`
   * @parameter `{String} srcFile`. **Required**. File to be exported.
   * @parameter `{String} dstFile`. **Required**. File to which dump the exportation into.
   * @parameter `{Object} options`. **Optional**. The options to be passed to [UglifyES](https://github.com/mishoo/UglifyJS2).
   * @return `{String} codeExported`. The code once wrapped and beautified.
   * @description This method does the same as the `JsExporter.exportCode(code:String, options:Object)`,
   * but it automatically reads and writes the implied files. It returns the code exported too.
   * 
   */
  static exportFile(srcFile, dstFile, options = {}) {
    const srcCode = fs.readFileSync(srcFile).toString();
    const dstCode = JsExporter.exportCode(srcCode, options);
    fs.writeFileSync(dstFile, dstCode, "utf8");
    return dstCode;
  }
  /**
   * 
   * ----
   * 
   * #### **`JsExporter.getMetadataFromCode(code:String, optionsBeautification:Object, token1:String, token1group1:Number, token2:String)`**
   * 
   * @type `{Static method}`
   * @parameter `{String} code`. **Required**.
   * @parameter `{Object} optionsBeautification`. **Optional**. The options to be passed to [UglifyES](https://github.com/mishoo/UglifyJS2). By default: `{}`.
   * @parameter `{String} token1`. **Optional**. The text of the regular expression that defines the name of the exported module for the browsers. By default: `"(^|\n)[\t\r\n ]*\/\/ *\>\> *export +module +to +([a-zA-Z$_][a-zA-Z0-9$_]*) *(\n|$)"`.
   * @parameter `{Number} token1group1`. **Optional**. The number of the group, from the previous regular expression match, that contains the name of the exported module. By default: `2`.
   * @parameter `{String} token2`. **Optional**. The text of the regular expression that precedes the data exported by the module. By default: `"(^|\n)[\t\r\n ]*\/\/ *\>\> *export +module[\t\r\n ]+module\.exports *= *"`.
   * @return `{String} codeExported`. The code once wrapped and beautified.
   * @description This method is an internal feature, but the developer can use it too. It specifies the parameters of
   * the exportation, and obtains the exported code. The other methods call to this method under the hood. Using this method, 
   * one can customize the tokens that define both, the **name of the module** (used as global variable in browsers) and the **data of the module**.
   * 
   */
  static getMetadataFromCode(
    code,
    optionsBeautification = {},
    token1 = "(^|\n)[\t\r\n ]*\/\/ *\>\> *export +module +to +([a-zA-Z$_][a-zA-Z0-9$_]*) *(\n|$)",
    token1group1 = 2,
    token2 = "(^|\n)[\t\r\n ]*\/\/ *\>\> *export +module[\t\r\n ]+module\.exports *= *"
  ) {
    var regex1 = new RegExp(token1, "g");
    var regex2 = new RegExp(token2, "g");
    var inputVars = regex1.exec(code);
    // @DONE: check that the interesting groups are found
    if (inputVars === null) {
      throw {
        name: "JsExporter:MetadataMatchingError",
        message: "[js-exporter] Error trying to match metadata regular expression 1 (// >> export module to $VARIABLE): " + JSON.stringify(token1)
      };
    }
    if (!(token1group1 in inputVars)) {
      throw {
        name: "JsExporter:MetadataExtractionError",
        message: "[js-exporter] Error extracting metadata: group " + token1group1 + " was not found."
      };
    }
    if(!regex2.test(code)) {
    	throw {
        name: "JsExporter:MetadataMatchingError",
        message: "[js-exporter] Error trying to match metadata regular expression 2: " + JSON.stringify(token2)
      };
    }
    var exportTo = inputVars[token1group1];
    // @DONE: obtain the new code
    var code2 = `(function(moduleName, moduleData) {
    if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
      module.exports = moduleData;
    } else if (typeof define === "function" && typeof define.amd !== "undefined") {
      define([], () => moduleData);
    } else {
      window[moduleName] = moduleData;
    }
})(
  ${JSON.stringify(exportTo)},
  (function() {
  	${code.replace(regex2, "\n\nreturn ")}
	})()
)`;
    var beautification = uglify.minify(code2, Object.assign({
    	compress: false,
      output: {
        beautify: true
      }
    }, optionsBeautification));
    if (beautification.error) {
      throw beautification.error;
    }
    return beautification.code;
  }
}

/**
 * 
 * ## 5. CLI reference
 * 
 * ```
 * Options:
 * --help        Show help                                              [boolean]
 * --version     Show version number                                    [boolean]
 * --input, -i   Set a file as input.                         [string] [required]
 * --output, -o  Set a file as output.                        [string] [required]
 *
 * Missing required arguments: input, output
 * Please, provide --input (or -i) and output (or -o) parameters.
 * ```
 * 
 * The usage is very simple:
 * 
 * ```
 * js-export -i "my-file.js" -o "my-file.universal.js"
 * ```
 * 
 * This will try to universalize and beautify the file "my-file.js" and dump the results into "my-file.universal.js".
 * 
 * ## 6. Commands for the project development
 * 
 * Run tests, coverage reporting, CLI compilation and documentation generation
 * 
 * ##### 6.1. To run tests:
 * 
 * ~$ `npm run test`
 * 
 * ##### 6.2. To generate coverage reports:
 * 
 * ~$ `npm run test-coverage`
 * 
 * ##### 6.3. To compile the CLI tool:
 * 
 * ~$ `npm link` (probably, `sudo ~` will be required)
 * 
 * ##### 6.4. To generate documentation:
 * 
 * ~$ `npm run docs`
 * 
 * 
 * ## 7. Conclusion
 * 
 * Simple tool that can be very useful to universalize your modules for browsers, AMD systems and Node.js.
 * 
 * Usable as API or CLI.
 * 
 */
module.exports = { JsExporter };

(function(e, n) {
    if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
        module.exports = n;
    } else if (typeof define === "function" && typeof define.amd !== "undefined") {
        define([], () => n);
    } else {
        window[e] = n;
    }
})("Example2", function() {
    var e = 450;
    return e;
}());
module.exports = function(config) {
    config.set({
        browsers: ["Chrome", "Firefox"],
        colors: true,
        frameworks: ["jasmine"],
        files: [
            "src/groovy.utils.js",
            "specs/*.spec.js"
        ]
    });
};
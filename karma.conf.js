module.exports = function(config) {
    config.set({
        frameworks: ["jasmine"],
        files: [
            "src/groovy.utils.js",
            "specs/*.spec.js"
        ]
    });
};
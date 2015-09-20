module.exports = function(config) {
    config.set({
        browsers: ["Chrome", "Firefox"],
        colors: true,
        frameworks: ["jasmine"],
        files: [
            "node_modules/jquery/dist/jquery.min.js",
            "src/groovy.utils.js",
            "specs/*.spec.js"
        ]
    });
};
"use strict";
var gulp = require("gulp");
var g = require("gulp-load-plugins")();
var streamCombiner = require("stream-combiner");

var paths = {
	ts: "src/**/*.ts",
	dest: "build"
};

var tsOptions = {
	"target": "es5",
	"module": "commonjs",
	"typescript": require("typescript")
};

var tsp = function() {
	return streamCombiner([
		g.sourcemaps.init(),
		g.typescript(tsOptions),
		g.sourcemaps.write()
	]);
};


gulp.task("watch", function() {
	g.watch(paths.ts, {
		ignoreInitial: false,
		verbose: false
	}, g.batch(function(events, done) {
		events
			.pipe(tsp())
			.pipe(gulp.dest(paths.dest));
		events.on("end", done);
		events.on("data", function(file) {
			var niceRelativePath = file.path.slice(file.cwd.length + 1);
			g.util.log(g.util.colors.magenta(niceRelativePath), "was changed");
		});
	}));

});


gulp.task("compile", function() {
	gulp.src(paths.ts)
		.pipe(tsp())
		.pipe(gulp.dest(paths.dest));
});
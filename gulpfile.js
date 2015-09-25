var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* RUN TESTS
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

gulp.task('test', function() {
	return gulp.src(['test/*.js'], { read: false })
		.pipe(mocha({ reporter: 'list' }))
		.on('error', gutil.log);
});

gulp.task('test-watch', function() {
	gulp.watch(['./**/*.js'], ['test']);
});

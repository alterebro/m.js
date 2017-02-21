var gulp = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	cssmin = require('gulp-clean-css'),
	sequence = require('gulp-sequence');

gulp.task('minifysrc', function () {
	return gulp.src('src/m.js')
		.pipe(uglify())
		.pipe(rename('m.min.js'))
		.pipe(gulp.dest('src'));
});

gulp.task('copy2dist', function () {
    return gulp.src('src/**/*')
      .pipe(gulp.dest('dist'));
});

gulp.task('copy2docs', function () {
    return gulp.src('src/**/*')
      .pipe(gulp.dest('docs/js'));
});

gulp.task('minifycss', function () {
	return gulp.src('docs/css/m.css')
		.pipe(cssmin())
		.pipe(rename('m.min.css'))
		.pipe(gulp.dest('docs/css/'));
});

gulp.task('default', sequence('minifysrc', ['copy2dist', 'copy2docs', 'minifycss']));

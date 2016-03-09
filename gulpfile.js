const gulp = require('gulp');
const webserver = require('gulp-webserver');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const webpack = require('gulp-webpack');
const merge2 = require('merge2');
const babel = require('gulp-babel');
const gutil = require('gulp-util');

gulp.task('webpack',() => {
	return gulp.src('src/index.js')
		.pipe(webpack(require('./webpack.config.js')))
		// .pipe(uglify())
		.pipe(gulp.dest('dist/'))
});

gulp.task('webpack-watch', () => {
	var config = require('./webpack.config.js')
	config.watch = true;
	return gulp.src('src/index.js')
		.pipe(webpack(config))
		// .pipe(uglify())
		.pipe(gulp.dest('dist/'))
})

gulp.task('html',() => {
	return gulp.src('src/index.html').pipe(gulp.dest('dist/'));
});

gulp.task('clean', () => {
	return gulp.src('dist/*').pipe(clean());
});

gulp.task('babel', () => {
	return gulp.src('src/js/**/*.js')
		.pipe(babel(require('./babel.config.js')))
		.pipe(gulp.dest('build'));
})

gulp.task('serve', () => {
	return gulp.src('dist/')
		.pipe(webserver({
			livereload: true,
			open: true
		}));
})

gulp.task('watch',() => {
	gulp.watch('src/**/*.html',['html']);
})

gulp.task('dev',['webpack-watch','watch','serve']);

gulp.task('build',[
	'webpack',

	'html'
]);

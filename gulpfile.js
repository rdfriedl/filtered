const gulp = require('gulp');
const webserver = require('gulp-webserver');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const webpack = require('gulp-webpack');
const merge2 = require('merge2');
const babel = require('gulp-babel');
const gutil = require('gulp-util');
const BUILD_MODE = (process.env.BUILD_MODE || 'dev').trim();

gulp.task('webpack',() => {

	gutil.log('system var BUILD_MODE='+BUILD_MODE);
	gutil.log((BUILD_MODE == 'prod')? 'Running in production mode' : 'Running in development mode');

	return gulp.src('src/index.js')
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('dist/'))
});

gulp.task('webpack-watch', () => {

	gutil.log('system var BUILD_MODE='+BUILD_MODE);
	gutil.log((BUILD_MODE == 'prod')? 'Running in production mode' : 'Running in development mode');

	var config = require('./webpack.config.js');
	config.watch = true;
	return gulp.src('src/index.js')
		.pipe(webpack(config))
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

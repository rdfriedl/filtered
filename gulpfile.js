const gulp = require('gulp');
const webserver = require('gulp-webserver');
const clean = require('gulp-clean');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('gulp-webpack');
const gutil = require('gulp-util');

const BUILD_MODE = (process.env.BUILD_MODE || 'dev').trim();

function logInfo(){
	gutil.log('system var BUILD_MODE='+BUILD_MODE);
	gutil.log((BUILD_MODE == 'prod')? 'Running in production mode' : 'Running in development mode');
};

gulp.task('webpack',() => {
	logInfo();

	return gulp.src('src/index.js')
		.pipe(webpack(require('./webpack.config.js')))
		.pipe(gulp.dest('dist/'))
});

gulp.task('webpack-watch', () => {
	logInfo();

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

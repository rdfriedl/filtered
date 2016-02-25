const gulp = require('gulp');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const gulpWebpack = require('gulp-webpack');

gulp.task('build-webpack',() => {
	return gulp.src('app/index.js')
		.pipe(gulpWebpack(require('./webpack.config.js')))
		// .pipe(uglify())
		.pipe(gulp.dest('dist/'))
});

gulp.task('build-html',() => {
	return gulp.src('app/index.html').pipe(gulp.dest('dist/'));
});

gulp.task('build-res', () => {
	return gulp.src('app/help/**/*').pipe(gulp.dest('dist/help/'));
});

gulp.task('build-examples', () => {
	return gulp.src('app/examples/**/*').pipe(gulp.dest('dist/examples/'));
});

gulp.task('clean', () => {
	return gulp.src('dist/**/*').pipe(clean());
});

gulp.task('build',gulp.series([
	'build-webpack',

	'build-html',
	'build-res',
	'build-examples'
]));

gulp.task('default', () => {
	gulp.watch('app/**/*', gulp.series('build-webpack'))
})

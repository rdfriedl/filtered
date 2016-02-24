const gulp = require('gulp');
const babel = require('gulp-babel');
const uglifycss = require('gulp-uglifycss');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const webpack = require('gulp-webpack');

gulp.task('stage-js', () => {
	return gulp.src(['app/**/*.js','!app/help/**/*','!app/examples/**/*'])
		.pipe(babel({
			presets: ["es2015"],
			plugins: [
				"babel-plugin-transform-class-properties",
				// "babel-plugin-transform-es2015-modules-amd",
				"babel-plugin-transform-es2015-modules-commonjs",
				"babel-plugin-transform-merge-sibling-variables",
				"babel-plugin-transform-minify-booleans"
			],
			comments: false
		}))
		.pipe(gulp.dest('staging'));
});

gulp.task('build-webpack',() => {
	return gulp.src('staging/index.js')
		.pipe(webpack(require('./webpack.config.js')))
		// .pipe(uglify())
		.pipe(gulp.dest('dist/'))
})

gulp.task('stage-css', () => {
	return gulp.src('app/css/*.css')
		.pipe(uglifycss())
		.pipe(gulp.dest('staging/css'));
});

gulp.task('stage-html', () => {
	return gulp.src('app/**/*.html').pipe(gulp.dest('staging'));
});

gulp.task('build-html',() => {
	return gulp.src('staging/index.html').pipe(gulp.dest('dist/'));
});

gulp.task('stage-res', () => {
	return gulp.src('app/help/**/*').pipe(gulp.dest('staging/help'));
});

gulp.task('build-res', () => {
	return gulp.src('staging/help/**/*').pipe(gulp.dest('dist/help/'));
});

gulp.task('stage-examples', () => {
	return gulp.src('app/examples/**/*').pipe(gulp.dest('staging/examples'));
});

gulp.task('build-examples', () => {
	return gulp.src('staging/examples/**/*').pipe(gulp.dest('dist/examples/'));
});

gulp.task('clean', () => {
	return gulp.src('dist/**/*').pipe(clean());
});

gulp.task('clean-stage',() => {
	return gulp.src('staging').pipe(clean());
})

gulp.task('build',gulp.series([
	'stage-html',
	'stage-js',
	'stage-css',
	'stage-res',
	'stage-examples',

	'build-webpack',

	'build-html',
	'build-res',
	'build-examples',

	'clean-stage'
]));

/**/;module.exports = gulp;
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const clean = require('gulp-clean');
const gulpWebpack = require('gulp-webpack');

gulp.task('build-webpack',() => {
	return gulp.src('src/index.js')
		.pipe(gulpWebpack(require('./webpack.config.js')))
		// .pipe(uglify())
		.pipe(gulp.dest('dist/'))
});

gulp.task('build-html',() => {
	return gulp.src('src/index.html').pipe(gulp.dest('dist/'));
});

gulp.task('build-res', () => {
	return gulp.src('src/help/**/*').pipe(gulp.dest('dist/help/'));
});

gulp.task('build-examples', () => {
	return gulp.src('src/examples/**/*').pipe(gulp.dest('dist/examples/'));
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
	gulp.watch('src/**/*', gulp.series('build-webpack'))
})

// var gulp = require('gulp'),
//     webserver = require('gulp-webserver'),
//     babel = require('gulp-babel'),
//     clean = require('gulp-clean');

// // serve the build dir
// gulp.task('serve', function () {
//   gulp.src('build')
//     .pipe(webserver({
//       open: true
//     }));
// });

// // watch for changes and run the relevant task
// gulp.task('watch', function () {
//   gulp.watch('src/**/*.js', ['js']);
//   gulp.watch('src/**/*.html', ['html']);
//   gulp.watch('src/**/*.css', ['css']);
// });

// // move dependencies into build dir
// gulp.task('dependencies', function () {
//   return gulp.src([
//     'node_modules/systemjs/dist/system-csp-production.src.js',
//     'node_modules/systemjs/dist/system.js',
//     'node_modules/reflect-metadata/Reflect.js',
//     'node_modules/angular2/bundles/angular2.js',
//     'node_modules/angular2/bundles/angular2-polyfills.js',
//     'node_modules/rxjs/bundles/Rx.js',
//     'node_modules/es6-shim/es6-shim.min.js',
//     'node_modules/es6-shim/es6-shim.map'
//   ])
//     .pipe(gulp.dest('build/lib'));
// });

// // transpile & move js
// gulp.task('js', function () {
//   return gulp.src('src/**/*.js')
//     .pipe(babel({
//       presets: ['es2015'],
//       plugins: [
//         "angular2-annotations",
//         // "syntax-decorators",
//         // "transform-decorators",
//         "transform-decorators-legacy",
//         "transform-class-properties",
//         "transform-es2015-modules-systemjs"
//       ]
//     }))
//     .pipe(gulp.dest('build'));
// });

// // move html
// gulp.task('html', function () {
//   return gulp.src('src/**/*.html')
//     .pipe(gulp.dest('build'))
// });

// // move css
// gulp.task('css', function () {
//   return gulp.src('src/**/*.css')
//     .pipe(gulp.dest('build'))
// });

// gulp.task('clean', function(){
//   return gulp.src('build/**/*').pipe(clean());
// })

// // run init tasks
// gulp.task('build', gulp.parallel(['dependencies', 'js', 'html', 'css']));

// // run development task
// gulp.task('dev', gulp.series(['watch', 'serve']));

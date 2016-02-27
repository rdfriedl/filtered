const gulp = require('gulp');
const webserver = require('gulp-webserver');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const replace = require('gulp-replace');
const gulpWebpack = require('gulp-webpack');
const merge2 = require('merge2');

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
	return gulp.src('dist/*').pipe(clean());
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

// const libaries = [
//   ['jquery','/lib/jquery.js','node_modules/jquery/dist/jquery.js'],
//   ['jquery.mousewheel','/lib/jquery.mousewhee.js','node_modules/jquery.mousewheel/jquery.mousewheel.js'],
//   ['jquery.transit','/lib/jquery.transit.js','node_modules/jquery.transit/jquery.transit.js'],

//   ['svg.js','/lib/svg.js','node_modules/svg.js/dist/svg.js'],
//   ['svg.filter.js','/lib/svg.filter.js','node_modules/svg.filter.js/dist/svg.filter.js'],
//   ['svg.select.js','/lib/svg.select.js','node_modules/svg.select.js/dist/svg.select.js'],

//   ['clipboard','/lib/clipboard.js','node_modules/clipboard/dist/clipboard.js'],
//   ['knockout','/lib/knockout-latest.js','node_modules/knockout/build/output/knockout-latest.js'],
//   ['dexie','/lib/Dexie.js','node_modules/dexie/dist/latest/Dexie.js']
// ]
// const systemConfig = {
//   defaultJSExtensions: true,
//   map: {
//   }
// }
// libaries.forEach((lib) => {
//   systemConfig.map[lib[0]] = lib[1];
// })
// const paths = {
//   js: ['src/js/**/*','src/index.js']
// }
// const babelConfig = {
//   presets: ['es2015'],
//   plugins: [
//     "angular2-annotations",
//     // "syntax-decorators",
//     // "transform-decorators",
//     "transform-decorators-legacy",
//     "transform-class-properties",
//     "transform-es2015-modules-systemjs",
//     // "transform-es2015-modules-amd",
//     // "transform-es2015-modules-commonjs"
//   ]
// }

// // move dependencies into build dir
// gulp.task('dependencies-load-production', function () {
//   var src = [];
//   libaries.forEach((lib,i) => {
//     src.push(lib[2]);
//   })

// 	return gulp.src(src)
//     .pipe(sourcemaps.init())
//     .pipe(uglify())
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('build/lib'));
// });

// gulp.task('dependencies-load', function () {
//   var src = [];
//   libaries.forEach((lib,i) => {
//     src.push(lib[2]);
//   })

//   return gulp.src(src)
//     .pipe(gulp.dest('build/lib'));
// });

// gulp.task('dependencies-res', () => {
//   return merge2(
//     gulp.src('src/help/**/*').pipe(gulp.dest('build/help/')),
//     gulp.src('src/examples/**/*').pipe(gulp.dest('build/examples/'))
//   );
// });

// const libariesPreConfig = [
//   'node_modules/es6-shim/es6-shim.js',
//   'node_modules/systemjs/dist/system-csp-production.src.js',
//   'node_modules/systemjs/dist/system.src.js'
// ];
// gulp.task('dependencies-preconfig-production', function(){
//   return gulp.src(libariesPreConfig)
//     .pipe(sourcemaps.init())
//     .pipe(uglify())
//     .pipe(concat('lib-preconfig.js'))
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('build'))
// })

// gulp.task('dependencies-preconfig', function(){
//   return gulp.src(libariesPreConfig)
//     .pipe(concat('lib-preconfig.js'))
//     .pipe(gulp.dest('build'))
// })

// const libariesPack = [
//   'node_modules/reflect-metadata/Reflect.js',
//   'node_modules/angular2/bundles/angular2-polyfills.js',
//   'node_modules/angular2/bundles/angular2.js',
//   'node_modules/rxjs/bundles/Rx.js',
// ]
// gulp.task('dependencies-pack-production', function(){
//   return gulp.src(libariesPack)
//     .pipe(sourcemaps.init())
//     .pipe(uglify())
//     .pipe(concat('lib.js'))
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('build'))
// })

// gulp.task('dependencies-pack', function(){
//   return gulp.src(libariesPack)
//     .pipe(concat('lib.js'))
//     .pipe(gulp.dest('build'))
// })

// gulp.task('dependencies',gulp.parallel('dependencies-load','dependencies-pack','dependencies-preconfig','dependencies-res'));
// gulp.task('dependencies-production',gulp.parallel('dependencies-load-production','dependencies-pack-production','dependencies-preconfig-production','dependencies-res'));

// // transpile & move js
// gulp.task('js-production', function () {
//   return merge2(
//     gulp.src('src/js/**/*')
//       .pipe(babel(babelConfig))
//       .pipe(uglify())
//       .pipe(gulp.dest('build/js')),

//     gulp.src('src/index.js')
//       .pipe(babel(babelConfig))
//       .pipe(uglify())
//       .pipe(gulp.dest('build'))
//   );
// });

// gulp.task('js', function () {
//   return merge2(
//     gulp.src('src/js/**/*')
//       .pipe(sourcemaps.init())
//       .pipe(babel(babelConfig))
//       .pipe(sourcemaps.write())
//       .pipe(gulp.dest('build/js')),

//     gulp.src('src/index.js')
//       .pipe(babel(babelConfig))
//       .pipe(gulp.dest('build'))
//   );
// });

// // move html
// gulp.task('html', function () {
//   return gulp.src('src/**/*.html')
//     .pipe(replace('/*systemConfig*/',JSON.stringify(systemConfig)))//insert the system config
//     .pipe(gulp.dest('build'))
// });

// // move css
// gulp.task('css', function () {
//   return gulp.src('src/**/*.css')
//     .pipe(gulp.dest('build'))
// });

// gulp.task('clean', function(){
//   return gulp.src(['build/*']).pipe(clean());
// })

// // serve the build dir
// gulp.task('serve', function () {
//   gulp.src('build')
//     .pipe(webserver({
//       open: true
//     }));
// });

// // watch for changes and run the relevant task
// gulp.task('watch', function () {
//   gulp.watch('src/**/*.js', gulp.parallel(['js']));
//   gulp.watch('src/**/*.html', gulp.parallel(['html']));
//   gulp.watch('src/**/*.css', gulp.parallel(['css']));
//   gulp.watch(['src/examples/**/*','src/help/**/*'], gulp.parallel(['dependencies-res']));
// });

// // run init tasks
// gulp.task('build', gulp.parallel(['dependencies', 'js', 'html', 'css']));
// gulp.task('build-production', gulp.parallel(['dependencies-production', 'js-production', 'html', 'css']));

// // run development task
// gulp.task('dev', gulp.parallel(['watch', 'serve']));

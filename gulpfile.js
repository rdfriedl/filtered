/* jshint node: true */

let gulp = require('gulp');
let uglify = require('gulp-uglify');
let uglifycss = require('gulp-uglifycss');
let concat = require('gulp-concat');
let minifyHTML = require('gulp-minify-html');
let header = require('gulp-header');
let replace = require('gulp-replace');
let gulpIgnore = require('gulp-ignore');
let order = require("gulp-order");
let webserver = require('gulp-webserver');

let pkg = require('./package.json');
let banner = ['/**',
  ' * <%= pkg.name %> - v<%= pkg.version %>',
  ' */',
  ''].join('\n');

gulp.task('compile-js',function(){
	return gulp.src('js/*.js')
		.pipe(order([
			'*main*',
			'*editPosition*',
			'*effects*',
			'*baseEffects*',
			'*inputs*',
			'*outputs*',
			'*page*'
		]))
		.pipe(concat('dist/app.js'))
		.pipe(uglify())
		.pipe(header(banner, { pkg : pkg } ))
		.pipe(gulp.dest('./'));
});

gulp.task('compile-lib-js',function(){
	gulp.src('lib/*')
    	.pipe(gulp.dest('./dist/lib/'));
});

gulp.task('compile-lib-css',function(){
	return gulp.src('css/*.css')
	    .pipe(gulpIgnore.exclude('css/style.css'))
	    .pipe(gulp.dest('./dist/css'));
});

gulp.task('compile-css',function(){
	return gulp.src('css/style.css')
		.pipe(concat('dist/app.css'))
		.pipe(uglifycss({
	    	'max-line-len': 80
	    }))
  		.pipe(header(banner, { pkg : pkg } ))
		.pipe(gulp.dest('./'));
});

gulp.task('compile-html',function(){
	return gulp.src('index.html')
    	.pipe(replace(/<script src="js\/(.*?)<\/script>/g, ''))
    	.pipe(replace('<link rel="stylesheet" href="css/style.css">', ''))
    	// .pipe(replace(/<link rel="stylesheet" href="(.*?)>/g, ''))

		//js
    	.pipe(replace('<!-- js -->','<script src="app.js"></script>'))

		//lib
    	// .pipe(replace('<!-- lib -->','<script src="lib.js"></script>'))

    	//css
    	.pipe(replace('<!-- css -->','<link rel="stylesheet" href="app.css"/>'))

    	//css lib
    	// .pipe(replace('<!-- css lib -->','<link rel="stylesheet" href="lib.css"/>'))

    	//remove comments
    	// .pipe(replace(/<!--[^>]*-->/g,''))

	    .pipe(minifyHTML())
	    .pipe(gulp.dest('./dist/'));
});

gulp.task('compile-data',function(){
	gulp.src('examples/*').pipe(gulp.dest('./dist/examples/'));
	gulp.src('examples/screenshots/*').pipe(gulp.dest('./dist/examples/screenshots/'));
	gulp.src('examples/json/*').pipe(gulp.dest('./dist/examples/json/'));

	gulp.src('fonts/*').pipe(gulp.dest('./dist/fonts/'));
	gulp.src('help/*').pipe(gulp.dest('./dist/help/'));
	gulp.src('help/help_files/*').pipe(gulp.dest('./dist/help/help_files/'));
});

gulp.task('build-css',['compile-css','compile-lib-css']);
gulp.task('build-html',['compile-html']);
gulp.task('build-js',['compile-js','compile-lib-js']);
gulp.task('build',['build-js','build-css','build-html','compile-data']);

gulp.task('watch',function(){
    gulp.watch('js/*.js',['compile-js']);
    gulp.watch('css/*.css',['compile-css']);
    gulp.watch('./*.html',['compile-html']);

	gulp.watch([
        'examples/*',
        'examples/screenshots/*',
        'examples/json/*',
        'fonts/*',
        'help/*',
        'help/help_files/*'
    ],['compile-data']);
});

gulp.task('serve', function(){
	return gulp.src('./')
		.pipe(webserver({
			livereload: true,
			open: true
	    }));
});

gulp.task('serve-dist', function(){
	return gulp.src('./dist/')
		.pipe(webserver({
			livereload: true,
			open: true
	    }));
});

gulp.task('default',['watch','serve-dist']);

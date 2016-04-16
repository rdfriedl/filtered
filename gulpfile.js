/* jshint node: true */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var uglifyjs = require('gulp-uglifyjs');
var uglifycss = require('gulp-uglifycss');
var concat = require('gulp-concat');
var minifyHTML = require('gulp-minify-html');
var header = require('gulp-header');
var replace = require('gulp-replace');
var gulpIgnore = require('gulp-ignore');
var order = require("gulp-order");
var wrap = require("gulp-wrap");
var closureCompiler = require('google-closure-compiler').gulp();
var webserver = require('gulp-webserver');

var pkg = require('./package.json');
var banner = ['/**',
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
		// .pipe(uglifyjs('app.js', {
	 //    	mangle: {
		//         except      : [],
		//         eval        : true,
		//         sort        : true,
		//         toplevel    : false,
		//         screw_ie8   : false,
		//         keep_fnames : true
	 //    	}
	 //    }))
		.pipe(concat('dist/app.js'))
    	.pipe(uglify({
    		mangle: {
		        except      : [],
		        eval        : true,
		        sort        : true,
		        toplevel    : false,
		        screw_ie8   : false,
		        keep_fnames : true
	    	},
    		compress: {
    			sequences     : true,  // join consecutive statemets with the “comma operator”
				properties    : true,  // optimize property access: a["foo"] → a.foo
				dead_code     : true,  // discard unreachable code
				drop_debugger : true,  // discard “debugger” statements
				unsafe        : false, // some unsafe optimizations (see below)
				conditionals  : true,  // optimize if-s and conditional expressions
				comparisons   : true,  // optimize comparisons
				evaluate      : true,  // evaluate constant expressions
				booleans      : true,  // optimize boolean expressions
				loops         : true,  // optimize loops
				unused        : true,  // drop unused variables/functions
				hoist_funs    : true,  // hoist function declarations
				hoist_vars    : true, // hoist variable declarations
				if_return     : true,  // optimize if-s followed by return/continue
				join_vars     : true,  // join var declarations
				cascade       : true,  // try to cascade `right` into `left` in sequences
				side_effects  : true,  // drop side-effect-free statements
				warnings      : false,  // warn about potentially dangerous optimizations/code
				global_defs   : {}     // global definitions
    		}
    	}))
		// .pipe(wrap('(function(){<%= contents %>})()'))
		/*.pipe(closureCompiler({
			compilation_level: 'ADVANCED',
			warning_level: 'QUIET',
			language_in: 'ECMASCRIPT6_STRICT',
			language_out: 'ECMASCRIPT5_STRICT',
			output_wrapper: '(function(){\n%output%\n}).call(this)',
    		js_output_file: 'app.js',
    		externs: [
				'lib/bootstrap.min.js',
				'lib/knockout-min.js',
    			'lib/Dexie.min.js',
				'lib/ZeroClipboard.Core.min.js',
				'lib/ZeroClipboard.min.js',
				'lib/dom.jsPlumb-1.7.5-min.js',
				'lib/jquery.js',
				'lib/jquery.mousewheel.min.js',
				'lib/jquery.transit.min.js',
				'lib/prettify.js',
				'lib/svg.draggable.min.js',
				'lib/svg.filter.min.js',
				'lib/svg.js',
				'lib/svg.resize.min.js',
				'lib/svg.select.min.js'
			]
        }))*/
  		.pipe(header(banner, { pkg : pkg } ))
  		//.pipe(gulp.dest('dist/'));
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
var header = require('gulp-header');

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
})

gulp.task('serve', function(){
	return gulp.src('./')
		.pipe(webserver({
			livereload: true,
			open: true
	    }));
})

gulp.task('serve-dist', function(){
	return gulp.src('./dist/')
		.pipe(webserver({
			livereload: true,
			open: true
	    }));
})

gulp.task('default',['watch','serve-dist']);

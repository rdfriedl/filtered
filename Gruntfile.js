module.exports = function(grunt) {

	// var path = 'C:/Users/Robert/Dropbox/Apps/Static Web Apps/filtered';
	var path = 'dist'

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			files: {
				files: [
					{
						expand: true,
						src: ['css/*','fonts/*','help/**','examples/**'],
						dest: path
					},
					{
						src: ['screenshot.png'],
						dest: 'dist/screenshot.png'
					},
					{
						src: ['lib/ZeroClipboard.swf'],
						dest: 'dist/ZeroClipboard.swf'
					}
				]
			},
			page: {
				src: 'index.html',
				dest: path+'/index.html',
			    options: {
		    		process: function(content) {
		    		  	return content.replace(/<script src="(.*?)<\/script>/g,'').replace('</head>','<script src="app.min.js"></script>\n</head>');
		    		},
			    },
			}
		},
		uglify: {
		    options: {
		      	banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
		        		'<%= grunt.template.today("yyyy-mm-dd") %> */ \n',
	      		mangle: true,
		        // sourceMap: true,
		        // sourceMapName: 'dist/app.min.map'
		    },
		    dist: {
		        files: {
		        	'dist/app.min.js': [
        				'lib/svg.js',
        				'lib/svg.filter.min.js',
        				'lib/svg.select.min.js',
        				'lib/svg.resize.min.js',
        				'lib/svg.draggable.min.js',
		        		'lib/jquery.js',
        				'lib/jquery.mousewheel.min.js',
        				'lib/jquery.transit.min.js',
        				'lib/bootstrap.min.js',
        				'lib/knockout-min.js',
        				'lib/dom.jsPlumb-1.7.5-min.js',
        				'lib/three.min.js',
        				'lib/threejs/controls/OrbitControls.js',
        				'lib/threejs/controls/TransformControls.js',
        				'lib/prettify.js',
        				'lib/ZeroClipboard.Core.min.js',
        				'lib/ZeroClipboard.min.js',

		        		'js/main.js',
						'js/editLight.js',
						'js/editPosition.js',
						'js/effects.js',
						'js/baseEffects.js',
						'js/inputs.js',
						'js/outputs.js',
						'js/page.js'
		        	]
		        }
		    }
		}
	});

 	grunt.loadNpmTasks('grunt-contrib-uglify');
 	grunt.loadNpmTasks('grunt-contrib-copy');

  	grunt.registerTask('default', ['copy','uglify']);
  	grunt.registerTask('buildjs', ['uglify']);
};
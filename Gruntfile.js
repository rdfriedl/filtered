module.exports = function(grunt) {

	var path = 'C:/Users/Robert/Dropbox/Apps/Static Web Apps/filtered';

	grunt.initConfig({
		copy: {
			main: {
				files: [
					{
						expand: true,
						src: ['css/**','fonts/**','help/**','lib/**','index.html'],
						dest: path
					}
				]
			}
		},
		uglify: {
		    dist: {
		        files: grunt.file.expandMapping(['js/*.js'], path)
		    }
		}
	});

 	grunt.loadNpmTasks('grunt-contrib-uglify');
 	grunt.loadNpmTasks('grunt-contrib-copy');

  	grunt.registerTask('default', ['copy','uglify']);
};
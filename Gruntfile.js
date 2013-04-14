module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            my_target: {
                files: {
                    '<%= pkg.build.target %>/ClassTemplate.min.js': ['ClassTemplate.js'],
                    '<%= pkg.build.target %>/Events.min.js': ['Events.js'],
                    '<%= pkg.build.target %>/FastButtonListener.min.js': ['FastButtonListener.js'],
                    '<%= pkg.build.target %>/HTTPRequest.min.js': ['HTTPRequest.js'],
                    '<%= pkg.build.target %>/Resolutions.min.js': ['Resolutions.js']
                }
            }
        },
        copy: {
            main: {
                files: [
                        {expand: true, flatten: true, src: ['rsvp/browser/rsvp.min.js'], dest: '<%= pkg.build.target %>/'}
                        ]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'copy']);

};
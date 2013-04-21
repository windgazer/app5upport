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
                files: grunt.file.expandMapping( ['*.js','!Gruntfile.js'], '<%= pkg.build.target %>-minified/' )
            }
        },
        copy: {
            minify: {
                files: grunt.file.expandMapping(
                    ['rsvp/browser/rsvp.min.js','package.json']
                    , '<%= pkg.build.target %>-minified/'
                    , {
                        flatten: Boolean,
                        rename: function(dest, matchedSrcPath, options) {
                        return dest + matchedSrcPath.replace('.min.js','.js');
                    } }
                )
            },
            normal: {
                files: grunt.file.expandMapping( ['*.js','!Gruntfile.js','rsvp/browser/rsvp.js'], '<%= pkg.build.target %>-normal/', { flatten: Boolean } )
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'copy:minify']);
    grunt.registerTask('npm', ['copy:normal']);

};
/* global module, require */
module.exports = function( grunt ) {
    "use strict";

    require( "matchdep" ).filterDev( "grunt-*" ).forEach( grunt.loadNpmTasks );

    // Project configuration.
    grunt.initConfig( {
        pkg : grunt.file.readJSON( "package.json" ),
        uglify : {
            options : {
                banner : "/*! <%= pkg.name %> - v<%= pkg.version %> - " +
                         "<%= grunt.template.today('yyyy-mm-dd') %> */"
            },
            my_target : { // jshint ignore:line
                files : grunt.file.expandMapping(
                            [ "*.js", "libs/custom/*.js", "!Gruntfile.js" ],
                            "<%= pkg.build.target %>-minified/",
                            { flatten: true }
                        )
            }
        },
        copy : {
            minify : {
                files : grunt.file.expandMapping (
                    [
                        "libs/rsvp/browser/rsvp.min.js",
                        "libs/points/build/Points.min.js",
                        "package.json"
                    ],
                    "<%= pkg.build.target %>-minified/",
                    {
                        flatten : true,
                        rename : function( dest, matchedSrcPath, options ) {
                            return dest +
                                matchedSrcPath.replace( ".min.js", ".js" );
                        }
                    }
                )
                },
                normal : {
                    files : grunt.file.expandMapping (
                        [
                            "*.js", "!Gruntfile.js",
                            "libs/rsvp/browser/rsvp.js",
                            "libs/custom/*.js"
                        ],
                        "<%= pkg.build.target %>-normal/",
                        {
                            flatten : true
                        }
                    )
                },
                renames : {
                    options: {
                        flatten: true
                    },
                    files : {
                        "libs/custom/rAF.js": "libs/rAF/index.js"
                    } 
                }
            }
        }
    );

    // Default task(s).
    grunt.registerTask( "default", [ "uglify", "copy:renames", "copy:minify" ] );
    grunt.registerTask( "npm", [ "copy:renames", "copy:normal" ] );

};

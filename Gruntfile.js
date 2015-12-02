'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths for the application
    var appConfig = {
        app: 'app',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        appConfig: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= appConfig.app %>/**/*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            less: {
                files: ['<%= appConfig.app %>/**/*.less'],
                tasks: ['less:server', 'postcss']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= appConfig.app %>/**/*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= appConfig.app %>/img/{,*/}*.{png,jpg,jpeg,gif,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 3000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        var modRewrite = require('connect-modrewrite'),
                            serveStatic = require('serve-static');

                        return [
                            modRewrite(['^[^\\.]*$ /index.html [L]']),
                            serveStatic('.tmp'),
                            connect().use(
                                '/bower_components',
                                serveStatic('./bower_components')
                            ),
                            serveStatic(appConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    livereload: false,
                    base: '<%= appConfig.dist %>',
                    middleware: function() {
                        var modRewrite = require('connect-modrewrite'),
                            serveStatic = require('serve-static');

                        return [
                            modRewrite(['^[^\\.]*$ /index.html [L]']),
                            serveStatic(appConfig.dist)
                        ];
                    }
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= appConfig.app %>/**/*.js'
                ]
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= appConfig.dist %>/**/*'
                    ]
                }]
            },
            server: '.tmp'
        },

        replace: {
            removeMarkedStrings: {
                options: {
                    patterns: [{
                        match: /.*?\/\/\n/g,
                        replacement: ''
                    }]
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            },
            ghBasePath: {
                options: {
                    patterns: [{
                        match: /<base href=".*?".*?>/,
                        replacement: function(tag) {
                            var gitUrl = grunt.file.readJSON('./package.json').repository.url;
                            var gitHubPath  = gitUrl.match(/\/([^\/]+)\.git$/)[1];
                            return tag.replace(/".*?"/, '"/'+gitHubPath+'/"');
                        }
                    }]
                },
                files: [{
                    src: '<%= appConfig.dist %>/index.html',
                    dest: '<%= appConfig.dist %>/index.html'
                }]
            }
        },

        // Add vendor prefixed styles
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({
                        browsers: 'last 2 versions'
                    })
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Compiles LESS to CSS and generates necessary files if requested
        less: {
            options: {
                paths: [
                    './bower_components'
                ]
            },
            dist: {
                options: {
                    cleancss: false,
                    report: 'gzip'
                },
                files: [{
                    src: "<%= appConfig.app %>/_configuration/main.less",
                    dest: ".tmp/styles/main.css"
                }]
            },
            server: {
                files: [{
                    src: "<%= appConfig.app %>/_configuration/main.less",
                    dest: ".tmp/styles/main.css"
                }]
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= appConfig.dist %>/scripts/*.js',
                    '<%= appConfig.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,svg}',
                    '<%= appConfig.dist %>/styles/*.css'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            dist: {
                src: '<%= appConfig.app %>/index.html',
                options: {
                    dest: '<%= appConfig.dist %>',
                    flow: {
                        html: {
                            steps: {
                                js: ['concat', 'uglify'],
                                css: ['concat', 'cssmin']
                            },
                            post: {}
                        }
                    },
                    blockReplacements: {
                        less: function(block) {
                            console.log('block', block);
                            return '<link rel="stylesheet" href="'+block.dest+'">';
                        }
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: [
                '<%= appConfig.dist %>/**/*.html'
            ],
            css: [
                '<%= appConfig.dist %>/styles/*.css'
            ],
            js: [
                '<%= appConfig.dist %>/scripts/*.js'
            ],
            options: {
                assetsDirs: [
                    '<%= appConfig.dist %>',
                    '<%= appConfig.dist %>/img',
                    '<%= appConfig.dist %>/styles',
                    '<%= appConfig.dist %>/scripts'
                ],
                patterns: {
                    js: [
                        [/(img\/.*?\.(?:gif|jpeg|jpg|png|svg))/gm, 'Update the JS to reference our revved images']
                    ]
                }
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= appConfig.app %>/img',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= appConfig.dist %>/img'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= appConfig.app %>/img',
                    src: '{,*/}*.svg',
                    dest: '<%= appConfig.dist %>/img'
                }]
            }
        },

        htmlmin: {
            options: {
                collapseWhitespace: true,
                conservativeCollapse: true,
                collapseBooleanAttributes: true,
                removeComments: true,
                removeCommentsFromCDATA: true,
                removeOptionalTags: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= appConfig.dist %>',
                    src: ['**/*.html'],
                    dest: '<%= appConfig.dist %>'
                }]
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: ['script.js'],
                    dest: '.tmp/concat/scripts'
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= appConfig.app %>',
                    dest: '<%= appConfig.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '**/*.html',
                        '**/*.json'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/img',
                    dest: '<%= appConfig.dist %>/img',
                    src: ['generated/*']
                }, {
                    expand: true,
                    dot: true,
                    cwd: './bower_components/font-awesome/fonts',
                    dest: '<%= appConfig.dist %>/bower_components/font-awesome/fonts',
                    src: ['*']
                }]
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'less:server'
            ],
            dist: [
                'imagemin',
                'svgmin'
            ]
        },

        'gh-pages': {
            options: {
                base: '<%= appConfig.dist %>'
            },
            src: ['**']
        }
    });


    grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {
        if (target === 'dist') {
            return grunt.task.run(['connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'postcss',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean',
        'less:dist',
        'useminPrepare',
        'concurrent:dist',
        'postcss',
        'concat',
        'ngAnnotate',
        'replace:removeMarkedStrings',
        'copy:dist',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('lint', [
        'newer:jshint'
    ]);

    grunt.registerTask('update-demo', [
        'lint',
        'build',
        'replace:ghBasePath',
        'gh-pages'
    ]);

    grunt.registerTask('default', [
        'lint',
        'build'
    ]);
};

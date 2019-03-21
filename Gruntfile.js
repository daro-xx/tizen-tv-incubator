module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            dist: ['dist/']
        },
        copy: {
            images: {
                expand: true,
                cwd: 'src/images/',
                src: ['**'],
                dest: 'dist/images'
            },
            videos: {
                expand: true,
                cwd: 'src/videos/',
                src: ['**'],
                dest: 'dist/videos'
            },
            html: {
                expand: true,
                src: 'src/**/*.html',
                dest: 'dist/',
                flatten: true
            },
            tizen: {
                expand: true,
                cwd: 'build/tizen/',
                src: '**',
                dest: 'dist/'
            }
        },
        concat: {
            js: {
                src: ['src/js/models.js', 'src/**/*.js'],
                dest: 'dist/app.js',
            },
            css: {
                src: ['src/**/*.css'],
                dest: 'dist/app.css',
            },
        },
        eslint: {
            options: {
                configFile: "eslintrc.json"
            },
            src: ["src/**/*.js"]
        },
        injector: {
            js: {
                options: {
                    relative: true
                },
                files: {
                    'dist/index.html': ['dist/**/*.js']
                }
            },
            css: {
                options: {
                    relative: true
                },
                files: {
                    'dist/index.html': ['dist/**/*.css']
                }
            }
          }
    });
     
    grunt.loadNpmTasks("gruntify-eslint");
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-injector');
    grunt.registerTask("default", ["eslint", "clean", "copy", "concat", "injector"]);
};
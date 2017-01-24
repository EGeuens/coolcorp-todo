module.exports = function (grunt) {
    // Project configuration.
    //noinspection JSUnresolvedFunction
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        nodemon: {
            dev: {
                script: "index.js"
            },
            options: {
                ignore: ["node_modules/**", "gruntfile.js"],
                env: {
                    PORT: "8181"
                }
            }
        },

        watch: {
            build: {
                files: ["index.ts", "src/**/*.ts", "!node_modules/**/*.ts"], // the watched files
                tasks: ["newer:tslint:all", "ts:build"], // the task to run
                options: {
                    spawn: false // makes the watch task faster
                }
            },
            jasmine: {
                files: ["src/**/*.ts", "test/**/*.ts", "!typings/**/*.*", "!node_modules/**/*.*"], // the watched files
                tasks: ["newer:tslint:all", "ts:build", "jasmine_nodejs:coolcorp"], // the task to run
                options: {
                    // causes trouble with jasmine (?)
                    // spawn: false // makes the watch task faster
                }
            }
        },

        concurrent: {
            watchers: {
                tasks: ["nodemon", "watch:forBuild"],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        tslint: {
            options: {
                configuration: grunt.file.readJSON("tslint.json")
            },
            all: {
                src: ["index.ts", "src/**/*.ts", "test/**/*.ts", "!node_modules/**/*.ts", "!obj/**/*.ts", "!typings/**/*.ts"] // avoid linting typings files and node_modules files
            }
        },

        ts: {
            build: {
                src: ["index.ts", "src/**/*.ts", "test/**/*.ts", "!node_modules/**/*.ts"], // Avoid compiling TypeScript files in node_modules
                options: {
                    module: 'commonjs', // To compile TypeScript using external modules like NodeJS
                    fast: 'never' // You'll need to recompile all the files each time for NodeJS
                }
            }
        },

        jasmine_nodejs: {
            // task specific (default) options
            options: {
                specNameSuffix: "spec.js", // also accepts an array
                helperNameSuffix: "helper.js",
                useHelpers: false,
                random: false,
                seed: null,
                defaultTimeout: null, // defaults to 5000
                stopOnFailure: false,
                traceFatal: true,
                // configure one or more built-in reporters
                reporters: {
                    console: {
                        colors: true,        // (0|false)|(1|true)|2
                        cleanStack: 1,       // (0|false)|(1|true)|2|3
                        verbosity: 4,        // (0|false)|1|2|3|(4|true)
                        listStyle: "indent", // "flat"|"indent"
                        activity: false
                    }
                    // junit: {
                    //     savePath: "./reports",
                    //     filePrefix: "junit-report",
                    //     consolidate: true,
                    //     useDotNotation: true
                    // },
                    // nunit: {
                    //     savePath: "./reports",
                    //     filename: "nunit-report.xml",
                    //     reportName: "Test Results"
                    // },
                    // terminal: {
                    //     color: false,
                    //     showStack: false,
                    //     verbosity: 2
                    // },
                    // teamcity: true,
                    // tap: true
                },
                // add custom Jasmine reporter(s)
                customReporters: []
            },
            coolcorp: {
                // target specific options
                options: {
                    useHelpers: false
                },
                // test files
                specs: [
                    "test/**"
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-newer");
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-nodemon");
    grunt.loadNpmTasks("grunt-concurrent");
    grunt.loadNpmTasks('grunt-jasmine-nodejs');

    // Default tasks.
    // grunt.registerTask("serve", ["concurrent:watchers"]);
    grunt.registerTask("default", ["tslint:all", "ts:build"]);
    grunt.registerTask('test', ["jasmine_nodejs:coolcorp"]);
    grunt.registerTask('dev-test', ["jasmine_nodejs:coolcorp", "watch:jasmine"]);
};
// To use this file in WebStorm, right click on the file name in the Project Panel (normally left) and select "Open Grunt Console"

/** @namespace __dirname */
/* jshint -W097 */// jshint strict:false
/*jslint node: true */
"use strict";

module.exports = function (grunt) {

    var srcDir    = __dirname + '/';
    var pkg       = grunt.file.readJSON('package.json');
    var adaptName = pkg.name.substring('iobroker.'.length);
    var iopackage = grunt.file.readJSON('io-package.json');
    var version   = (pkg && pkg.version) ? pkg.version : iopackage.common.version;
    var newname   = grunt.option('name');
    var author    = grunt.option('author') || 'Patrick Arns';
    var email     = grunt.option('email')  || 'npm@patrick-arns.de';
    var fs        = require('fs');

    // check arguments
    if (process.argv[2] == 'rename') {
		console.log('Try to rename to "' + newname + '"');
        if (!newname) {
            console.log('Please write the new amazon-dash name, like: "grunt rename --name=mywidgetset" --author="Author Name"');
            process.exit();
        }
        if (newname.indexOf(' ') != -1) {
            console.log('Name may not have space in it.');
            process.exit();
        }
        if (newname.toLowerCase() != newname) {
            console.log('Name must be lower case.');
            process.exit();
        }
        if (fs.existsSync(__dirname + '/admin/amazon-dash.png')) {
            fs.renameSync(__dirname + '/admin/amazon-dash.png',              __dirname + '/admin/' + newname + '.png');
        }
        if (fs.existsSync(__dirname + '/widgets/amazon-dash.html')) {
            fs.renameSync(__dirname + '/widgets/amazon-dash.html',           __dirname + '/widgets/' + newname + '.html');
        }
        if (fs.existsSync(__dirname + '/widgets/amazon-dash/js/amazon-dash.js')) {
            fs.renameSync(__dirname + '/widgets/amazon-dash/js/amazon-dash.js', __dirname + '/widgets/amazon-dash/js/' + newname + '.js');
        }
        if (fs.existsSync(__dirname + '/widgets/amazon-dash')) {
            fs.renameSync(__dirname + '/widgets/amazon-dash',                __dirname + '/widgets/' + newname);
        }
    }

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,

        replace: {
            version: {
                options: {
                    patterns: [
                        {
                            match: /version: *"[\.0-9]*"/,
                            replacement: 'version: "' + version + '"'
                        },
                        {
                            match: /"version": *"[\.0-9]*",/g,
                            replacement: '"version": "' + version + '",'
                        },
                        {
                            match: /version: *"[\.0-9]*",/g,
                            replacement: 'version: "' + version + '",'
                        }
                    ]
                },
                files: [
                    {
                        expand:  true,
                        flatten: true,
                        src:     [
                                srcDir + 'package.json',
                                srcDir + 'io-package.json'
                        ],
                        dest:    srcDir
                    },
                    {
                        expand:  true,
                        flatten: true,
                        src:     [
                                 srcDir + 'widgets/' + adaptName + '.html'
                        ],
                        dest:    srcDir + 'widgets'
                    },
                    {
                        expand:  true,
                        flatten: true,
                        src:     [
                                 srcDir + 'widgets/' + adaptName + '/js/' + adaptName + '.js'
                        ],
                        dest:    srcDir + 'widgets/' + adaptName + '/js/'
                    }
                ]
            },
            name: {
                options: {
                    patterns: [
                        {
                            match: /amazon-dash/g,
                            replacement: newname
                        },
                        {
                            match: /Amazon-dash/g,
                            replacement: newname ? (newname[0].toUpperCase() + newname.substring(1)) : 'Amazon-dash'
                        },
                        {
                            match: /Patrick Arns/g,
                            replacement: author
                        },
                        {
                            match: /npm@patrick-arns.de/g,
                            replacement: email
                        }
                    ]
                },
                files: [
                    {
                        expand:  true,
                        flatten: true,
                        src:     [
                                 srcDir + 'io-package.json',
                                 srcDir + 'LICENSE',
                                 srcDir + 'package.json',
                                 srcDir + 'README.md',
                                 srcDir + 'main.js',
                                 srcDir + 'Gruntfile.js'
                        ],
                        dest:    srcDir
                    },
                    {
                        expand:  true,
                        flatten: true,
                        src:     [
                                 srcDir + 'widgets/' + newname +'.html'
                        ],
                        dest:    srcDir + 'widgets'
                    },
                    {
                        expand:  true,
                        flatten: true,
                        src:     [
                                 srcDir + 'admin/index.html'
                        ],
                        dest:    srcDir + 'admin'
                    },
                    {
                        expand:  true,
                        flatten: true,
                        src:     [
                                 srcDir + 'widgets/' + newname + '/js/' + newname +'.js'
                        ],
                        dest:    srcDir + 'widgets/' + newname + '/js'
                    },
                    {
                        expand:  true,
                        flatten: true,
                        src:     [
                                 srcDir + 'widgets/' + newname + '/css/*.css'
                        ],
                        dest:    srcDir + 'widgets/' + newname + '/css'
                    }
                ]
            }
        },
        // Javascript code styler
        jscs:   require(__dirname + '/tasks/jscs.js'),
        // Lint
        jshint: require(__dirname + '/tasks/jshint.js'),

        http: {
            get_hjscs: {
                options: {
                    url: 'https://raw.githubusercontent.com/ioBroker/ioBroker.js-controller/master/tasks/jscs.js'
                },
                dest: 'tasks/jscs.js'
            },
            get_jshint: {
                options: {
                    url: 'https://raw.githubusercontent.com/ioBroker/ioBroker.js-controller/master/tasks/jshint.js'
                },
                dest: 'tasks/jshint.js'
            },
            get_jscsRules: {
                options: {
                    url: 'https://raw.githubusercontent.com/ioBroker/ioBroker.js-controller/master/tasks/jscsRules.js'
                },
                dest: 'tasks/jscsRules.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-http');

    grunt.registerTask('default', [
        'http',
        'replace:version',
        'jshint',
        'jscs'
    ]);

    grunt.registerTask('prepublish', [
        'http',
        'replace:version'
    ]);

    grunt.registerTask('p', [
        'http',
        'replace:version'
    ]);

    grunt.registerTask('rename', [
        'replace:name'
    ]);
};

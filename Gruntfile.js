var sources = [
  'Gruntfile.js',
  'server.js',
  'src/**/*.js',
  'test/**/*.js'
];

module.exports = function(grunt) {
  grunt.initConfig({
    simplemocha: {
      options: {
        timeout: 3000,
        globals: ['expect'],
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'dot'
      },

      all: { src: ['test/**/*_spec.js'] }
    },

    jshint: {
      all: sources,
      options: {
        force: true
      }
    },

    watch: {
      scripts: {
        files: sources,
        tasks: ['default']
      }
    }
  });

  grunt.registerTask('default', [
    'jshint',
    'simplemocha',
    'watch'
  ]);

  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
};

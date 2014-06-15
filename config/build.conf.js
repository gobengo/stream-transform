({
  mainConfigFile: 'requirejs.conf.js',
  paths: {
    almond: 'lib/almond/almond'
  },
  baseUrl: '..',
  name: "stream-transform",
  include: [
    'almond'
  ],
  stubModules: ['text', 'hgn', 'json'],
  out: "../dist/stream-transform.min.js",
  cjsTranslate: true,
  optimize: "none",
  uglify2: {
    compress: {
      unsafe: true
    },
    mangle: true
  },
  wrap: {
    startFile: 'wrap-start.frag',
    endFile: 'wrap-end.frag'
  },
  generateSourceMaps: true,
  onBuildRead: function(moduleName, path, contents) {
    switch (moduleName) {
      case "jquery":
        contents = "define([], function(require, exports, module) {" + contents + "});";
    }
    return contents;
  }
})

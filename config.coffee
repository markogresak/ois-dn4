exports.config =
  # See docs at https://github.com/brunch/brunch/blob/stable/docs/config.md.
  conventions:
    assets:  /^app\/assets\//
    ignored: /^(bower_components\/bootstrap-less(-themes)?|app\/styles\/overrides|(.*?\/)?[_]\w*)/
  modules:
    definition: false
    wrapper: false
  paths:
    public: './'
  files:
    javascripts:
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^(bower_components|vendor)/

    stylesheets:
      joinTo:
        'css/app.css': /^(app|vendor|bower_components)/
      order:
        before: [
          'app/styles/app.less'
        ]

    templates:
      joinTo:
        'js/dontUseMe' : /^app/ # dirty hack for Jade compiling.

  plugins:
    autoprefixer:
      browsers: ["last 1 version", "> 1%"]
      cascade: false

  # plugins:
  #   autoReload:
  #     enabled:
  #       css: on
  #       js: on
  #       assets: on
  #     port: [3333, 3000, 8080]
  #     delay: 200 if require('os').platform() is 'win32'
    # jade:
    #   pretty: yes # Adds pretty-indentation whitespaces to output (false by default)
    # jade_angular:
    #   modules_folder: 'partials'
    #   locals: {}

  # Enable or disable minifying of result js / css files.
  # minify: true

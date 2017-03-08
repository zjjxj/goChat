({
    appDir: './public',
    baseUrl: 'js',
    dir: './built.js',
    modules: [
        {
            name: 'main'
        }
    ],
    fileExclusionRegExp: /^((require)\.js)$/,
    optimizeCss: 'standard',
    removeCombined: true,
    paths: {
        jquery: "jquery/jquery-3.1.0",
        socketio: 'socketio/socket.io'
    },
    shim: {
        'socketio': {
            exports: 'io'
        }
    }
});
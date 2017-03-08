require.config({
    baseUrl: 'js',
    shim:{
        'socketio': {
            exports: 'io'
        },
        'jquery':{
            export:'$'
        }
    },
    paths: {
        jquery:
            "jquery/jquery-3.1.0"
        ,
        socketio: 'socketio/socket.io'
    }
});

require(['jquery','page'], function($, page) {
    $(function(){
        // $("#page").html("");
        page.initModule($("#page"));
    });
});

/**
 * page.js
 * Root namespace module
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

define(["page.shell"],function (shell) {
    var initModule = function ($container) {
        shell.initModule($container);
    };
    return {initModule: initModule};
});


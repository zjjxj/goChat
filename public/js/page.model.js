/**
 * page.model.js
 * Model model 
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
define(["jquery","socketio"],function ($,io) {
    var stateMap = {
        presentUser: null,
        onlineList: {}
    };
    var user = (function () {
        var socket;
        var get_present_User = function () {
            return stateMap.presentUser;
        };
        var login = function (username, password, elem) {
            socket = io.connect();
            socket.emit("logIn", {username: username, password: password});
            socket.on("loginSuccess", function (obj) {
                if (obj.username === username) {
                    stateMap.presentUser = obj.username;
                }
                elem.trigger("loginSuccess", obj);
                stateMap.onlineList = obj.onlineList;
            });
            socket.on("notFound", function () {
                elem.trigger("notFound");
            });
            socket.on("passwordError", function () {
                elem.trigger("passwordError");
            });
            socket.on('answer', function (data) {
                elem.trigger("robotMessage", data);
            });
            socket.on('say', function (data) {
                elem.trigger('receiveMessage', data)
            });
            socket.on('offline', function (data) {
                //更新列表
                elem.trigger('offline', data)
            })
        };
        var logout = function (elem) {
            elem.trigger("logout", stateMap.presentUser);
            socket.disconnect();
            stateMap.presentUser = null;
        };
        var signIn = function (username, tel, password) {

        };
        var send_message = function (inputValue, elem, to) {
            socket.emit('ask', {"from": stateMap.presentUser, "to": to, "msg": inputValue});
        };

        return {
            login: login, logout: logout, signIn: signIn, get_present_User: get_present_User,
            send_message: send_message
        };
    }());

    return {user: user}
});
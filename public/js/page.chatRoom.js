/*
 * page.chatRoom.js
 * ChatRoom feature module for page
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

define(['jquery',"page.shell","page.model"],function ($,shell,model) {
    var configMap = {
            main_html: '<div class="chatRoom">'
            + '<div class="chatRoom-head">'
            + '<span class="chatRoom-head-control">+</span>'
            + '<span class="chatRoom-head-title">chatRoom</span>'
            + '</div>'
            + '<div class="chatRoom-main-right-promptWindow">In the group chat</div>'
            + '<div class="chatRoom-main">'

            + '<div class="chatRoom-main-left">'
            + '<div class="chatRoom-main-aside"></div>'
            + '</div>'
            + '<div class="chatRoom-main-right">'
            + '<div class="chatRoom-main-messageArea"></div>'
            + "<form class='chatRoom-main-form'>"
            + "<input type='text' class='chatRoom-messageInput'/>"
            + "<input type='submit' value='send' class='chatRoom-sendBtn'/>"
            + "</form>"
            + '</div>'
            + '</div>'
            + '<div>',
            chat_extend_height: "85%",
            chat_retract_height: "4.5rem",
            chat_extend_time: 500,
            chat_retract_time: 500,
            chat_closed_pic: "-",
            chat_opened_pic: "+"
        },
        stateMap = {
            $container: null,
            is_chat_retracted: true,
            position_type: 'closed',
            present_user: null,
            avatar_url: "",
            present_hearer: "all"
        },
        jqueryMap = {};


    //begin DOM method
    var setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            $container: $container,
            $chat: $container.find('.chatRoom'),
            $chatRoom_control: $container.find('.chatRoom-head-control'),
            $sendBtn: $container.find('.chatRoom-sendBtn'),
            $message_input: $container.find('.chatRoom-messageInput'),
            $message_area: $container.find('.chatRoom-main-messageArea'),
            $chatRoom_aside: $container.find('.chatRoom-main-aside'),
            $chatRoom_head_title: $container.find('.chatRoom-head-title'),
            $chatRoom_promptWindow: $container.find('.chatRoom-main-right-promptWindow')


        };
    };
    //插入消息
    var createMessage = function (url, value, owner) {
        var $div = '';
        if (owner === stateMap.present_user) {
            $div = $('<div class="my-chatRoom-message"></div>');
            $div.html("<img class='myAvatar'  src=" + url + "><div class='chat-my-message'>" + value + "<span class='my-arrow'></span></div>");
        } else {
            $div = $('<div class="others-chatRoom-message"></div>');
            $div.html("<img class='othersAvatar'  src=" + url + "><div  class='chat-others-message'><span class='others-arrow'></span>" + value + "</div>");
        }
        return $div;
    };
    //更新提示窗口
    var updatePromptWindow = function (value) {
        jqueryMap.$chatRoom_promptWindow.empty().html(value);
        setTimeout(function () {
            if (stateMap.present_hearer !== "all") {
                jqueryMap.$chatRoom_promptWindow.empty().html("chat with " + stateMap.present_hearer);

            } else {
                jqueryMap.$chatRoom_promptWindow.empty().html("In the group chat");
            }
        }, 2000)
    };
    //end DOM method


    //begin event handler
    //点击聊天室收放按钮
    var clickChat = function () {
        if (model.user.get_present_User()) {
            if (!jqueryMap.$chat.is(":animated")) {
                if (stateMap.position_type === "closed") {
                    stateMap.position_type = "opened";
                    location.hash = '#opened';
                } else if (stateMap.position_type === "opened") {
                    stateMap.position_type = "closed";
                    location.hash = '#closed';
                }
                return false;
            }
        }
        return false;
    };
    //begin custom handlers
    //登录成功
    var onLogin = function (e, obj) {
        updateList(obj);
        if (obj.username !== model.user.get_present_User()) {
            updatePromptWindow(obj.username + "上线啦");
        } else {
            jqueryMap.$chat.addClass('show-flex-chatRoom');
            stateMap.present_user = obj.username;
        }
    };
    var onReceiveMessage = function (e, data) {
        console.log(data.avatarUrl);
        if (data.to === model.user.get_present_User()) {
            var $div = createMessage(data.avatarUrl, data.from + "对我说:" + data.msg, data.from);
            jqueryMap.$message_area.append($div);
        } else {
            var $div1 = createMessage(data.avatarUrl, data.from + "对所有人说:" + data.msg, data.from);
            jqueryMap.$message_area.append($div1);
        }
    };
    var onRobotMessage = function (e, data) {
        var $div = createMessage("", data, "TUTU");
        jqueryMap.$message_area.append($div);
    };
    var onOffline = function (e, data) {
        console.log(data.onlineList);
        updateList(data);
        if (stateMap.present_hearer === data.username) {
            stateMap.present_hearer = "all";
        }
        updatePromptWindow(data.username + "下线啦");
    };
    var onLogout = function () {
        jqueryMap.$chatRoom_control.html(configMap.chat_closed_pic);
        jqueryMap.$chat.css('height', configMap.chat_retract_height);
        jqueryMap.$chat.removeClass('show-flex-chatRoom');
    };
    //end custom handlers
    //点击发送消息按钮
    var clickSendBtn = function () {
        var to = stateMap.present_hearer;
        var inputValue = jqueryMap.$message_input.val();
        var $myMessageDiv = createMessage(stateMap.avatar_url, inputValue, model.user.get_present_User());
        jqueryMap.$message_area.append($myMessageDiv);
        model.user.send_message(inputValue, stateMap.$container, to);

        return false;
    };
    //双击在线人员列表
    var dblclickUserList = function () {
        var chatEE = $(this).find('span').html();
        jqueryMap.$chatRoom_promptWindow.empty().html("chat with " + chatEE);
        stateMap.present_hearer = chatEE;
    };
    var updateList = function (obj) {
        var list = obj.onlineList;
        console.log(obj.avatarList);
        var list_html = "";
        for (value in list) {
            if (value != model.user.get_present_User()) {
                list_html += "<div class='userList'><img  src=" + obj.avatarList[value] + "><span>" + value + "</span></div>"
            }
        }
        jqueryMap.$chatRoom_aside.empty().append(list_html);
    };
    //end event handler


    //begin public method
    var setSliderPosition = function (position_type) {
        var height_px, animate_time, control_pic;
        switch (position_type) {
            case "closed":
                control_pic = configMap.chat_opened_pic;
                height_px = configMap.chat_retract_height;
                animate_time = configMap.chat_retract_time;
                break;
            case 'opened':
                control_pic = configMap.chat_closed_pic;
                height_px = configMap.chat_extend_height;
                animate_time = configMap.chat_extend_time;
                break;
        }
        jqueryMap.$chatRoom_control.html(control_pic);
        jqueryMap.$chat.animate({height: height_px}, animate_time, function (callback) {
            if (callback) {
                callback(jqueryMap.$chat);
            }
        })
    };
    var configModule = function (data, url) {
        stateMap.present_user = data;
        stateMap.avatar_url = url;
    };
    var initModule = function ($container) {
        stateMap.$container = $container;
        $container.append(configMap.main_html);
        setJqueryMap();
        jqueryMap.$chatRoom_control.click(clickChat);
        jqueryMap.$sendBtn.click(clickSendBtn);
        stateMap.$container.bind('loginSuccess', onLogin);
        stateMap.$container.bind('receiveMessage', onReceiveMessage);
        stateMap.$container.bind('robotMessage', onRobotMessage);
        stateMap.$container.bind('offline', onOffline);
        stateMap.$container.bind("logout", onLogout);
        jqueryMap.$chatRoom_aside.delegate(".userList", "dblclick", dblclickUserList);
    };
    //end public method

    return {initModule: initModule, setSliderPosition: setSliderPosition, configModule: configModule};
});

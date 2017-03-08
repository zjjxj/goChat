/**
 * page.shell.js
 * Shell model for page
 */

/*jslint         browser : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */

define(['jquery','page.model','page.chatRoom'],function ($,model,chatRoom) {
    var configMap = {
        main_html: "<div class='shell-head'>" +
        "<div class='shell-head-initHead'>" +
        "<button id='shell-head-logIn'>登录</button>" +
        "<button id='shell-head-signIn'>注册</button>" +
        "</div>" +
        "<div class='shell-head-loginHead'>" +
        "<button id='shell-head-logOut'>登出</button>" +
        "<span class='shell-head-userName'>loading...</span>" +
        "</div>" +
        "<div class='shell-head-avatar'>" +
        "<input type='file' id='fileElem'  style='display:none'>" +
        "<img  id='uploadPreview' title='点击从本地上传头像' >" +
        "</div>" +
        "</div>"
        + "<div class='shell-main'><img src='../images/b.png' width='100%' height='100%'></div>"
        + "<div class='shell-footer'></div>"
        + "<div class='shell-modal'>" +
        "<div class='shell-modal-title'><span class='modal-title'>登录</span><div class='close-pic'><span class='glyphicon glyphicon-remove'></span></div></div>" +
        "<form class='shell-modal-logInform' >" +
        "<input type='text' placeholder='用户名' name='user[username]' class='logIn-username'><br/>" +
        "<input type='password' placeholder='密码' name='user[password]' class='logIn-password'><br/>" +
        "<button class='modal-logIn-btn'>登录</button>" +
        "<div class='login-callWord'></div>" +
        "</form>" +
        "<form class='shell-modal-signInform' action='/signIn' method='post'>" +
        "<input type='text' class='signIn-username' required placeholder='用户名（6-8位数字）' name='user[username]' pattern='[0-9]{6,8}' ><br/>" +
        "<input type='text' class='signIn-tel' required placeholder='手机号(11位)' name='user[tel]' pattern='[0-9]{11}'><br/>" +
        "<input type='password' class='signIn-password' required   placeholder='密码（6-8位数字）' name='user[password]' pattern='[0-9]{6,8}'><br/>" +
        "<button type='submit' class='modal-signIn-btn'>注册</button>" +
        "</form>"
        + "</div>"
        + "<div class='success-callWord'><span class='glyphicon glyphicon-ok-circle'>登录成功</span></div>"
        + "<div class='shade'></div>"

    };
    var stateMap = {
        $container: null,
        present_user: null,
        avatar_url: ""
    };
    var jqueryMap = {};

    //begin utility method
    //上传头像功能
    function FileUpload(file) {
        var xhr = new XMLHttpRequest();
        this.xhr = xhr;
        var fd = new FormData();
        xhr.open("POST", '/upload-Avatar');
        fd.append('myAvatar', file, stateMap.present_user);
        xhr.send(fd);
    }

    function handleFiles(files) {
        var oFReader = new FileReader();
        if (files.length === 0) {
            return;
        }
        var oFile = files[0];
        var fileType = oFile.type.slice(6);
        if (fileType === "png" || fileType === "jpeg") {
            oFReader.readAsDataURL(oFile);
            oFReader.onload = function (e) {
                jqueryMap.$avatar_img.attr("src", e.target.result);
                stateMap.avatar_url = e.target.result;
                page.chatRoom.configModule(stateMap.present_user, stateMap.avatar_url)
            };
            FileUpload(files[0]);
        } else {
            alert("上传失败,请上传jpg/png格式的头像！");
        }
    }

    //end utility method


    //begin DOM method
    var setJqueryMap = function () {
        var $container = stateMap.$container;
        jqueryMap = {
            //模态框控键
            $modal: $container.find('.shell-modal'),
            $modal_signIn_btn: $container.find(".modal-signIn-btn"),
            $modal_logIn_btn: $container.find(".modal-logIn-btn"),
            $modal_title: $container.find('.modal-title'),
            $modal_logIn: $container.find('.shell-modal-logInform'),
            $modal_signIn: $container.find('.shell-modal-signInform'),
            $modal_closeBtn: $container.find('.close-pic'),
            $modal_logIn_username: $container.find('.logIn-username'),
            $modal_logIn_password: $container.find('.logIn-password'),
            $modal_signIn_username: $container.find('.signIn-username'),
            $modal_signIn_tel: $container.find('.signIn-tel'),
            $modal_signIn_password: $container.find('.signIn-password'),
            //未登录时头部表单（登录注册）
            $initHead: $container.find(".shell-head-initHead"),
            $signIn_btn: $container.find('#shell-head-signIn'),
            $logIn_btn: $container.find('#shell-head-logIn'),
            //登录后头部表单（登出 用户名）
            $loginHead: $container.find(".shell-head-loginHead"),
            $logOut_btn: $container.find('#shell-head-logOut'),
            $head_logIn_username: $container.find(".shell-head-userName"),
            //头像
            $avatar: $container.find(".shell-head-avatar"),
            $avatar_fileElem: $container.find('#fileElem'),
            $avatar_img: $container.find('#uploadPreview'),
            //
            $login_callWord: $container.find(".login-callWord"),
            $success_callWord: $container.find(".success-callWord"),
            $shade: $container.find('.shade')

        }
    };
    var onLogInBtn=function () {
        jqueryMap.$modal.addClass('showElem');
        jqueryMap.$modal_title.text("登录");
        jqueryMap.$modal_logIn.removeClass('hideElem');
        jqueryMap.$modal_signIn.addClass('hideElem');
        jqueryMap.$shade.addClass('showElem');
    };
    var onSignInBtn=function () {
        jqueryMap.$modal.addClass('showElem');
        jqueryMap.$modal_title.text("注册");
        jqueryMap.$modal_logIn.addClass('hideElem');
        jqueryMap.$modal_signIn.removeClass('hideElem');
        jqueryMap.$shade.addClass('showElem');
    };
    var onModalCloseBtn=function () {
        jqueryMap.$modal_logIn_username.val("");
        jqueryMap.$modal_logIn_password.val("");
        jqueryMap.$login_callWord.html("");
        jqueryMap.$modal.removeClass('showElem');
        jqueryMap.$shade.removeClass('showElem');
    };
    var LogoutSuccess=function () {
        jqueryMap.$loginHead.removeClass("show-flex");
        jqueryMap.$initHead.removeClass("hideElem");
        jqueryMap.$head_logIn_username.html("loading...");
        stateMap.present_user = null;
        jqueryMap.$avatar.removeClass("showElem");
    };
    var LogInSuccess=function (obj) {
        jqueryMap.$loginHead.addClass("show-flex");
        jqueryMap.$modal_logIn_btn.html("登录");
        jqueryMap.$modal_logIn_btn.removeAttr("disabled");
        jqueryMap.$modal_logIn_username.val("");
        jqueryMap.$modal_logIn_password.val("");
        jqueryMap.$login_callWord.html("");
        jqueryMap.$initHead.addClass("hideElem");
        jqueryMap.$head_logIn_username.html(obj.username);
        jqueryMap.$modal.removeClass("showElem");
        jqueryMap.$shade.removeClass("showElem");
        jqueryMap.$success_callWord.fadeIn(50, function () {
            jqueryMap.$success_callWord.fadeOut(1000);
        });
        stateMap.present_user = obj.username;
        stateMap.avatar_url = obj.dataURI;
        jqueryMap.$avatar.addClass("showElem");
        jqueryMap.$avatar_img.attr("src", obj.dataURI);
        chatRoom.configModule(stateMap.present_user, obj.dataURI);
    };
    //end DOM method


    //begin event handler
    //路由控制
    var onHashChange = function () {
        if (model.user.get_present_User()) {
            if (location.hash === '#closed') {
                chatRoom.setSliderPosition('closed')
            } else if (location.hash === '#opened') {
                chatRoom.setSliderPosition('opened');
            }
        }
        if(location.hash === "#login"){
            onLogInBtn();
        }else if(location.hash === "#signIn"){
            onSignInBtn();
        }else if(location.hash === ""){
            LogoutSuccess();
        }
    };
    //begin head-form handlers
    var onLogInBtnClick = function () {
        location.hash = "#login";
    };
    var onSignInBtnClick = function () {
        location.hash = "#signIn";
    };
    var onLogOutBtnClick = function () {
        model.user.logout(stateMap.$container);
    };
    //end head form handlers
    //begin avatar handlers
    var onAvatarClick = function () {
        if (jqueryMap.$avatar_fileElem) {
            jqueryMap.$avatar_fileElem.click();
        }
        return false;
    };
    var onFileChange = function () {
        handleFiles(this.files);
    };
    //end avatar handlers
    //begin modal form handlers
    var onModalLoginBtn = function () {
        model.user.login(jqueryMap.$modal_logIn_username.val(), jqueryMap.$modal_logIn_password.val(), stateMap.$container);
        $(this).attr("disabled","disabled");
        $(this).html("登录中...");
        return false;
    };
    var onModalCloseBtnClick = function () {
        onModalCloseBtn();
        location.hash="";
    };
    var onModalFormFocus = function () {
        jqueryMap.$login_callWord.html("");
    };
    //end modal form handlers
    //begin Custom events handlers  响应服务器发布的事件
    //登出成功
    var onLogout = function () {
        location.hash = "";
    };
    //登录成功
    var onLogin = function (e, obj) {
        if (obj.username === model.user.get_present_User()) {
            LogInSuccess(obj);
            location.hash="#"+encodeURIComponent(obj.username);
        }

    };
    //服务器返回not found
    var onNotFound = function () {
        jqueryMap.$modal_logIn_btn.html("登录");
        jqueryMap.$modal_logIn_btn.removeAttr("disabled");
        if (jqueryMap.$login_callWord.html !== "用户名不存在！") {
            jqueryMap.$login_callWord.addClass('showElem');
            jqueryMap.$login_callWord.html("用户名不存在！");
        }
    };
    //服务器返回密码错误
    var onPasswordError = function () {
        jqueryMap.$modal_logIn_btn.html("登录");
        jqueryMap.$modal_logIn_btn.removeAttr("disabled");
        if (jqueryMap.$login_callWord.html !== "密码错误！") {
            jqueryMap.$login_callWord.addClass('showElem');
            jqueryMap.$login_callWord.html("密码错误！");
        }
    }
    //end Custom events handlers
    //end event handler


    //begin public method
    var initModule = function ($container) {
        stateMap.$container = $container;
        $container.html(configMap.main_html);
        //配置初始化 聊天室
        chatRoom.initModule($container);
        chatRoom.configModule(stateMap.present_user);
        setJqueryMap();
        //事件绑定
        jqueryMap.$modal_closeBtn.click(onModalCloseBtnClick);
        jqueryMap.$shade.click(onModalCloseBtnClick);
        jqueryMap.$modal_logIn_btn.click(onModalLoginBtn);
        jqueryMap.$logOut_btn.click(onLogOutBtnClick);
        jqueryMap.$modal_logIn.click(onModalFormFocus);
        jqueryMap.$signIn_btn.click(onSignInBtnClick);
        jqueryMap.$logIn_btn.click(onLogInBtnClick);
        jqueryMap.$avatar_fileElem.change(onFileChange);
        jqueryMap.$avatar_img.click(onAvatarClick);
        stateMap.$container.bind("logout", onLogout);
        stateMap.$container.bind('loginSuccess', onLogin);
        stateMap.$container.bind('notFound', onNotFound);
        stateMap.$container.bind("passwordError", onPasswordError);
    };
    //end public method


    $(window).bind('hashchange', onHashChange);

    return {initModule: initModule}
});

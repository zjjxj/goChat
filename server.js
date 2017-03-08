var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io").listen(server);
var mongoose = require("mongoose");
var fs = require('fs');
var request = require("request");
var bodyParser = require('body-parser');
var userModel = require("./lib/models/user");
var formidable = require('formidable');
var session = require('express-session');
var config = require('config-lite');
var indexRouter = require('./routes/index');
var signInRouter = require('./routes/signIn');
var uploadAvatarRouter = require('./routes/uploadAvatar');

app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', indexRouter);
app.use('/signIn', signInRouter);
app.use('/upload-Avatar', uploadAvatarRouter);
//404 page
app.use(function (req, res) {
    if (!res.headersSent) {
        res.redirect('404.html');
    }
});


mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var onlineList = {};  //在线人员
var socketList = {};  //所有连接
var avatarList = {};

io.on('connection', function (socket) {

    //监听登录
    socket.on('logIn', function (obj) {
        userModel.findByName(obj.username, function (err, user) {
            if (!user) {
                socket.emit("notFound", "gaga");
                console.log("user not found");
            } else {
                if (obj.password === user.password) {
                    if (!onlineList[obj.username]) {
                        onlineList[obj.username] = obj.username;
                    }
                    //标识连接对象
                    socketList[obj.username] = socket;
                    socket.name = obj.username;
                    //向所有人广播 io.sockets.emit('loginSuccess',{dataURI:dataURI,username:usename})
                    if (user.avatar) {
                        var filepath = user.avatar;
                        var buf = fs.readFileSync(filepath);
                        var base64Str = buf.toString('base64');
                        var dataURI = 'data:image/png;base64,' + base64Str;
                        avatarList[obj.username] = dataURI;
                        io.sockets.emit("loginSuccess", {
                            username: user._id,
                            dataURI: dataURI,
                            onlineList: onlineList,
                            avatarList: avatarList
                        });
                    } else {
                        avatarList[obj.username] = "";
                        io.sockets.emit("loginSuccess", {
                            username: user._id,
                            dataURI: "",
                            onlineList: onlineList,
                            avatarList: avatarList
                        });
                    }
                    console.log('login success')
                } else {
                    console.log("password error");
                    socket.emit("passwordError", user._id);
                }
            }
        })
    });

    //监听客户端发送的消息
    socket.on("ask", function (data) {
        var result = {from: data.from, to: data.to, msg: data.msg};
        var user_id = data.from;
        userModel.findByName(user_id, function (err, user) {
            if (!user) {
                console.log('error')
            } else {
                if (user.avatar) {
                    var filepath = user.avatar;
                    var buf = fs.readFileSync(filepath);
                    var base64Str = buf.toString('base64');
                    result.avatarUrl = 'data:image/png;base64,' + base64Str;
                }
                if (data.to === "TUTU") {
                    var key = "785ea9a572604e5d836f552321004698";
                    var value = encodeURIComponent(data.value);
                    var param = "key=" + key + "&info=" + value + "&userid=" + data.userid;
                    var options = {
                        method: 'GET',
                        url: 'http://www.tuling123.com/openapi/api?' + param
                    };
                    request(options, function (err, res, body) {
                        if (res) {
                            var responseObj = JSON.parse(body);
                            socket.emit("answer", responseObj.text);
                        } else {
                            console.log(err);
                        }
                    });
                } else if (data.to === "all") {
                    socket.broadcast.emit('say', result);
                } else {
                    for (client in socketList) {
                        if (client === data.to) {
                            socketList[client].emit('say', result);
                        }
                    }
                }
            }
        });
    });

    //监听有人下线
    socket.on('disconnect', function () {
        if (onlineList[socket.name]) {
            delete onlineList[socket.name];
            socket.broadcast.emit('offline', {onlineList: onlineList, username: socket.name});
        }
    });

});

server.listen(process.env.PORT || config.port);


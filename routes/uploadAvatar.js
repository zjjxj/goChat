var express = require('express');
var router = express.Router();
var fs=require('fs');
var formidable = require('formidable');
var userModel = require("../lib/models/user");


router.post('/',function (req,res) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';//设置编辑
    form.uploadDir = 'public' + '/images/avatar/';//设置上传目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        var extName = '';  //后缀名
        switch (files.myAvatar.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        var avatarName = files.myAvatar.name + '.' + extName;
        var newPath = form.uploadDir + avatarName;
        fs.renameSync(files.myAvatar.path, newPath);  //重命名
        userModel.findByName(files.myAvatar.name,function(err,user){
            if(!user){
                console.log("error")
            }else{
                user.avatar=newPath;
                user.save(function(err){
                    console.log(err);
                });
                console.log("save success")
            }
        });
        res.end();
    });
});

module.exports=router;
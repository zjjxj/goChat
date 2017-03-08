var express = require('express');
var router = express.Router();
var userModel = require("../lib/models/user");


router.post("/",function(req,res){
    var _user= req.body.user;
    var user = new userModel({
        _id:_user.username,
        password:_user.password,
        tel:_user.tel,
        avatar:""
    });
    user.save(function(err){
        console.log(err);
    });
   
    res.redirect("/");
});

module.exports=router;
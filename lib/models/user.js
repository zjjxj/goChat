var mongoose = require('mongoose');
var userSchema = require("../schemas/user");
var userModel = mongoose.model('userModel',userSchema);

module.exports=userModel;

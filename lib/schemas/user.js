var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    _id:String,
    tel:String,
    password:String,
    avatar:String,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
});
userSchema.statics ={
    findByName:function(username, cb){
        return this
            .findOne({_id:username})
            .exec(cb)
    }
}
module.exports = userSchema;
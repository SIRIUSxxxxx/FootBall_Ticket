//22031515D Fok Luk Hang
//22026938D Poon Cheuk Kit

const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    gender:{
        type: String,
        required: true
    },
    nickname:{
        type: String,
    },
    birthday:{
        type: String,
        required: true
    },
    profileImage: {  
        type: String,
    }
}, {
    timestamps : true,
})

const userModel = mongoose.model('users' , userSchema);

module.exports = userModel;
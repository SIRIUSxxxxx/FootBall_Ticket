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
    profileImage: {  // New field to store profile image URL
        type: String,
    }
}, {
    timestamps : true,
})

const userModel = mongoose.model('users' , userSchema);

module.exports = userModel;
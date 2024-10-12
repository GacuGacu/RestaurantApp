const mongoose = require("mongoose");
//scheme definitions very useful to create a user
const UserDetailSchema = new mongoose.Schema({
    username:{type:String, unique:true},
    email:{type:String, unique:true},
    password:String,
    friends: [String] ,// Array of strings for friends
    currentRequests: [String],
}, {
    collection:"UserInfo"
})

  

mongoose.model("UserInfo", UserDetailSchema);
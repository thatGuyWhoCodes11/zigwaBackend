require("dotenv").config()
const mongo=require("mongoose")
mongo.connect(process.env.mongoUri)
const usersSchema=new mongo.Schema({
    username:{required:true,type:String,unique:true},
    password:{required:true,type:String},
    balance:{type:String},
    dateOfBirth:{required:true,type:String},
    userType:{required:true,type:String}
})
const locationsSchema=new mongo.Schema({
    location:String,
})
const users=new mongo.model("zigwa users",usersSchema)
const locations=new mongo.model("locations",locationsSchema)
module.exports={users,locations}
require("dotenv").config()
const mongo=require("mongoose")
mongo.connect(process.env.mongoUri)
const myschema=new mongo.Schema({
    username:{required:true,type:String,unique:true},
    password:{required:true,type:String},
    balance:{type:String},
    dateOfBirth:{required:true,type:String},
    userType:{required:true,type:String}
})
module.exports=new mongo.model("zigwa users",myschema)
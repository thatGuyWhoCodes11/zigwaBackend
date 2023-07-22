require("dotenv").config()
const express=require("express")
const myDb=require("./mongo")
const app=express()

let Cusername
app.use(express.urlencoded({extended:true}),express.json())
app.route("/").get((req,res)=>{
    res.send("zigwa starters")
})
app.route("/register").post(async(req,res,next)=>{
    const {username,password,dateOfBirth,userType}=req.body
    await myDb.findOne({username:username}).then(async user=>{
        if(user){
            res.json({status:"the user already exists",errorCode:"1"})
            next(null,null)
        }
        else{
            await myDb.insertMany({username:username,password:password,dateOfBirth:dateOfBirth,userType:userType}).then((stat=>res.json({status:"success",errorCode:"0"})))
        }
    })
})
app.route("/login").post((req,res)=>{
    const {username,password}=req.body
    myDb.findOne({username:username}).then(user=>{
        if(!user){
            res.json({status:"user is not registered",errorCode:"2"})
        }
        else{
            if(user.password != password){
                res.json({status:"passwords don't match",errorCode:"3"})
            }
            else{
                res.json({status:"success",errorCode:"0",userType:user.userType})
            }
        }
        
    })
})
app.listen(9000)

//everything done but remains dateOfBirth userType balance to be procesed in register route
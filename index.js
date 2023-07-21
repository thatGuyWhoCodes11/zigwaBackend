require("dotenv").config()
const express=require("express")
const myDb=require("./mongo")
const app=express()

let Cusername
app.use(express.urlencoded({extended:true}),express.json())
app.route("/").get((req,res)=>{
    res.send("zigwa starters")
})
app.route("/register").post(async(req,res)=>{
    const {username,password}=req.body
    await myDb.findOne({username:username}).then(user=>{
        if(user){
            res.json({error:"the user already exists"})
            res.redirect("/")
        }
    })
    Cusername=username
    await myDb.insertMany({username:username,password:password})
})
app.route("/login").post((req,res)=>{
    const {username,password}=req.body

})
app.listen(9000)

//everything done but remains dateOfBirth userType balance to be procesed in register route
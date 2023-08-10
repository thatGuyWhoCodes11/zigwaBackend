require("dotenv").config()
const express = require("express")
const myDb = require("./mongo")
const app = express()
const cors = require("cors")
const multer = require("multer")
const fs = require("fs")

//setting up multer
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

let Cusername
app.use(express.urlencoded({ extended: false }), express.json(), cors())
app.route("/").get((req, res) => {
    res.send("zigwa starters")
})
//route to handle user register
app.route("/register").post(upload.single('image'),async (req, res) => {
    const { name,username, password, dateOfBirth, userType, phoneNumber } = req.body
    console.log(req.body)
    await myDb.users.findOne({ username: username }).then(async user => {
        if (user) {
            res.json({ status: "data already exists", errorCode: "1" })
        }
        else {
            await myDb.users.insertMany({ name:name,username: username, password: password, dateOfBirth: dateOfBirth, userType: userType, phoneNumber:phoneNumber }).then((stat => res.json({ status: "success", errorCode: "0" }))).catch((err)=>{res.json({err})})
        }
    }).catch((err)=>{res.json({err})})
}).get((req, res) => {
    res.sendFile(__dirname + '/test.html')
})
app.route("/login").post(upload.single('image'),(req, res) => {
    const { username, password } = req.body
    myDb.users.findOne({ username: username }).then(user => {
        if (!user) {
            res.json({ status: "not found", errorCode: "2" })
        }
        else {
            if (user.password != password) {
                res.json({ status: "passwords don't match", errorCode: "3" })
            }
            else {
                res.json({ status: "success", errorCode: "0", userData: user })
                Cusername = user.username
            }
        }

    }).catch((err)=>{res.json({err})})
}).get((req, res) => {
    res.sendFile(__dirname + '/test2.html')
})
app.post("/location", upload.single('image'), (req, res) => {
    if (!Cusername) {
        res.json({ errorCode: "4", status: "user not registered" })
    } else {
        myDb.images.insertMany({ username: Cusername, image_name: Date.now(), buffer: req.body.image, location: req.body.location }).then((doc) => {
            if (!doc) {
                res.json({ status: "internal error" })
            } else {
                res.json({ errorCode: 0, status: 'success' })
            }
        }).catch((err) => {
            res.json({ status: err })
        })
    }
})
app.get("/location", (req, res) => {
    myDb.images.find({}).then((doc) => {
        if (!doc) {
            res.json({ error: 2, status: "not found" })
        } else {
            res.json({ errorCode: 0, status: "success", doc })
        }
    }).catch((err)=>{res.json({err})})
})
app.listen(process.env.PORT)
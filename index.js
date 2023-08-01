require("dotenv").config()
const express = require("express")
const myDb = require("./mongo")
const app = express()
const cors = require("cors")
const multer = require("multer")
const fs = require("fs")

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

let Cusername
app.use(express.urlencoded({ extended: true }), express.json(), cors())
app.route("/").get((req, res) => {
    res.send("zigwa starters")
})
app.route("/register").post(async (req, res, next) => {
    const { username, password, dateOfBirth, userType,phoneNumber } = req.body
    await myDb.users.findOne({ username: username }).then(async user => {
        if (user) {
            res.json({ status: "data already exists", errorCode: "1" })
        }
        else {
            await myDb.users.insertMany({ username: username, password: password, dateOfBirth: dateOfBirth, userType: userType, phoneNumber:phoneNumber }).then((stat => res.json({ status: "success", errorCode: "0" })))
        }
    })
}).get((req, res) => {
    res.sendFile(__dirname + '/test.html')
})
app.route("/login").post((req, res) => {
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
                res.json({ status: "success", errorCode: "0", userType: user.userType })
                Cusername = user.username
            }
        }

    })
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
    const { location } = req.query
    myDb.images.find({ location: location }).then((doc) => {
        if (!doc) {
            res.json({ error: 2, status: "not found" })
        } else {
            res.json({ errorCode: 0, status: "success", doc })
        }
    })
})
app.listen(process.env.PORT)
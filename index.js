require("dotenv").config()
const express = require("express")
const myDb = require("./mongo")
const app = express()
const cors = require("cors")

let Cusername
app.use(express.urlencoded({ extended: true }), express.json(), cors())
app.route("/").get((req, res) => {
    res.send("zigwa starters")
})
app.route("/register").post(async (req, res, next) => {
    const { username, password, dateOfBirth, userType } = req.body
    await myDb.users.findOne({ username: username }).then(async user => {
        if (user) {
            res.json({ status: "data already exists", errorCode: "1" })
        }
        else {
            await myDb.users.insertMany({ username: username, password: password, dateOfBirth: dateOfBirth, userType: userType }).then((stat => res.json({ status: "success", errorCode: "0" })))
        }
    })
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
})
app.route("/Locations").post((req, res) => {
    const { location, username } = req.body
    myDb.users.findOne({ username: username }, (doc) => {
        if (!doc) {
            res.json({ errorCode: 2, status: "not found" })
        } else {
            myDb.locations.insertMany({ location: location }, (doc) => {
                doc._id = username
                res.json({ errorCode: 0, status: "success" })
            })
        }
    })
})
app.listen(process.env.PORT)
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
app.route("/register").post(upload.single('image'), async (req, res) => {
    const { name, username, password, dateOfBirth, userType, phoneNumber } = req.body
    console.log(req.body)
    await myDb.users.findOne({ username: username }).then(async user => {
        if (user) {
            res.json({ status: "data already exists", errorCode: "1" })
        }
        else {
            await myDb.users.insertMany({ name: name, username: username, password: password, dateOfBirth: dateOfBirth, userType: userType, phoneNumber: phoneNumber }).then((stat => res.json({ status: "success", errorCode: "0" }))).catch((err) => { res.json({ err }) })
        }
    }).catch((err) => { res.json({ err }) })
}).get((req, res) => {
    res.sendFile(__dirname + '/test.html')
})
app.route("/login").post(upload.single('image'), (req, res) => {
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

    }).catch((err) => { res.json({ err }) })
}).get((req, res) => {
    res.sendFile(__dirname + '/test2.html')
})
app.route("/location").post(upload.single('image'), (req, res) => {
    if (!Cusername) {
        res.json({ errorCode: "4", status: "user not registered" })
    } else {
        myDb.images.insertMany({ username: Cusername, image_name: Date.now(), buffer: req.body.image, location: JSON.parse(req.body.location) }).then((doc) => {
            if (!doc) {
                res.json({ status: "internal error" })
            } else {
                res.json({ errorCode: 0, status: 'success' })
            }
        }).catch((err) => {
            res.json({ status: err })
        })
    }
}).get((req, res) => {
    const {image_name}=req.query
    const query=image_name ? {image_name:image_name} : {}
    console.log(query)
    myDb.images.find(query).then((doc) => {
        if (!doc) {
            res.json({ error: 2, status: "not found" })
        } else {
            res.json({ errorCode: 0, status: "success", doc })
        }
    }).catch((err) => { res.json({ err }) })
}).delete((req, res) => {
    const { latitude } = req.query
    myDb.images.deleteMany({ 'location.latitude': latitude }).then(() => res.json({ errorCode: 0, status: 'success' })).catch((err) => res.json({ error: err }))
})
app.route('/transactions').post(upload.single('image'), (req, res) => {
    let { status, collectorUsername, citizenUsername, collectorLocation, citizenLocation,image_name } = req.body
    collectorLocation = JSON.parse(collectorLocation)
    citizenLocation = JSON.parse(citizenLocation)
    myDb.transactions.insertMany({ image_name:image_name,status: status, collectorLocation: collectorLocation, citizenUsername: citizenUsername, collectorUsername: collectorUsername, citizenLocation: citizenLocation }).then((doc) => {
        if (doc) {
            res.json({ errorCode: 0, status: 'success', userData: doc })
        } else
            res.json({})
    }).catch((err) => { res.json({ error: err }) })
}).get((req, res) => {
    const { citizenUsername } = req.query
    let searchParams = citizenUsername ? { citizenUsername: citizenUsername } : {}
    myDb.transactions.find(searchParams).then((doc) => {
        if (doc)
            res.json({ errorCode: 0, status: 'success', userData: doc })
        else
            res.json({ status: 'error' })
    }).catch((err) => { res.json({ error: err }) })
}).put((req, res) => {
    const { updatedStatus, id } = req.query
    myDb.transactions.findByIdAndUpdate(id, { $set: { status: updatedStatus } }).then(() => {
        res.json({ errorCode: 0, status: 'success!' })
    }).catch((err) => {
        console.log(err)
        res.json({ error: 'something went wrong' })
    })
})
app.route('/ignore').post(upload.single('image'), (req, res) => {
    const { imageName, collectorUsername } = req.body;
    myDb.ignores.insertMany({ imageName: imageName, collectorUsername: collectorUsername }).then((doc) => {
        if (doc) {
            res.json({ errorCode: 0, status: 'success' })
        } else {
            res.json({ error: 'something went wrong!' })
        }
    }
    ).catch((err) => {
        console.log(err)
        res.json({ error: err })
    })
}).get((req, res) => {
    const { imageName, collectorUsername } = req.query
    myDb.ignores.findOne({ imageName: imageName, collectorUsername: collectorUsername }).then((doc) => {
        console.log(doc)
        if (doc) {
            res.json({ errorCode: 0, status: 'image does exist!' })
        } else {
            res.json({ status: 'image doesn\'t exist!' })
        }
    }).catch((err) => {
        console.log(err)
        res.json({ error: err })
    })
})
app.route('/notifications').post((req,res)=>{
    const {citizenUsername,collectorUsername,image_name,descripition}=req.body
    myDb.scrapDealerNotif.insertMany({citizenUsername:citizenUsername,collectorUsername:collectorUsername,image_name:image_name,descripition:descripition}).then((doc)=>{
        if(doc){
            res.json({errorCode:0,status:'success!',userData:doc})
        }else
            res.json({status:'no such thing got stored'})
    }).catch((err)=>{console.log(err);res.json({err:'an error happned! check clever cloud console'})})
}).get((req,res)=>{
    myDb.scrapDealerNotif.find({}).then((doc)=>{
        if(doc)
            res.json({errorCode:0,status:'success!',userData:doc})
        else
            res.json({status:'empty, :skull:'})
    }).catch((err)=>{res.json('something went wrong!');console.log(err)})
})
app.listen(process.env.PORT)

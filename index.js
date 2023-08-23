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
            await myDb.users.insertMany({ name: name, username: username, password: password, dateOfBirth: dateOfBirth, userType: userType, phoneNumber: phoneNumber, credits: '0' }).then((stat => res.json({ status: "success", errorCode: "0" }))).catch((err) => { res.json({ err }) })
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
    const { image_name } = req.query
    const query = image_name ? { image_name: image_name } : {}
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
    let { status, collectorUsername, citizenUsername, collectorLocation, citizenLocation, image_name } = req.body
    collectorLocation = JSON.parse(collectorLocation)
    citizenLocation = JSON.parse(citizenLocation)
    myDb.transactions.insertMany({ image_name: image_name, status: status, collectorLocation: collectorLocation, citizenUsername: citizenUsername, collectorUsername: collectorUsername, citizenLocation: citizenLocation }).then((doc) => {
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
app.route('/notifications').post(upload.single('image'), (req, res) => {
    const { citizenUsername, collectorUsername, image_name, description } = req.body
    myDb.scrapDealerNotif.insertMany({ citizenUsername: citizenUsername, collectorUsername: collectorUsername, image_name: image_name, description: description }).then((doc) => {
        if (doc) {
            res.json({ errorCode: 0, status: 'success!', userData: doc })
        } else
            res.json({ status: 'no such thing got stored' })
    }).catch((err) => { console.log(err); res.json({ err: 'an error happned! check clever cloud console' }) })
}).get((req, res) => {
    myDb.scrapDealerNotif.find({}).then((doc) => {
        if (doc)
            res.json({ errorCode: 0, status: 'success!', userData: doc })
        else
            res.json({ status: 'empty, :skull:' })
    }).catch((err) => { res.json('something went wrong!'); console.log(err) })
}).put((req, res) => {
    const { _id, completed } = req.query
    if (completed) {
        myDb.scrapDealerNotif.updateOne({ _id: _id }, { $set: { completed: 'yes' } }).then(() => {
            res.json({ errorCode: 0 })
        }).catch((err) => { console.log(err); res.json({ error: 'an error happened!' }) })
    }
    else {
        myDb.scrapDealerNotif.updateOne({ _id: _id }, { $set: { accepted: 'yes' } }).then(() => {
            res.json({ errorCode: 0 })
        }).catch((err) => { console.log(err); res.json({ error: 'an error happened!' }) })
    }
})
app.route('/collectorNotif').post(upload.single('image'), (req, res) => {
    const { scrapUsername, address } = req.body
    myDb.collectorNotifications.insertMany({ scrapUsername: scrapUsername, address: address }).then((doc) => {
        if (doc)
            res.json({ errorCode: 0, status: 'success!!!!' })
        else
            res.json({ status: 'error' })
    }).catch((err) => {
        console.log(err)
        res.json({ status: 'internal error' })
    })
}).get((req, res) => {
    myDb.collectorNotifications.find({}).then((doc) => {
        if (doc) {
            res.json({ errorCode: 0, status: 'success', userData: doc })
        }
        else
            res.json({ status: 'error' })
    }).catch((err) => {
        res.json({ status: 'error' })
    })
})
app.put('/updateCredits', async (req, res) => {
    let { credits, citizenUsername, collectorUsername } = req.query
    if (citizenUsername && collectorUsername) {
        if (typeof credits == 'string') {
            credits = JSON.parse(credits)
        }
        let citizenCredits = 0.25 * credits
        let collectorCredits = 0.75 * credits
        try {
            let doc = await myDb.users.updateOne({ username: citizenUsername }, { $inc: { credits: citizenCredits } })
            let doc2 = await myDb.users.updateOne({ username: collectorUsername }, { $inc: { credits: collectorCredits } })
            if (doc && doc2)
                res.json({ errorCode: 0, status: 'success' })
        }
        catch (e) {
            console.log(e)
        }
    }
    else {
        res.json({ status: 'make sure you included a credits,citizenUsername,collectorUsername' })
    }
})
app.put('/updateStatus', (req, res) => {
    const { status, _id } = req.query
    console.log(status, _id)
    myDb.transactions.updateOne({ _id: _id }, { $set: { status: status } }).then(() => res.json({ errorCode: 0, status: 'success!' })).catch((err) => { console.log(err); res.json({ status: 'something went wrong!' }) })
})
app.route('/wrapUp').delete((req, res) => {
    const { image_name } = req.query
    myDb.images.deleteMany({ image_name: image_name }).then(() => {
        myDb.scrapDealerNotif.deleteMany({ image_name: image_name }).then(()=>{
            res.json({errorCode:0,status:'success!'})
        })
    })
})
app.listen(process.env.PORT)

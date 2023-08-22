require("dotenv").config()
const mongo = require("mongoose")
mongo.connect(process.env.mongoUri)
const usersSchema = new mongo.Schema({
    name:String,
    username: { required: true, type: String, unique: true },
    password: { required: true, type: String },
    balance: { type: String },
    dateOfBirth: { required: true, type: String },
    userType: { required: true, type: String },
    phoneNumber: { required: true, type: String },
    credits:Number
})
const imagesSchema = new mongo.Schema({
    username: String,
    image_name: String,
    location: mongo.Schema.Types.Mixed,
    buffer: String
})
const transactionSchema=new mongo.Schema({
    image_name:String,
    status:String,
    collectorUsername:String,
    citizenUsername:String,
    collectorLocation:mongo.Schema.Types.Mixed,
    citizenLocation:mongo.Schema.Types.Mixed,
})
const ignoreListSchema=new mongo.Schema({
    collectorUsername:String,
    imageName:String
})
const scrapDealerNotifSchema=new mongo.Schema({
    citizenUsername:String,
    collectorUsername:String,
    image_name:String,
    accepted:String,
    description:String,
    completed:String
})
const collectorNotificationsSchema=new mongo.Schema({
    scrapUsername:String,
    address:String
})
const collectorNotifications=new mongo.model('collectorNotif',collectorNotificationsSchema)
const scrapDealerNotif=new mongo.model('scrapDealerNotif',scrapDealerNotifSchema)
const transactions=new mongo.model('transactions',transactionSchema)
const images = new mongo.model("images", imagesSchema)
const users = new mongo.model("zigwa users", usersSchema)
const ignores=new mongo.model('ignoreList',ignoreListSchema)
module.exports = { images, users,transactions,ignores,scrapDealerNotif,collectorNotifications}
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
    phoneNumber: { required: true, type: String }
})
const imagesSchema = new mongo.Schema({
    username: String,
    image_name: String,
    location: String,
    buffer: String
})
const transactionSchema=new mongo.Schema({
    status:String,
    collectorUsername:String,
    citizenUsername:String,
    collectorLocation:mongo.Schema.Types.Mixed,
    citizenLocation:mongo.Schema.Types.Mixed,
})
const transactions=new mongo.model('transactions',transactionSchema)
const images = new mongo.model("images", imagesSchema)
const users = new mongo.model("zigwa users", usersSchema)
module.exports = { images, users,transactions }
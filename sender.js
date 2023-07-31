const axios = require('axios')
const multer = require("multer")
const fs = require("fs")

fs.readFile('uploads/RDT_20230723_235902396989507195948016.png','base64', (err, data) => {
  if(err){
    console.log(err)
    return
  }
  const formData=new FormData()
  formData.append('image',data)
  axios.post('http://localhost:9000/image',formData).then((res)=>{console.log(res.data)})
 })
const axios=require('axios')
const formData=new FormData
formData.append('username','123')
fetch('https://zigwa.cleverapps.io/login', { method:"post",headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData }).then((res) => {
            res.json().then((data)=>console.log(data))
        }).catch((err)=> console.log(err) )
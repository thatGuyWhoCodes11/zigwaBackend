const express=require('express')
const app=express()

app.get('/',(req,res)=>{
    res.send('welcome to test site!')
})
app.listen(3000)
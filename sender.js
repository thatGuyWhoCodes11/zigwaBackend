(async ()=>{
    let params={
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username:"patchy",password:"piratesarethebest"})
    }
    let data=await fetch("http://localhost:9000/login",params)
    data=await data.json()
    console.log(data)
})()
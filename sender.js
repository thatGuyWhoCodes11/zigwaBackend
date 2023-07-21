(async ()=>{
    let params={
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({username:"patchy",password:"piratesarethebest"})
    }
    await fetch("http://localhost:9000/register",params)
})()
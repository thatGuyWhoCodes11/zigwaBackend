const axios = require("axios");

(async () => {
    const res=await axios.get('https://media.tenor.com/StMcxdC56MMAAAAC/cat.gif')
    console.log(res.data)
})()
const axios = require("axios");

(async () => {
    const formData = new FormData()
    formData.append('status', 'accepted - onGoing')
    formData.append('collectorLocation', `{"latitude":${123},"longitude":${124}}`)
    formData.append('citizenLocation', `{"latitude":${123},"longitude":${123}}`)
    formData.append('citizenUsername', 'mohmammad')
    formData.append('collectorUsername', 'ahmed')
    axios.post('http://localhost:9000/transactions', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
})()


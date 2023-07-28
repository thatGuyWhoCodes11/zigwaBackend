sendCreds = async () => {
  let params = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ username: 'ahmad', password: 'xxAxx' }),
  };
  let data = await fetch('https://zigwa.cleverapps.io/login', params);
  return data =await data.json();
};
let data=sendCreds().then((data)=>{console.log(data)})
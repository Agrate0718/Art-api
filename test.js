// require('dotenv').config()
// const express = require('express')
// const ejsLayouts = require('express-ejs-layouts')
// const cookieParser = require('cookie-parser')
// const db = require('../Art-api/models')
// const crypto = require('crypto-js')
// const axios = require('axios')
// const app = express()

// axios.get(https://api.artic.edu/api/v1/artworks)
//         .catch(console.log)

        const axios = require('axios');

async function makeRequest() {

    const config = {
        method: 'get',
        url: 'https://api.artic.edu/api/v1/artworks/search?q=cats'
    }

    let res = await axios(config)

    console.log(res.status);
}

console.log(makeRequest());
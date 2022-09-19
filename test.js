require('dotenv').config()
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const db = require('../Art-api/models')
const crypto = require('crypto-js')
const axios = require('axios')
const app = express()

// axios.get('https://api.artic.edu/api/v1/artworks/search?q=cats')
//         .then(response => {
//             Id = response.data.ObjectIDs
//             console.log(Id)
//             Id.forEach(d => {
//                 axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${d}`)
//             .then(response => {
//                 console.log(response)
//             })
//             .catch(console.log)
//         })
//     })
        


axios.get('https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=sunflower')
        .then(response => {
            console.log(response)
            js = response.data.objectIDs
            console.log(js)
           js.forEach(d => {
              axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${d}`)
                .then(response => {
                    console.log(response.data.title)
                })
           }) 
        })

        


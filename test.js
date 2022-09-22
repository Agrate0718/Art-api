// require('dotenv').config()
// const express = require('express')
// const ejsLayouts = require('express-ejs-layouts')
// const cookieParser = require('cookie-parser')
// const db = require('../Art-api/models')
// const crypto = require('crypto-js')
// const axios = require('axios')
// const app = express()

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
        
// https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${req.query.movieSearch}
// ${req.query.movieSearch}
// axios.get('https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=sunflower')
//         .then(response => {
//             console.log(response)
//             js = response.data.objectIDs
//             console.log(js)
            
//            js.forEach(d => {
//               axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${d}`)
//                 .then(response => {
//                     const datam = [];
//                     datam.push(response)
//                     console.log(response.data.title)
//                     console.log(datam)
//                 })

//            }) 
//         })
        // a = [1,2,3,4,5,6]
        // b = []
        // console.log(a,'before the test',b)

        // a.forEach(c => {
        //     b.push(c);
        // })
        // console.log(a,'after the test',b)

        let nums = ['jack', 2, 3, 5];
        let exmple = []
for (let i = 0; i < nums.length; i++){
	console.log(nums[i]);
        exmple.push(nums[i])
         
}  
console.log(exmple, 'this is nums',)
console.log('apple')
exmple.forEach(consol => {
        console.log(consol)
})
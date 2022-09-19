// required packages
require('dotenv').config()
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const db = require('../Art-api/models')
const crypto = require('crypto-js')
const axios = require('axios')

console.log('server secret:', process.env.ENC_SECRET)

// config express app/middlewares
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// our custom auth middleware
app.use(async (req, res, next) => {
    // console.log('hello from a middleware 👋')
    // if there is a cookie on the incoming request
    if (req.cookies.userId) {
        // decrypt the user id before we look up the user in the db
        const decryptedId = crypto.AES.decrypt(req.cookies.userId.toString(), process.env.ENC_SECRET)
        const decryptedIdString = decryptedId.toString(crypto.enc.Utf8)
        // look up the user in the db
        const user = await db.user.findByPk(decryptedIdString)
        // mount the user on the res.locals
        res.locals.user = user
    // if there is no cookie -- set the user to be null in the res.locals
    } else {
        res.locals.user = null
    }
    // move on to the next route or middleware in the chain
    next()
})



// route definitions
app.get('/', (req, res) => {
    // console.log('incoming cookie 🍪', req.cookies)
    // console.log(res.locals.myData)
    console.log('the currently logged in user is:', res.locals.user)
    res.render('home.ejs')
})

app.get('/users/search', (req,res) => {
    res.render('users/search.ejs')
})

// app.get('/results', (req, res) => {
//     axios.get(`http://www.omdbapi.com/?s=${req.query.movieSearch}&apikey=${process.env.OMDB_API_KEY}`)
//       .then(response => {
//         res.render('results.ejs', { movies: response.data.Search })
//       })
//       .catch(console.log, 'apple')
//   })

app.get('/results', (req, res) => {
    axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${req.query.movieSearch}`)
    .then(response => {
        // res.render('results.ejs',{ movies: response.data.objectIDs })
        Id = response.data.objectIDs
        console.log(Id)
        Id.forEach(d => {
            axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${d}`)
        .then(response => {
            res.render('results.ejs',{movies: response.data.title})
        })
        .catch(console.log)
        })
        })
        .catch(console.log)
})

// Controllers
app.use('/users', require('../Art-api/controllers/users'))

// listen on a port
app.listen(PORT, () => console.log(`you or your loved ones may be entitled to compensation on port: ${PORT}`))
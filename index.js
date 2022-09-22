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

app.get('/results', (req, res) => {
    axios.get(`http://www.omdbapi.com/?s=${req.query.movieSearch}&apikey=${process.env.OMDB_API_KEY}`)
      .then(response => {
        res.render('results.ejs', { movies: response.data.Search })
      })
      .catch(console.log, 'apple')
  })

  app.get('/details/:id', (req, res) => {
    console.log(req.params.id)
    axios.get(`http://www.omdbapi.com/?i=${req.params.id}&apikey=${process.env.OMDB_API_KEY}`)
      .then(response => {
        console.log(response.data)
        res.render('users/detail.ejs', { movie: response.data })
      })
      .catch(console.log)
  })

  // GET /saved -- READ all saved and display them to the user
app.get('/users/profile', async (req, res) => {
    try {
        const user = await db.user.findOne({
            where: { email: res.locals.user.email }

         })
            const userSaved = await user.getSaved()
            
            const allComments = await db.comment.findAll()

      res.render('users/profile.ejs', { userSaved, allComments})
    } catch(err) {
      console.log(err)
      res.send('server error')
    }
})
// POST /saved -- CREATE new save and redirect to /saved to display user saved
app.post('/users/profile', async (req, res) => {
    try {
        const save = await db.save.findOrCreate({
            where: {
                title: req.body.title,
                imdbid: req.body.imdbid,
                poster: req.body.poster
            }
        })
        const user = await db.user.findOne({
            where: {
                email: res.locals.user.email
            }
        })
        await user.addSave(save)
        res.redirect('/users/profile')
    } catch(err) {
      console.log(err)
      res.send('server error')
    }
  })

  // route to delete saved movies
app.delete('user/profile/:id', async (req,res) => {
    try {

        const deleteUserSaved = await db.save.destroy({
            where: { id: req.params.id }
        })
       
        res.redirect('user/profile')
    } catch(err){
        console.log(err)
    }
})

// route to delete comments
app.delete('user/profile/:id', async (req,res) => {
    try {
  
         const getUser = await db.user.findOne({
            where: { email: res.locals.user.email }
        })
        // once you set on your action <%= comment.id %> the id on your rout changes to that!
        const deleteComment = await db.comment.destroy({
            where: { commentId: req.params.id,
                     userId: getUser.id}
  
        })
       
        res.redirect('user/profile')
    } catch(err){
        console.log(err)
    }
  })

      
// Controllers
app.use('/users', require('../Art-api/controllers/users'))

// listen on a port
app.listen(PORT, () => console.log(`you or your loved ones may be entitled to compensation on port: ${PORT}`))
// Id.forEach(d => {
        //     axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${d}`)
        //     .then(response => {
        //     artwork.push(response.data.objectID)
        //     res.render('results.ejs',{artworks: artwork})
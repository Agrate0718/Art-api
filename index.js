// required packages
require('dotenv').config()
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const db = require('../project2/models')
const crypto = require('crypto-js')
const { default: axios } = require('axios');
const methodOverride = require('method-override')

console.log('server secret:', process.env.ENC_SECRET)
// config express app/middlewares
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('morgan')('dev'));
app.use(methodOverride('_method'));
// our custom auth middleware
app.use(async (req, res, next) => {
    // console.log('hello from a middleware 👋')
    // if there is a cookie on the incoming request
    if (req.cookies.userId) {
        // decrypt the user id before we look up the user in the db
        const decryptedid = crypto.AES.decrypt(req.cookies.userId.toString(), process.env.ENC_SECRET)
        const decryptedidString = decryptedid.toString(crypto.enc.Utf8)
        // look up the user in the db
        const user = await db.user.findByPk(decryptedidString)
        // mount the user on the res.locals
        res.locals.user = user
    // if there is no cookie -- set the user to be null in the res.locals
    } else {
         res.locals.user = null
    }
    // move on to the next route or middleware in the chain
    next()
})


const hello = () => {  
    
   }
// route definitions
app.get('/', async (req, res) => {
    // console.log('incoming cookie 🍪', req.cookies)
    if (req.cookies.userId) {
         res.redirect('users/profile')
    }else{console.log(res.locals.myData)
    console.log('the currently logged in user is:', res.locals.user)
    res.render('home.ejs')}
    
    
   
})
//Search page
app.get('/users/search', (req,res) => {
    res.render('users/search.ejs')
})
//Search results page
app.get('/results', (req, res) => {
    axios.get(`http://www.omdbapi.com/?s=${req.query.movieSearch}&apikey=${process.env.OMDB_API_KEY}`)
      .then(response => {
        res.render('results.ejs', { movies: response.data.Search })
      })
      .catch(console.log,)
  })
  //Read details of one movie
  app.get('/details/:id', (req, res) => {
    console.log(req.params.id)
    axios.get(`http://www.omdbapi.com/?i=${req.params.id}&apikey=${process.env.OMDB_API_KEY}`)
      .then(response => {
        console.log(response.data)
        res.render('users/detail.ejs', { movie: response.data })
      })
      .catch(console.log)
  })

  //Read all saved and display them 
app.get('/users/profile', async (req, res) => {
    try {
        const user = await db.user.findOne({
            where: { 
                email: res.locals.user.email
            }

         })
            const userSave = await user.getSaves()
            
            const allComments = await db.comment.findAll()

      res.render('users/profile.ejs', { userSave, allComments})
    } catch(err) {
      console.log(err)
      res.send('server error1')
    }
})
// change username page
app.get('/users/name', async (req, res) => {
    const user = await db.user.findOne({
        where: {email: res.locals.user.email}
    })
    res.render('users/name.ejs', {user})
    console.log('render log')
})

//update username route
app.put('/users/name', async (req,res)=> {
   
        try {
            await db.user.update({
            user_name: req.body.username,
                
            },{
                where: {id: res.locals.user.id}
            })
    res.redirect('/users/name')
    }catch(err) {
        console.log(err)
    }

})
// Create new saved movie
app.post('/users/profile', async (req, res) => {
     
    try {
        const [save, saveCreated] = await db.save.findOrCreate({
           
            where: {
                title: req.body.title,
                imdbID: req.body.imdbID,
                poster: req.body.poster
            }
        }) 
        const user = await db.user.findOne({
            where: {email: res.locals.user.email}
        })
        
        res.redirect('/users/profile') 
        await user.addSave(save)
    } catch(err) {
      console.log(err)
      res.send('server error2')
    }
  })

// Route to delete saved movies
app.delete('/users/profile/:id', async (req,res) => {
    try {

            await db.save.destroy({
            where: { id: req.params.id }
        })
       
        res.redirect('/users/profile')
    } catch(err){
        console.log(err)
    }
})


// Make comment
app.post('/users/profile/:id', async (req,res) => {
    try {
         await db.comment.findOrCreate({
        
        where:{
            user_name: req.body.user_name,
            paragraph: req.body.paragraph,
            saveId: req.params.id,
            userId: res.locals.user.id
        }
            
        })
        res.redirect('/users/profile')
    } catch(err){
        console.log(err)
    }
})


// Route to delete comments
app.delete('/user/profile/:id', async (req,res) => {
    try {

            await db.comment.destroy({
            where: { id: req.params.id }
        })
       
        res.redirect('/users/profile')
    } catch(err){
        console.log(err)
    }
})

      
// Controllers
app.use('/users', require('../project2/controllers/users'))

// listen on a port
app.listen(PORT, () => console.log(`you or your loved ones may be entitled to compensation on port: ${PORT}`))
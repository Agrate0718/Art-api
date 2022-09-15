require('dotenv').config()
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
// const db = require('./models')
const crypto = require('crypto-js')



// config express app/middlewares
const app = express()
const PORT = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())


app.get('/', (req, res) => {
    res.render('home.ejs')
    console.log('welcome home')
})
// listen on a port
app.listen(PORT, () => console.log(`Welcome to port ${PORT}`))
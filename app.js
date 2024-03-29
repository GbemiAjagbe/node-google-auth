const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const passport = require ('passport')
const session = require ('express-session')
const MongoStore = require('connect-mongo')
const homepage = require('./routes/homepage')
const auth = require('./routes/auth')

//Load config
dotenv.config({ path: './config/config.env' })

//Passport config
require('./config/passport')(passport)

connectDB()

const app = express()


//logging with Morgan
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))


//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use(homepage)
app.use(auth)

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}` ))
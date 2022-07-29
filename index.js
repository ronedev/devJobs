const mongoose = require('mongoose')
require('./config/db')
const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const router = require('./routes')

require('dotenv').config({path: 'variables.env'})

const app = express()

//Habilitando handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    helpers: require('./helpers/handlebars')
}))
app.set('view engine', 'handlebars')

//Utilizando los archivos estaticos
app.use(express.static(path.join(__dirname, 'public')))

app.use(cookieParser())

app.use(session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({mongoUrl: process.env.DATABASE})
}))

app.use('/', router())

app.listen(process.env.PORT)
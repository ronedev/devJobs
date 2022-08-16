const mongoose = require('mongoose')
require('./config/db')
const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const router = require('./routes')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const passport = require('./config/passport.js')
const createError = require('http-errors')

require('dotenv').config({path: 'variables.env'})

const app = express()

//Habilitar bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

//Validacion de campos
app.use(expressValidator())

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

//Inicializar passport
app.use(passport.initialize())
app.use(passport.session())

//Alertas y flash mensajes
app.use(flash())

//Crear nuestor middleware
app.use((req, res, next)=>{
    res.locals.messages = req.flash()
    next()
})

app.use('/', router())

//En caso de no encontrar la ruta seguira por el siguiente middelware, por eso utilice return next() en caso de algunos errores en los controladores
app.use((req, res, next)=>{
    next(createError(404, 'Página no encontrada'))
})

//Administración de los errores
app.use((error, req, res, next)=>{
    res.locals.message = error.message
    const status = error.status || 500
    res.locals.status = status
    res.status(status)
    res.render('error')
})

const host = "0.0.0.0"

app.listen(process.env.PORT, host, ()=>{
    console.log('El servidor esta corriendo')
})
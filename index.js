const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const router = require('./routes')

const app = express()

//Habilitando handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'layout'
}))
app.set('view engine', 'handlebars')

//Utilizando los archivos estaticos
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', router())

app.listen(5000)
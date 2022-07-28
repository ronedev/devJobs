const mongoose = require('mongoose')
require('dotenv').config({path: 'variables.env'})

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true
})

mongoose.connection.on('error', (error)=>{
    console.log(`Ha ocurrido un error con la conexion de la base de datos: ${error}`)
})
const express = require('express')
const homeController = require('../controllers/homeController.js')
const vacanciesController = require('../controllers/vacanciesController.js')

const router = express.Router()

module.exports = ()=>{
    router.get('/', homeController.showHome)

    //Crear vacante
    router.get('/vacantes/new', vacanciesController.formNewVacant)
    router.post('/vacantes/new', vacanciesController.addNewVacant)

    //Mostrar vacante
    router.get('/vacantes/:url', vacanciesController.showVacant)

    return router
}
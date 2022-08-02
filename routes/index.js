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

    //Editar vacante
    router.get('/vacantes/editar/:url', vacanciesController.editVacant)
    router.post('/vacantes/editar/:url', vacanciesController.saveEditVacant)

    return router
}
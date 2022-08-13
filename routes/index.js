const express = require('express')
const homeController = require('../controllers/homeController.js')
const vacanciesController = require('../controllers/vacanciesController.js')
const userController = require('../controllers/userController.js')
const authController = require('../controllers/authController.js')

const router = express.Router()

module.exports = ()=>{
    router.get('/', homeController.showHome)

    //Crear vacante
    router.get('/vacantes/new', authController.verifyUser,vacanciesController.formNewVacant)
    router.post('/vacantes/new', authController.verifyUser, vacanciesController.validateVacant, vacanciesController.addNewVacant)

    //Mostrar vacante
    router.get('/vacantes/:url', vacanciesController.showVacant)

    //Editar vacante
    router.get('/vacantes/edit/:url', authController.verifyUser, vacanciesController.editVacant)
    router.post('/vacantes/edit/:url', authController.verifyUser, vacanciesController.validateVacant, vacanciesController.saveEditVacant)

    //Eliminar vacante
    router.delete('/vacantes/eliminar/:id', vacanciesController.deleteVacant)

    //Crear cuenta
    router.get('/signup', userController.signupForm)
    router.post('/signup', userController.validateRecords, userController.signup)

    //Autenticar cuenta
    router.get('/login', userController.loginForm)
    router.post('/login', authController.authenticateUser)

    //Cerrar sesión
    router.get('/logout', authController.verifyUser, authController.logout)

    //Panel de administración
    router.get('/admin', authController.verifyUser, authController.showPane)

    //Editar perfil
    router.get('/edit-profile', authController.verifyUser, userController.editProfileForm)
    router.post('/edit-profile', authController.verifyUser, userController.validateProfile, userController.editProfile)

    return router
}
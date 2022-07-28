const express = require('express')
const homeController = require('../controllers/homeController.js')

const router = express.Router()

module.exports = ()=>{
    router.get('/', homeController.showHome)

    return router
}
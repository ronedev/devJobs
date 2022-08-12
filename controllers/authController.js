const passport = require('passport')
const mongoose = require('mongoose')
const Vacant = mongoose.model('Vacant')

exports.authenticateUser = passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

//middleware para verificar si el usuario se encuentra autenticado
exports.verifyUser = (req, res, next)=>{
    if(req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}

exports.showPane = async (req, res)=>{

    //Consultar las vacantes del usuario autenticado
    const vacancies = await Vacant.find({autor: req.user._id}).lean()

    res.render('admin', {
        page: 'DevJobs | Panel de administración',
        tagline: 'Administra tus vacantes desde aquí',
        vacancies
    })
}
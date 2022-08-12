const passport = require('passport')

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

exports.showPane = (req, res)=>{
    res.render('admin', {
        page: 'DevJobs | Panel de administración',
        tagline: 'Administra tus vacantes desde aquí'
    })
}
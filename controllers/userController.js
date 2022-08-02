const mongoose = require('mongoose')

exports.signupForm = (req, res)=>{
    res.render('crear-cuenta',{
        page: 'DevJobs | Crear cuenta',
        tagline: 'Crea tu cuenta y empieza a buscar los mejores talentos para tu empresa'
    })
}
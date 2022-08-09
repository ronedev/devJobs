const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.signupForm = (req, res)=>{
    res.render('crear-cuenta',{
        page: 'DevJobs | Crear cuenta',
        tagline: 'Crea tu cuenta y empieza a buscar los mejores talentos para tu empresa'
    })
}

exports.validateRecords = async (req, res, next)=>{
    req.checkBody('name', 'El nombre es obligatorio').notEmpty()

    const errores = req.validationErrors()

    console.log(errores)

    return
}

exports.signup = async (req, res, next) =>{
    //Crear el usuario
    const user = new User(req.body)

    const newUser = user.save()

    if(!newUser) return next()

    res.redirect('/login')
}
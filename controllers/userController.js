const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.signupForm = (req, res)=>{
    res.render('crear-cuenta',{
        page: 'DevJobs | Crear cuenta',
        tagline: 'Crea tu cuenta y empieza a buscar los mejores talentos para tu empresa'
    })
}

exports.validateRecords = async (req, res, next)=>{

    //sanitizar los datos
    req.sanitizeBody('name').escape()
    req.sanitizeBody('email').escape()
    req.sanitizeBody('password').escape()
    req.sanitizeBody('confirmPassword').escape()

    //validar datos
    req.checkBody('name', 'El nombre es obligatorio').notEmpty()
    req.checkBody('email', 'Ingrese un email valido').isEmail()
    req.checkBody('password', 'Ingrese una contraseña válida').notEmpty()
    req.checkBody('confirmPassword', 'Debe confirmar su contraseña correctamente').notEmpty()
    req.checkBody('confirmPassword', 'La contraseña es diferente').equals(req.body.password)

    const errores = req.validationErrors()

    if(errores){
        req.flash('error',errores.map(error => error.msg))

        res.render('crear-cuenta',{
            page: 'DevJobs | Crear cuenta',
            tagline: 'Crea tu cuenta y empieza a buscar los mejores talentos para tu empresa',
            messages: req.flash()
        })
        return
    }
    next()
}

exports.signup = async (req, res, next) =>{
    //Crear el usuario
    const user = new User(req.body)

    try {
        await user.save()
        res.redirect('/login')
    } catch (error) {
        req.flash('error', error)
        res.redirect('/signup')
    }
}

//Formulario para iniciar sesion
exports.loginForm = async (req, res)=>{
    res.render('login', {
        page: 'DevJobs | Login'
    })
}
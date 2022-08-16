const passport = require('passport')
const mongoose = require('mongoose')
const Vacant = mongoose.model('Vacant')
const User = mongoose.model('User')
const crypto = require('crypto')
const enviarEmail = require('../handlers/email.js')

exports.authenticateUser = passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err) return next(err)

        req.flash('correcto', 'Has cerrado sesión correctamente')
        res.redirect('/')
    })
}

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
        closeSession: true,
        userName: req.user.name,
        userImage: req.user.image,
        vacancies
    })
}

exports.formRestorePassword = (req, res)=>{
    res.render('restablecer-contraseña', {
        page: 'Restablece tu contraseña',
        tagline: 'Si ya tienes una cuenta pero olvidaste tu contraseña realiza los siguientes pasos:'
    })
}

exports.sendToken = async(req, res)=>{
    const { email } = req.body

    const user = await User.findOne({email})

    if(!user){
        req.flash('error', 'El email ingresado no corresponde a una cuenta registrada')
        return res.redirect('/login')
    }

    user.token = crypto.randomBytes(20).toString('hex')
    user.expires = Date.now() + 3600000

    await user.save()

    const resetUrl = `http://${req.headers.host}/restore-password/${user.token}`

    await enviarEmail.enviar({
        user,
        resetUrl,
        subject: 'Password reset',
        archivo: 'reset'
    })

    req.flash('correcto', 'Te enviamos un email con los pasos a seguir')
    res.redirect('/login')
}

exports.resetPassword = async(req, res)=>{
    const user = await User.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    })

    if(!user){
        req.flash('error', 'Ha ocurrido un error, por favor intentelo nuevamente')
        return res.redirect('/reset-password')
    }

    res.render('nueva-contraseña', {
        page: 'Modifica tu contraseña',
    })
}

exports.saveNewPassword = async(req, res)=>{
    const user = await User.findOne({
        token: req.params.token,
        expira: {
            $gt: Date.now()
        }
    })

    if(!user){
        req.flash('error', 'Ha ocurrido un error, por favor intentelo nuevamente')
        return res.redirect('/reset-password')
    }

    user.password = req.body.password
    user.token = undefined
    user.expira = undefined

    await user.save()

    req.flash('correcto', 'Contraseña modificada correctamente')
    res.redirect('/login')
}
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = mongoose.model('User')

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done)=>{
    const user = await User.findOne({email})

    if(!user) return done(null, false, {
        message: 'Usuario no existente'
    })

    //Comprobar si la contraseña ingresada es la correcta
    const verifyPassword = user.comparePassword(password)
    if(!verifyPassword) return done(null, false, {
        message: 'Contraseña incorrecta'
    })

    //Paso todas las validaciones
    return done(null, user)
}))

passport.serializeUser((usuario, done)=> done(null, usuario._id))

passport.deserializeUser(async (id, done)=>{
    const user = await User.findById(id)
    return done(null, user)
})

module.exports = passport
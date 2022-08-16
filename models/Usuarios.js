const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const bcrypt = require('bcrypt')

const usuariosSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    token: String,
    expires: Date,
    image: String
})

//Metodo para hashear password
usuariosSchema.pre('save', async function(next){
    //Si el password se encuenta hasheado
    if(!this.isModified('password')){
        return next()
    }
    //El password no esta hasheado
    const hash = await bcrypt.hash(this.password, 12)
    this.password = hash
    next()
})

usuariosSchema.post('save', function(error, doc, next){
    if(error.code === 11000){
        next('El correo ingresado pertenece a una cuenta existente')
    }else{
        next(error)
    }
})

//Autenticar usuarios
usuariosSchema.methods = {
    comparePassword: function(password){
        return bcrypt.compareSync(password, this.password)
    }
}


module.exports = mongoose.model('User', usuariosSchema)
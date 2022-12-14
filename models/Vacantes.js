const mongoose = require('mongoose')

mongoose.Promise = global.Promise
const slug = require('slug')
const shortid = require('shortid')

const vacantesSchema = new mongoose.Schema({
    title:{
        type: String,
        required: 'El titulo de la vacante es obligatorio',
        trim: true
    },
    enterprise:{
        type: String,
        trim: true
    },
    ubication:{
        type: String,
        required: 'La ubicación de la vacante es obligatoria',
        trim: true,
    },
    salary:{
        type: String,
        default: 0,
        trim: true
    },
    contract:{
        type: String
    },
    description:{
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true
    },
    skills:[String],
    candidates: [{
        name: String,
        email: String,
        cv: String
    }],
    autor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: 'El autor es obligatorio'
    }
})

vacantesSchema.pre('save', function(next){
    //Crear la url
    const url = slug(this.title)
    this.url = `${url}-${shortid.generate()}`

    next()
})

vacantesSchema.index({ title: 'text'})

module.exports = mongoose.model('Vacant', vacantesSchema)
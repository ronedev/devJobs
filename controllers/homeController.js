const mongoose = require('mongoose')
const Vacant = mongoose.model('Vacant')

exports.showHome = async (req, res, next)=>{

    const vacantes = await Vacant.find().lean() //.lean para obtener un json

    if(!vacantes) return next()
    res.render('home', {
        page: 'devJobs',
        tagline: 'Encuentra y pública trabajos para desarrolladores web',
        bar: true,
        button: true,
        vacantes
    })
}
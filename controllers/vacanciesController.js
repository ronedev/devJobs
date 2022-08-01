const mongoose = require('mongoose')
const Vacant = mongoose.model('Vacant')

exports.formNewVacant = (req, res)=>{
    res.render('new-vacant', {
        page: 'Crea tu vacante',
        tagline: 'Llena el formulario y publica tu vacante'
    })
}

exports.addNewVacant = async (req, res)=>{
    const vacant = new Vacant(req.body)

    //Crear arreglo de skills
    vacant.skills = req.body.skills.split(',')
    
    //Almacenar en base de datos
    const newVacant = await vacant.save()

    res.redirect(`/vacantes/${newVacant.url}`)
}
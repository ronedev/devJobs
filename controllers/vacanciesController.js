const mongoose = require('mongoose')
const Vacant = mongoose.model('Vacant')

exports.formNewVacant = (req, res)=>{
    res.render('new-vacant', {
        page: 'Crea tu vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        closeSession: true,
        userName: req.user.name
    })
}

exports.addNewVacant = async (req, res)=>{
    const vacant = new Vacant(req.body)

    vacant.autor = req.user._id

    //Crear arreglo de skills
    vacant.skills = req.body.skills.split(',')
    
    //Almacenar en base de datos
    const newVacant = await vacant.save()

    res.redirect(`/vacantes/${newVacant.url}`)
}

//Mostrar vacante
exports.showVacant = async (req, res, next)=>{
    const {url} = req.params

    const vacante = await Vacant.findOne({url}).lean()

    //Si no hay vacantes
    if(!vacante) return next()

    res.render('vacante',{
        page: `DevJobs | ${vacante.title}`,
        bar: true,
        vacante
    })
}

exports.editVacant = async (req, res, next)=>{
    const {url} = req.params
    const vacante = await Vacant.findOne({url}).lean()

    if(!vacante) return next()
    
    res.render('editar-vacante',{
        page: `Editar | ${vacante.title}`,
        closeSession: true,
        userName: req.user.name,
        vacante
    })
}

exports.saveEditVacant = async (req, res, next)=>{
    const {url} = req.params
    const updateVacant = req.body

    updateVacant.skills = req.body.skills.split(',')

    const vacante = await Vacant.findOneAndUpdate({url}, updateVacant,{
        new:true,
        runValidators: true
    })

    res.redirect(`/vacantes/${url}`)
}
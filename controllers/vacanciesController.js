const mongoose = require('mongoose')
const Vacant = mongoose.model('Vacant')
const multer = require('multer')
const shortid = require('shortid')

exports.formNewVacant = (req, res)=>{
    res.render('new-vacant', {
        page: 'Crea tu vacante',
        tagline: 'Llena el formulario y publica tu vacante',
        closeSession: true,
        userName: req.user.name,
        userImage: req.user.image
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

    const vacante = await Vacant.findOne({url}).populate('autor').lean()

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
        userImage: req.user.image,
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

exports.validateVacant = (req, res, next)=>{
    //Sanititzar los campos
    req.sanitizeBody('title').escape()
    req.sanitizeBody('enterprise').escape()
    req.sanitizeBody('ubication').escape()
    req.sanitizeBody('salary').escape()
    req.sanitizeBody('contract').escape()
    req.sanitizeBody('skills').escape()

    //Validar 
    req.checkBody('title', 'Agrega un título a tu vacante').notEmpty()
    req.checkBody('enterprise', 'Agrega una empresa a tu vacante').notEmpty()
    req.checkBody('ubication', 'Agrega una ubicación a tu vacante').notEmpty()
    req.checkBody('contract', 'Selecciona el tipo de contrato').notEmpty()
    req.checkBody('skills', 'Agrega al menos una habilidad').notEmpty()

    const errors = req.validationErrors()

    if(errors){
        //Recargar la vista con errores
        req.flash('error', errors.map(error => error.msg))
        
        return res.render('new-vacant', {
            page: 'Crea tu vacante',
            tagline: 'Llena el formulario y publica tu vacante',
            closeSession: true,
            userName: req.user.name,
            userImage: req.user.image,  
            messages: req.flash()
        })
    }

    next()
}

exports.deleteVacant = async (req, res)=>{
    const { id } = req.params

    const vacant = await Vacant.findById(id)

    if(verifyAutor(vacant, req.user)){
        //Eliminar propiedad
        vacant.remove()
        res.status(200).send('Se ha eliminado la vacante correctamente')
    }else{
        res.status(403).send('Ha ocurrido un error al eliminar la vacante')
    }
}

const verifyAutor = (vacant = {}, actualUser = {})=>{
    if(vacant.autor.equals(actualUser._id)){
        return true
    }
    return false
}

//Subir archivos en pdf
exports.uploadCV = (req, res, next)=>{
    upload(req, res, function(error){
        if(error){
            if(error instanceof multer.MulterError){//Verifica si es un error de multer
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error', 'El archivo seleccionado es demasiado grande, máximo 100kb')
                }else{
                    req.flash('error', error.message)
                }
            }else{
                req.flash('error', error.message)
            }
            res.redirect('back')
            return
        }else{
            return next()
        }
    })
}

const multerConfiguration = {
    limits: { fileSize: 400000},
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, callback)=>{
            callback(null, __dirname+'../../public/uploads/cv')
        },
        filename: (req, file, callback)=>{
            const extension = file.mimetype.split('/')[1]
            callback(null, `${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter(req, file, callback){
        if(file.mimetype === 'application/pdf'){
            callback(null, true)
        }else{
            callback(new Error('Formato no valido'), false)
        }
    }
}
const upload = multer(multerConfiguration).single('cv')

exports.contact = async (req, res, next)=>{

    const vacant = await Vacant.findOne({url: req.params.url})

    if(!vacant) return next()

    const newCandidate = {
        name: req.body.name,
        email: req.body.email,
        cv: req.file.filename
    }

    //Almacenar la vacante
    vacant.candidates.push(newCandidate)
    await vacant.save()

    req.flash('correcto', 'Te has postulado correctamente')
}

exports.showCandidates = async(req, res, next)=>{
    const {id} = req.params

    const vacant = await Vacant.findById(id).lean()

    if(!vacant) return next()
    if(vacant.autor != req.user._id.toString()) return next()

    res.render('candidatos',{
        page: `Candidatos vacante ${vacant.title}`,
        closeSession: true,
        userName: req.user.name,
        userImage: req.user.image,
        candidatos: vacant.candidates
    })
}

exports.searchVacant = async(req, res)=>{
    const vacant = await Vacant.find({
        $text: {
            $search: req.body.q
        }
    }).lean()

    res.render('home', {
        page: `Resultados para la busqueda ${req.body.q}`,
        bar: true,
        vacantes: vacant
    })
}
const mongoose = require('mongoose')
const User = mongoose.model('User')
const multer = require('multer')
const shortid = require('shortid')

exports.uploadImage = (req, res, next)=>{
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
            res.redirect('/admin')
            return
        }else{
            return next()
        }
    })
}


const multerConfiguration = {
    limits: { fileSize: 100000},
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, callback)=>{
            callback(null, __dirname+'../../public/uploads/profiles')
        },
        filename: (req, file, callback)=>{
            const extension = file.mimetype.split('/')[1]
            callback(null, `${shortid.generate()}.${extension}`)
        }
    }),
    fileFilter(req, file, callback){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
            callback(null, true)
        }else{
            callback(new Error('Formato no valido'), false)
        }
    }
}
const upload = multer(multerConfiguration).single('image')

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
exports.loginForm = (req, res)=>{
    res.render('login', {
        page: 'DevJobs | Login'
    })
}

//Formulario editar perfil
exports.editProfileForm = (req, res)=>{
    res.render('editar-perfil', {
        page: 'DevJobs | Edita tu perfil',
        user: {name: req.user.name, email: req.user.email, image: req.user.image},
        closeSession: true,
        userName: req.user.name,
        userImage: req.user.image
    })
}
//Guardar cambios editar perfil
exports.editProfile = async (req, res)=>{
    const user = await User.findById(req.user._id)

    user.name = req.body.name
    user.email = req.body.email
    if(req.body.password){
        user.password = req.body.password
    }

    if(req.file){
        user.image = req.file.filename
    }

    await user.save()

    req.flash('correcto', 'Cambios guardados correctamente')

    res.redirect('/admin')
}

//Sanititzar y validar el formulario de editar perfil

exports.validateProfile = (req, res, next)=>{
    //Sanitizar
    req.sanitizeBody('name').escape()
    req.sanitizeBody('email').escape()
    
    if(req.body.password){
        req.sanitizeBody('password').escape()
    }
    //Validar
    req.checkBody('name', 'El nombre no puede ir vacio').notEmpty()
    req.checkBody('email', 'El correo no puede ir vacio').notEmpty()

    const errors = req.validationErrors()

    if(errors){
        req.flash('error', errors.map(error => error.msg))
        return res.render('editar-perfil', {
            page: 'DevJobs | Edita tu perfil',
            user: {name: req.user.name, email: req.user.email},
            closeSession: true,
            userName: req.user.name,
            userImage: req.user.image,
            messages: req.flash()
        })       
    }
    next()
}
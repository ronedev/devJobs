exports.formNewVacant = (req, res)=>{
    res.render('new-vacant', {
        page: 'Crea tu vacante',
        tagline: 'Llena el formulario y publica tu vacante'
    })
}
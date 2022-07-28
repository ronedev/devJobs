exports.showHome = (req, res)=>{
    res.render('home', {
        page: 'devJobs',
        tagline: 'Encuentra y pública trabajos para desarrolladores web',
        bar: true,
        button: true
    })
}
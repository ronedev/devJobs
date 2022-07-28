exports.showHome = (req, res)=>{
    res.render('home', {
        page: 'debJobs',
        tagline: 'Encuentra y pública trabajos para desarrolladores web',
        bar: true,
        button: true
    })
}
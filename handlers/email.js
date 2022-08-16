const emailConfig = require('../config/emaill.js')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
const util = require('util')

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.post,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
})

transport.use('compile', hbs({
    viewEngine: {
        defaultLayout: 'reset.handlebars',
        partialsDir: __dirname + '/../views/emails',
        layoutsDir: __dirname + '/../views/emails',
        extName: '.handlebars',
    },
    viewPath: __dirname + '/../views/emails',
    extName: '.handlebars',
}))

exports.enviar = async(opcions)=>{
    const opcionsEmail = {
        from: 'devJobs <noreply@devjobs.com',
        to: opcions.user.email,
        subject: opcions.subject,
        template: opcions.archivo,
        context: {//Lo que tenga context va a poder ser utilizado en el template
            resetUrl: opcions.resetUrl
        }
    }

    const sendEmail = util.promisify(transport.sendMail, transport)
    return sendEmail.call(transport, opcionsEmail)
}
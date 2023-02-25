const nodemailer = require('nodemailer');
const smtp_config = require('./smtp.js');

const trasnporter = nodemailer.createTransport({
    host: smtp_config.host,
    port: smtp_config.port,
    secure: false,
    auth:{
        user: smtp_config.user,
        pass: smtp_config.pass
    }
})

function rec_pass(text, assunto, gmail){
    const mailSend = trasnporter.sendMail({
        //texto
        text: "senha",
        //assunto
        subject: "recuperar senha",
        //quem enviou
        from: "Whatzip <pedrocavalcantijs1@gmail.com>",
        // pra quem
        to: "pedromarfiano@gmail.com"
    }).then((message) => {
        console.log(message);
        return true
    }).catch((err) => {
        console.error(err);
        return false
    })
}

rec_pass();


const nodemailer = require('nodemailer');



//yahan files.js k 2nd post req se bhejenge ham wo data receive hoga inside curly braces shown
async function sendMail({from, to, subject, text, html}){ //html ka use ham email design krke bhejne mein krenge, text ignore hojayega agar html nahi denge toh text ignore nahi hoga
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        //name: process.env.SMTP,
        //host: process.env.SMTP_HOST,
        //port: process.env.SMTP_PORT,
        //secure: false,
        auth:{
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let info = await transporter.sendMail({//yewala sendmail node mailer  ki khud ki function hai pehle ham apna custom function bnarhe theyy
        from: `EasyShare<${from}>`,//senders address // key value same toh simple from se kaam chljayegafrom: from,
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        //tls: {rejectUnauthorized: false},
        html: html, // html body
    })
     console.log(info);
}


module.exports = sendMail;
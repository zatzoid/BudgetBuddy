const dotenv = require('dotenv');
dotenv.config();
const nodemailer = require('nodemailer');
const { emailSendedOk } = require('./EmailSendedOk')


const { EMAIL_HOST, EMAIL_HOST_PASSWORD, EMAIL_HOST_USER, EMAIL_PORT } = process.env;

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true,
    auth: {
        user: EMAIL_HOST_USER,
        pass: EMAIL_HOST_PASSWORD,
    },
});

module.exports = async function EmailSender(data, next) {
    // send mail with defined transport object
    try {
       
        const { mainData, message, emailTo } = data
        const info = await transporter.sendMail({
            from: `"BudgetBuddy" <${EMAIL_HOST_USER}>`, // sender address
            to: emailTo, // list of receivers
            subject: "Напоминалка от бюджетного чувака", // Subject line
            text: `${mainData.name, mainData.value}`, // plain text body
            html: `<b>Hello world?</b> 
            <p>${message || `Напоминаю  об оплате ${mainData.dateToSend}`}</p>
                <p>${mainData.name} </p>
                <p>${mainData.value} </p>`, // html body

        });
        console.log("Message sent: %s", info.messageId);
        if (info.messageId) {
            emailSendedOk(data)
        }
    }
    catch (err) {
        console.log(err)
    }

}
//
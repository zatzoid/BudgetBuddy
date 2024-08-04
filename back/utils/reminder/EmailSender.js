import { config } from 'dotenv';
config();
import { createTransport } from 'nodemailer';
import { emailSendedOk } from './EmailSendedOk.js';


const { EMAIL_HOST, EMAIL_HOST_PASSWORD, EMAIL_HOST_USER, EMAIL_PORT } = process.env;

const transporter = createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true,
    auth: {
        user: EMAIL_HOST_USER,
        pass: EMAIL_HOST_PASSWORD,
    },
});

export default async function EmailSender(data, next) {
    // send mail with defined transport object
    try {
        const date = new Date(data.dateToSend);
        const currentDay = date.getDate();
        const currentYear = date.getFullYear();
        const currentMonth = date.getMonth()
        const { mainData, message, emailTo } = data
        const info = await transporter.sendMail({
            from: `"BudgetBuddy" <${EMAIL_HOST_USER}>`, // sender address
            to: emailTo, // list of receivers
            subject: "Напоминалка от бюджетного чувака", // Subject line
            text: `${mainData.name, mainData.value}`, // plain text body
            html: `
            <h1>${mainData.kinde === 'profit' ? "Напоминаю о получении дохода" : "Напоминаю о расходе"}<h1>
            <p>${` ${currentDay}-${currentMonth}-${currentYear}`}</p>
                <p>${mainData.name} </p>
                <p>${mainData.value} </p>
               ${message ? `<p>${message} </p> `: ''}
                `
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
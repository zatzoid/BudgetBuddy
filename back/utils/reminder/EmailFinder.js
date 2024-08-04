import LPreminderData from '../../models/LPreminderData.js';
import EmailSender from './EmailSender.js';

export async function emailFinder(data) {
    try {
        const findedDataToSend = await LPreminderData.find({ dateToSend: data })
        if (findedDataToSend.length > 0) {
            findedDataToSend.map(el => EmailSender(el))
        }

    }
    catch (e) { console.log(e.message) }
}
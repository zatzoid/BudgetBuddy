const LPreminderData = require('../../models/LPreminderData');
const mongoose = require('mongoose');
const EmailSender = require('./EmailSender')

module.exports.emailFinder = async (data) => {
    try {
        const findedDataToSend = await LPreminderData.find({ dateToSend: data })
        if (findedDataToSend.length > 0) {
            findedDataToSend.map(el => EmailSender(el))
        }
        
    }
    catch (e) { console.log(e.message) }
}
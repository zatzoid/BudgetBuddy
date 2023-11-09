const LPreminderData = require('../models/LPreminderData');
const localPost = require('../models/localPost')

module.exports.createEmailDataToSend = async (req, res, next) => {
    try {
        const { date, mainData, message, emailTo } = req.body.data;
        const dateToSend = date;
        const { originalCashDataId, postId } = mainData;
        const dataReminder = await LPreminderData.create({ dateToSend, mainData: { name: mainData.name, value: mainData.value }, message, emailTo, originalCashDataId, postId });
        const updatedPost = await localPost.findOne({ _id: postId });
        if (updatedPost) {
            const targetElementId = originalCashDataId;
            const cashData = updatedPost.cashData;
            const profitIndex = cashData.profit.findIndex(
                (profitElement) => profitElement._id.toString() === targetElementId);
            const loseIndex = cashData.lose.findIndex(
                (loseElement) => loseElement._id.toString() === targetElementId);

            if (profitIndex !== -1) {
                cashData.profit[profitIndex].reminde = { status: 'added', data: { dateToSend: dateToSend, reminderId: dataReminder._id, message: dataReminder.message } };

            }
            else if (loseIndex !== -1) {
                cashData.lose[loseIndex].reminde = { status: 'added', data: { dateToSend: dateToSend, reminderId: dataReminder._id, message: dataReminder.message } };

            }

            await updatedPost.save();
        }
        return res.status(200).send({ message: `Писмьо придет на почту ${emailTo}, ${dateToSend} в 1:00 по МСК`, updatedPost })
    }
    catch (e) { return next(e) }
}
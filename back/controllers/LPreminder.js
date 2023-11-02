const LPreminderData = require('../models/LPreminderData');
const localPost = require('../models/localPost')

module.exports.createEmailDataToSend = async (req, res, next) => {
    try {

        const { date, mainData, message, emailTo } = req.body.data;
        const dateToSend = date;
        const { originalCashDataId, postId } = mainData
        await LPreminderData.create({ dateToSend, mainData, message, emailTo, originalCashDataId, postId })
        const updatedPost = await localPost.findOne({ _id: postId })
        if (updatedPost) {
            const targetElementId = originalCashDataId;
            const cashData = updatedPost.cashData;
            const profitIndex = cashData.profit.findIndex(
                (profitElement) => profitElement._id.toString() === targetElementId);
            const loseIndex = cashData.lose.findIndex(
                (loseElement) => loseElement._id.toString() === targetElementId);
  
            if (profitIndex !== -1) {
                cashData.profit[profitIndex].emailStatus = true;
                
            }
            else if (loseIndex !== -1) {
                cashData.lose[loseIndex].emailStatus = true;
               
            }

            await updatedPost.save();
        }
        return res.send({ updatedPost })
    }
    catch (e) { return next(e) }
}
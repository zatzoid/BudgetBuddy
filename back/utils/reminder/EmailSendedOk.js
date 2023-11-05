const LPreminderData = require('../../models/LPreminderData');
const localPost = require('../../models/localPost');

module.exports.emailSendedOk = async (data) => {
    try {
        /* finde post */
        const deletedData = await LPreminderData.findOneAndDelete({ _id: data._id });
        const lpPostToUpdate = await localPost.findById({ _id: data.postId });
        if (lpPostToUpdate) {
            const targetElementId = data.originalCashDataId.toString();
            const cashData = lpPostToUpdate.cashData;
            const profitIndex = cashData.profit.findIndex(
                (profitElement) => profitElement._id.toString() === targetElementId);
            const loseIndex = cashData.lose.findIndex(
                (loseElement) => loseElement._id.toString() === targetElementId);

            if (profitIndex !== -1) {
                cashData.profit[profitIndex].reminde = { status: 'sended', data: { dateToSend: data.dateToSend, reminderId: deletedData._id } };

            }
            else if (loseIndex !== -1) {
                cashData.lose[loseIndex].reminde = { status: 'sended', data: { dateToSend: data.dateToSend, reminderId: deletedData._id } };

            }

            await lpPostToUpdate.save();
        }
        console.log('пост удален', deletedData._id)

    }
    catch (e) { console.log(e) }
}
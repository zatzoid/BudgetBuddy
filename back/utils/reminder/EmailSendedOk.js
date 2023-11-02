const LPreminderData = require('../../models/LPreminderData');
const localPost = require('../../models/localPost');

module.exports.emailSendedOk = async (data) => {
    try {
        /* finde post */

        const deletedData = await LPreminderData.findOneAndDelete({ _id: data._id })
        console.log('пост удален', deletedData)

    }
    catch (e) { console.log(e) }
}
import  LPreminderData  from '../../models/LPreminderData.js';
import  localPost  from '../../models/localPost.js';

export async function emailSendedOk(data) {
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
                const currentReminde = cashData.profit[profitIndex].reminde;
                const updatedReminde = {
                    ...currentReminde,
                    status: 'sended'
                };
                cashData.profit[profitIndex].reminde = updatedReminde;

            }
            else if (loseIndex !== -1) {
                const currentReminde = cashData.lose[loseIndex].reminde;
                const updatedReminde = {
                    ...currentReminde,
                    status: 'sended'
                };
                cashData.lose[loseIndex].reminde = updatedReminde;

            }

            await lpPostToUpdate.save();
        }
        console.log('пост удален', deletedData._id)

    }
    catch (e) { console.log(e) }
}
import { useState } from "react";
import { localPostApi } from "../api/apiLocal";
import { CashData, EmailModalParams, LocalPost, MetaData } from "../types";

interface callBack {
    callBack: (res: MetaData, data: LocalPost) => void
    callBackResMsg: (data: MetaData) => void
}

export const useEmailModal = (data: callBack) => {

    const [emailModalData, setEmailModalData] = useState<CashData | null>(null);
    const [emailModalLodaing, setEmailModalLoading] = useState<boolean>(false);


    async function submitEmailModal(emaildata: EmailModalParams) {
        try {
            setEmailModalLoading(true);
            const { metaData, content } = await localPostApi.mailReminder(emaildata);
            setEmailModalLoading(false);
            data.callBack(metaData, content)
        }
        catch (e) {
            setEmailModalLoading(false);
            console.log(e)
            data.callBackResMsg({message: 'Эта функция доступна только в онлайн режиме', statusCode: 405})
            return { data: { message: 'ошибка' }, statusCode: 500 }
        }

    }
    function openEmailModal(data: CashData | null) {

        if (data !== null) {

            setEmailModalData(data)
        } else {
            setEmailModalData(null)
        }

    }
    return { emailModalData, emailModalLodaing, submitEmailModal, openEmailModal }
}
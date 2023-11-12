import React, { useState } from "react";
import { localPostApi } from "../api/apiLocal";

export const useEmailModal = () => {
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailModalData, setEmailModalData] = useState(null);
    const [emailModalLodaing, setEmailModalLoading] = useState(false);
    async function submitEmailModal(data) {
        try {
            setEmailModalLoading(true);
            const response = await localPostApi.mailReminder(data);
            setEmailModalLoading(false);
            return response
        }
        catch (e) {
            setEmailModalLoading(false);
            console.log(e)
        }

    }
    function openEmailModal({ show, data, reminde }) {
        if (data) {
            setEmailModalData({ data, reminde })
        }
        setShowEmailModal(show)
    }
    return { showEmailModal, emailModalData, emailModalLodaing, submitEmailModal, openEmailModal }
}
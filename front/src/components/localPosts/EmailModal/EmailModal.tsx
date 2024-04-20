import React, { FormEvent, useEffect, useState } from "react";
import Border from "../../ui/border/Border";
import { CashData, EmailModalParams } from "../../../utils/types";
import { CurrentContext } from "../../Context";
interface props {
    submitForm: (data: EmailModalParams) => void
    openEmailModal: (data: CashData | null) => void
    emailModalData: CashData
}

export default function EmailModal(props: props) {
    const {userData} = React.useContext(CurrentContext);
    const [dateFocus, setDateFocus] = useState<boolean>(false);
    const [dateValue, setDateValue] = useState<string>('');
    const [otherTextValue, setOtherTextValue] = useState<string>('Просто напомнить');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    const modalData = (props.emailModalData as CashData)
    function submit(e: FormEvent) {
        e.preventDefault()
        const cashData = props.emailModalData
        const message = otherTextValue || 'Просто напомнить';
        props.submitForm({
            date: dateValue,
            mainData: (cashData as CashData),
            message: message,
            emailTo: (userData?.email as string)
        });
        props.openEmailModal(null)
    }
    useEffect(() => {
        console.log(props.emailModalData);
        if (props.emailModalData !== null && props.emailModalData.reminde.status !== null) {

            setDateValue(modalData.reminde.data.dateToSend);
            setOtherTextValue(modalData.reminde.data.message);


        }
    }, [props.emailModalData])

    return (
        <div className="email-wrapper">
            <div className="email">
                <h2 className="email__heading">{`${props.emailModalData.reminde.status === null ? 'Отправка письма' : ''}
                ${props.emailModalData.reminde.status === 'added' ? `Письмо ожидает отправки` : ''}
                ${props.emailModalData.reminde.status === 'sended' ? `Письмо отправлено вам на почту` : ''}`}</h2>
                <form
                    onSubmit={(e) => { submit(e) }}
                    className="email__form">
                    <p className="email__label-date">{`${props.emailModalData.reminde.status === null ? 'Выберите дату когда напоминанть' : 'Дата отправки:'}`}</p>
                    <input
                        value={dateValue}
                        onChange={(e) => { setDateValue(e.target.value) }}
                        onFocus={() => { setDateFocus(true) }}
                        onBlur={() => { setDateFocus(false) }}
                        min={`${currentYear}-${currentMonth}-${currentDay + 1}`}
                        required
                        disabled={props.emailModalData.reminde.status !== null}
                        className="email__imput-date"
                        type="date" />
                    <Border onFocus={dateFocus} />
                    <div className="email__target-el">
                        <p className="email__target-el-name">{Object.keys(props.emailModalData.data)}</p>
                        <p className="email__target-el-value">{Object.values(props.emailModalData.data)}</p>
                    </div>
                    <textarea
                        onChange={(e) => { setOtherTextValue(e.target.value) }}
                        value={otherTextValue}
                        disabled={props.emailModalData.reminde.status !== null}
                        className="email__imput-text"
                        placeholder="Можете добавить уточнение(это не обязательно)" />

                    <div className="email__btn-wrapper">
                        <button
                            disabled={props.emailModalData.reminde.status !== null}
                            className="email__btn email__btn_submit">Отправить</button>
                        <button
                            type="button"
                            onClick={() => { props.openEmailModal(null) }}
                            className="email__btn email__btn_cancel">Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
import React, { useEffect, useState } from "react";
import Border from "../border/Border";

export default function EmailModal(props) {
    const [dateFocus, setDateFocus] = useState(false);
    const [dateValue, setDateValue] = useState(null);
    const [otherTextValue, setOtherTextValue] = useState(null);
    function submit(e) {
        e.preventDefault()
        const mainData = {
            name: props.emailModalData.data.name,
            value: props.emailModalData.data.value,
            originalCashDataId: props.emailModalData.data.originalCashDataId,
            postId: props.emailModalData.data.postId
        };
        const message = otherTextValue || null;
        props.submitForm({ date: dateValue, mainData, message });
        props.openEmailModal({ show: false })
    }
    useEffect(() => {
        if (props.emailModalData.reminde.status !== null) {
            setDateValue(props.emailModalData.reminde.data.dateToSend);
            setOtherTextValue(props.emailModalData.reminde.data.message);
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
                        value={dateValue || ''}
                        onChange={(e) => { setDateValue(e.target.value) }}
                        onFocus={() => { setDateFocus(true) }}
                        onBlur={() => { setDateFocus(false) }}
                        required
                        disabled={props.emailModalData.reminde.status !== null}
                        className="email__imput-date"
                        type="date" />
                    <Border onFocus={dateFocus} />
                    <div className="email__target-el">
                        <p className="email__target-el-name">{props.emailModalData.data.name}</p>
                        <p className="email__target-el-value">{props.emailModalData.data.value}</p>
                    </div>
                    <textarea
                        onChange={(e) => { setOtherTextValue(e.target.value) }}
                        value={otherTextValue || ''}
                        disabled={props.emailModalData.reminde.status !== null}
                        className="email__imput-text"
                        placeholder="Можете добавить уточнение(это не обязательно)" />

                    <div className="email__btn-wrapper">
                        <button
                            disabled={props.emailModalData.reminde.status !== null}
                            className="email__btn email__btn_submit">Отправить</button>
                        <button
                            type="button"
                            onClick={() => { props.openEmailModal({ show: false }) }}
                            className="email__btn email__btn_cancel">Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
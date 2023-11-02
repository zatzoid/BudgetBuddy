import React, { useState } from "react";
import Border from "../border/Border";

export default function EmailModal(props) {
    const [dateFocus, setDateFocus] = useState(false);
    const [dateValue, setDateValue] = useState(null);
    const [otherTextValue, setOtherTextValue] = useState(null);
    function submit(e) {
        e.preventDefault()
        const mainData = { name: props.emailModalData.name, value: props.emailModalData.value, originalCashDataId: props.emailModalData.originalCashDataId, postId: props.emailModalData.postId };
        const message = otherTextValue || null;
        props.submitForm({ date: dateValue, mainData, message });
        props.openEmailModal({ show: false })
    }

    return (
        <div className="email-wrapper">
            <div className="email">
                <h2 className="email__heading">Отправка письма</h2>
                <form
                    onSubmit={(e) => { submit(e) }}
                    className="email__form">
                    <p className="email__label-date">Выберите дату когда напоминанть</p>
                    <input
                        value={dateValue || ''}
                        onChange={(e) => { setDateValue(e.target.value) }}
                        onFocus={() => { setDateFocus(true) }}
                        onBlur={() => { setDateFocus(false) }}
                        required
                        className="email__imput-date"
                        type="date" />
                    <Border onFocus={dateFocus} />
                    <div className="email__target-el">
                        <p className="email__target-el-name">{props.emailModalData.name}</p>
                        <p className="email__target-el-value">{props.emailModalData.value}</p>
                    </div>
                    <textarea
                        onChange={(e) => { setOtherTextValue(e.target.value) }}
                        value={otherTextValue || ''}
                        className="email__imput-text"
                        placeholder="Можете добавить уточнение(это не обязательно)" />
                    <div className="email__btn-wrapper">
                        <button className="email__btn email__btn_submit">Отправить</button>
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
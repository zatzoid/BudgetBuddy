import React, { useEffect, useState } from "react";
import Border from "../../border/Border";
import VisualBtn from "../../visualbtn/VisualBtn";
import ShowMoreBtn from "../../showMoreBtn/ShowMoreBtn";
import useFormWithValidation from "../../../utils/customHooks/validator";

export default function LocalPostForm(props) {
    const { values, handleChange, resetForm, errors, isValid } = useFormWithValidation()
    const [focusKey, setFocusKey] = useState(false);
    const [focusValue, setFocusValue] = useState(false);
    const [categoryValue, setCategoryValue] = useState('another');
    const [showCategory, setShowCategory] = useState(false);
    const [formShowed, setFormShowed] = useState(false);


    function submit(e) {
        e.preventDefault();
        props.submitForm({ values, kinde: props.kinde, category: categoryValue });
        resetForm()

        setShowCategory(false)

    }
    useEffect(() => {
        if (props.LPResMsg !== null && props.LPResMsg.status) {
            resetForm()
        }
    }, [props.LPResMsg]);

    function openCategory() {
        if (showCategory) {
            setShowCategory(false)
            return
        }
        setShowCategory(true);
    }
    function choisCategory(data) {
        setCategoryValue(data)
        setTimeout(() => {
            openCategory()
        }, 500);

    }
    function switchShowedForm() {
        if (formShowed) {
            setFormShowed(false)
            setShowCategory(false)
        } else {
            setFormShowed(true)
        }
    }

    return (
        <> <button className={`local-posts__form-heading ${formShowed && 'local-posts__form-heading_active'}`}
            onClick={() => switchShowedForm()}>
            {props.heading}
        </button>
            <form noValidate
            className={`local-posts__form ${formShowed && 'local-posts__form_active'}`}
                onSubmit={(e) => { submit(e) }}>

                <input
                    disabled={props.isLoadingLP}
                    required
                    onChange={(e) => { handleChange(e) }}
                    value={values.key || ''}
                    placeholder="Название"
                    className="local-posts__form-input"
                    name="key"
                    type="text"
                    pattern="^[a-zA-Zа-яА-Я0-9 ]*$"
                    maxLength={25}
                    minLength={1}
                    onFocus={() => { setFocusKey(true) }}
                    onBlur={() => { setFocusKey(false) }}

                />
                <Border onFocus={focusKey} onError={errors.key}/>
                <span className="lp__form-input-err-msg">{errors.key || ''}</span>
                <input
                    disabled={props.isLoadingLP}
                    required
                    onChange={(e) => { handleChange(e) }}
                    value={values.value || ''}
                    placeholder="Сумма"
                    className="local-posts__form-input"
                    name="value"
                    type="number"
                    min='1'
                    onFocus={() => { setFocusValue(true) }}
                    onBlur={() => { setFocusValue(false) }} />
                <Border onFocus={focusValue} onError={errors.value}/>
                <span className="lp__form-input-err-msg">{errors.value || ''}</span>
                <button className="lp__form-type-btn"
                    type="button"
                    onClick={() => { openCategory() }}>
                    <p className="lp__form-heading-type">Выберите категорию</p>
                    <ShowMoreBtn active={showCategory} />
                </button>
                <div className={`lp-form-type-container ${showCategory && 'lp-form-type-container_active'}`}>
                    {props.kinde === 'lose' ? <>
                        <label className="lp__form-type-label">
                            <input
                                type='radio'
                                name='typeof'
                                value='transport'
                                onChange={(e) => { choisCategory(e.target.value) }}
                                className="lp__form-type-input"
                            />
                            <span className="lp__form-type-input-btn back-img_transport"></span>
                            транспорт
                        </label>
                        <label className="lp__form-type-label">
                            <input
                                type='radio'
                                name='typeof'
                                value='jkh'
                                onChange={(e) => { choisCategory(e.target.value) }}
                                className="lp__form-type-input"
                            />
                            <span className="lp__form-type-input-btn back-img_jkh"></span>
                            жкх
                        </label>

                        <label className="lp__form-type-label">
                            <input
                                type='radio'
                                name='typeof'
                                value='food'
                                onChange={(e) => { choisCategory(e.target.value) }}
                                className="lp__form-type-input"
                            />
                            <span className="lp__form-type-input-btn back-img_food"></span>
                            питание
                        </label>
                        <label className="lp__form-type-label">
                            <input
                                type='radio'
                                name='typeof'
                                value='fun'
                                onChange={(e) => { choisCategory(e.target.value) }}
                                className="lp__form-type-input"
                            />
                            <span className="lp__form-type-input-btn back-img_fun"></span>
                            развлечения
                        </label>
                        <label className="lp__form-type-label"> <input
                            type='radio'
                            name='typeof'
                            value='vzyatka'
                            onChange={(e) => { choisCategory(e.target.value) }}
                            className="lp__form-type-input"
                        />
                            <span className="lp__form-type-input-btn back-img_vzyatka"></span>
                            взятка
                        </label>
                        <label className="lp__form-type-label"> <input
                            type='radio'
                            name='typeof'
                            value='another'
                            defaultChecked
                            onChange={(e) => { choisCategory(e.target.value) }}
                            className="lp__form-type-input"
                        />
                            <span className="lp__form-type-input-btn back-img_another"></span>
                            другое
                        </label>
                    </> :
                        <>
                            <label className="lp__form-type-label"> <input
                                type='radio'
                                name='typeof'
                                value='mining'
                                onChange={(e) => { choisCategory(e.target.value) }}
                                className="lp__form-type-input"
                            />
                                <span className="lp__form-type-input-btn back-img_mining"></span>
                                майнинг
                            </label>
                            <label className="lp__form-type-label"> <input
                                type='radio'
                                name='typeof'
                                value='zp'
                                onChange={(e) => { choisCategory(e.target.value) }}
                                className="lp__form-type-input"
                            />
                                <span className="lp__form-type-input-btn back-img_zp"></span>
                                зарплата
                            </label>
                            <label className="lp__form-type-label"> <input
                                type='radio'
                                name='typeof'
                                value='another'
                                defaultChecked
                                onChange={(e) => { choisCategory(e.target.value) }}
                                className="lp__form-type-input"
                            />
                                <span className="lp__form-type-input-btn back-img_another"></span>
                                другое
                            </label>
                        </>}
                </div>
                <div className="local-posts__from-btn-wrapper">
                    <button
                        className="local-posts__from-btn local-posts__from-btn_sbmt"
                        type="submit"
                        disabled={props.isLoadingLP || !isValid}
                    ><VisualBtn confirm={true} loading={props.isLoadingLP} /> </button>
                    <button
                        onClick={() => { resetForm() }}
                        className="local-posts__from-btn local-posts__from-btn_reset"
                        type="reset"
                        disabled={props.isLoadingLP}
                    ><VisualBtn cancel={true} loading={props.isLoadingLP} /> </button>
                </div>
            </form>
        </>
    )

}